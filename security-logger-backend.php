<?php
// ========================================
// SYSTÈME DE LOGGING BACKEND SÉCURISÉ
// Morgan Digital Landing Page - Logging Server-Side
// ========================================

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://www.morgandigital.fr');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');

// Force HTTPS
if (!isset($_SERVER['HTTPS']) || $_SERVER['HTTPS'] !== 'on') {
    http_response_code(400);
    die(json_encode(['error' => 'HTTPS required']));
}

class SecureLogger {
    private $logDir;
    private $alertConfig;
    private $maxLogSize;
    private $retentionDays;
    
    public function __construct() {
        $this->logDir = __DIR__ . '/logs/security';
        $this->maxLogSize = 50 * 1024 * 1024; // 50MB par fichier de log
        $this->retentionDays = 90; // Garder les logs 90 jours
        
        // Configuration des alertes
        $this->alertConfig = [
            'email' => 'heldt.morgan@proton.me',
            'webhook_url' => 'https://hooks.slack.com/services/YOUR/WEBHOOK/URL', // Optionnel
            'high_severity_threshold' => 5, // Nombre d'événements avant alerte
            'alert_cooldown' => 3600 // 1 heure entre les alertes
        ];
        
        $this->initializeLogging();
    }
    
    private function initializeLogging() {
        // Créer les dossiers de logs
        if (!is_dir($this->logDir)) {
            mkdir($this->logDir, 0755, true);
        }
        
        // Créer les sous-dossiers par type
        $logTypes = ['security', 'events', 'performance', 'errors'];
        foreach ($logTypes as $type) {
            $typeDir = $this->logDir . '/' . $type;
            if (!is_dir($typeDir)) {
                mkdir($typeDir, 0755, true);
            }
        }
        
        // Nettoyer les anciens logs
        $this->cleanOldLogs();
    }
    
    /**
     * Point d'entrée principal pour les logs
     */
    public function handleLogRequest() {
        try {
            // Vérifier la méthode HTTP
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                http_response_code(405);
                throw new Exception('Method not allowed');
            }
            
            // Récupérer et valider les données
            $rawInput = file_get_contents('php://input');
            $input = json_decode($rawInput, true);
            
            if (!$input || !isset($input['logs'])) {
                throw new Exception('Invalid payload');
            }
            
            // Valider le rate limiting
            $clientIP = $this->getClientIP();
            if (!$this->checkRateLimit($clientIP)) {
                http_response_code(429);
                throw new Exception('Rate limit exceeded');
            }
            
            // Traiter chaque log
            $processedCount = 0;
            $alertTriggered = false;
            
            foreach ($input['logs'] as $log) {
                if ($this->validateLogEntry($log)) {
                    $this->processLogEntry($log, $clientIP);
                    $processedCount++;
                    
                    // Vérifier si une alerte doit être déclenchée
                    if (!$alertTriggered && $this->shouldTriggerAlert($log)) {
                        $this->triggerSecurityAlert($log, $clientIP);
                        $alertTriggered = true;
                    }
                }
            }
            
            // Réponse de succès
            echo json_encode([
                'success' => true,
                'processed' => $processedCount,
                'timestamp' => date('c')
            ]);
            
        } catch (Exception $e) {
            // Logger l'erreur du système de logging lui-même
            $this->logSystemError($e->getMessage(), $this->getClientIP());
            
            http_response_code(400);
            echo json_encode(['error' => 'Logging failed']);
        }
    }
    
    /**
     * Valide une entrée de log
     */
    private function validateLogEntry($log) {
        $requiredFields = ['type', 'event', 'timestamp', 'sessionId'];
        
        foreach ($requiredFields as $field) {
            if (!isset($log[$field])) {
                return false;
            }
        }
        
        // Valider le type
        if (!in_array($log['type'], ['security', 'event', 'performance', 'error'])) {
            return false;
        }
        
        // Valider le timestamp
        if (!strtotime($log['timestamp'])) {
            return false;
        }
        
        // Valider la session ID
        if (!preg_match('/^[a-f0-9]{32}$/', $log['sessionId'])) {
            return false;
        }
        
        return true;
    }
    
    /**
     * Traite et sauvegarde une entrée de log
     */
    private function processLogEntry($log, $clientIP) {
        // Enrichir le log avec des données serveur
        $enrichedLog = array_merge($log, [
            'server_timestamp' => date('c'),
            'client_ip_hash' => hash('sha256', $clientIP),
            'request_id' => $this->generateRequestId(),
            'server_info' => [
                'php_version' => PHP_VERSION,
                'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'unknown',
                'request_uri' => $_SERVER['REQUEST_URI'] ?? 'unknown'
            ]
        ]);
        
        // Déterminer le fichier de log
        $logFile = $this->getLogFile($log['type']);
        
        // Formatter et écrire le log
        $logLine = json_encode($enrichedLog, JSON_UNESCAPED_UNICODE) . PHP_EOL;
        file_put_contents($logFile, $logLine, FILE_APPEND | LOCK_EX);
        
        // Vérifier la taille du fichier et rotation si nécessaire
        $this->rotateLogIfNeeded($logFile);
        
        // Processing spécifique par type
        switch ($log['type']) {
            case 'security':
                $this->processSecurityLog($enrichedLog);
                break;
                
            case 'error':
                $this->processErrorLog($enrichedLog);
                break;
                
            case 'performance':
                $this->processPerformanceLog($enrichedLog);
                break;
        }
    }
    
    /**
     * Traitement spécifique des logs de sécurité
     */
    private function processSecurityLog($log) {
        // Compter les événements de sécurité par IP
        $this->incrementSecurityCounter($log['client_ip_hash'], $log['event']);
        
        // Analyser les patterns suspects
        $this->analyzeSecurityPattern($log);
        
        // Alertes immédiates pour événements critiques
        $criticalEvents = [
            'script_injection_attempt',
            'csrf_token_manipulation', 
            'sql_injection_attempt',
            'xss_attempt'
        ];
        
        if (in_array($log['event'], $criticalEvents)) {
            $this->triggerImmediateAlert($log);
        }
    }
    
    /**
     * Traitement spécifique des logs d'erreur
     */
    private function processErrorLog($log) {
        // Grouper les erreurs similaires
        $errorHash = md5($log['event'] . ($log['data']['message'] ?? ''));
        $this->incrementErrorCounter($errorHash);
        
        // Alerter si trop d'erreurs du même type
        if ($this->getErrorCount($errorHash) > 10) {
            $this->triggerErrorAlert($log, $errorHash);
        }
    }
    
    /**
     * Traitement spécifique des logs de performance
     */
    private function processPerformanceLog($log) {
        // Analyser les métriques de performance
        if (isset($log['data']['duration']) && $log['data']['duration'] > 5000) {
            $this->logPerformanceIssue($log);
        }
        
        // Surveiller l'usage mémoire
        if (isset($log['data']['ratio']) && $log['data']['ratio'] > 95) {
            $this->triggerMemoryAlert($log);
        }
    }
    
    /**
     * Système d'alertes sécurisé
     */
    private function shouldTriggerAlert($log) {
        if ($log['type'] !== 'security') {
            return false;
        }
        
        // Vérifier le cooldown des alertes
        $alertFile = $this->logDir . '/alert_cooldown.json';
        if (file_exists($alertFile)) {
            $cooldownData = json_decode(file_get_contents($alertFile), true);
            if (time() - $cooldownData['last_alert'] < $this->alertConfig['alert_cooldown']) {
                return false;
            }
        }
        
        // Vérifier le seuil d'événements
        $clientHash = hash('sha256', $this->getClientIP());
        $eventCount = $this->getSecurityEventCount($clientHash);
        
        return $eventCount >= $this->alertConfig['high_severity_threshold'];
    }
    
    private function triggerSecurityAlert($log, $clientIP) {
        $alertData = [
            'type' => 'security_threshold_exceeded',
            'timestamp' => date('c'),
            'client_ip_hash' => hash('sha256', $clientIP),
            'event_details' => $log,
            'threshold' => $this->alertConfig['high_severity_threshold']
        ];
        
        // Sauvegarder l'alerte
        $alertFile = $this->logDir . '/alerts/' . date('Y-m-d') . '_alerts.log';
        $alertDir = dirname($alertFile);
        if (!is_dir($alertDir)) {
            mkdir($alertDir, 0755, true);
        }
        
        file_put_contents($alertFile, json_encode($alertData) . PHP_EOL, FILE_APPEND | LOCK_EX);
        
        // Envoyer notification email
        $this->sendEmailAlert($alertData);
        
        // Mettre à jour le cooldown
        file_put_contents($this->logDir . '/alert_cooldown.json', json_encode([
            'last_alert' => time(),
            'alert_count' => $this->getAlertCount() + 1
        ]));
    }
    
    private function triggerImmediateAlert($log) {
        $alertData = [
            'type' => 'critical_security_event',
            'timestamp' => date('c'),
            'event' => $log['event'],
            'severity' => 'CRITICAL',
            'details' => $log
        ];
        
        // Log critique
        $criticalLogFile = $this->logDir . '/critical/' . date('Y-m-d') . '_critical.log';
        $criticalDir = dirname($criticalLogFile);
        if (!is_dir($criticalDir)) {
            mkdir($criticalDir, 0755, true);
        }
        
        file_put_contents($criticalLogFile, json_encode($alertData) . PHP_EOL, FILE_APPEND | LOCK_EX);
        
        // Email immédiat
        $this->sendCriticalAlert($alertData);
    }
    
    /**
     * Système d'email d'alerte
     */
    private function sendEmailAlert($alertData) {
        $to = $this->alertConfig['email'];
        $subject = '[SÉCURITÉ] Morgan Digital - Seuil de sécurité dépassé';
        
        $message = "ALERTE DE SÉCURITÉ - Morgan Digital Landing Page\n\n";
        $message .= "Type: " . $alertData['type'] . "\n";
        $message .= "Timestamp: " . $alertData['timestamp'] . "\n";
        $message .= "Client IP Hash: " . $alertData['client_ip_hash'] . "\n";
        $message .= "Seuil dépassé: " . $alertData['threshold'] . " événements\n\n";
        $message .= "Détails du dernier événement:\n";
        $message .= "- Événement: " . $alertData['event_details']['event'] . "\n";
        $message .= "- Sévérité: " . ($alertData['event_details']['severity'] ?? 'medium') . "\n";
        $message .= "- Session ID: " . $alertData['event_details']['sessionId'] . "\n\n";
        $message .= "Vérifiez les logs pour plus de détails.\n";
        
        $headers = [
            'From: security@morgandigital.fr',
            'Reply-To: security@morgandigital.fr',
            'X-Priority: 1',
            'X-MSMail-Priority: High',
            'Importance: High'
        ];
        
        mail($to, $subject, $message, implode("\r\n", $headers));
    }
    
    private function sendCriticalAlert($alertData) {
        $to = $this->alertConfig['email'];
        $subject = '[CRITIQUE] Morgan Digital - Événement de sécurité critique';
        
        $message = "🚨 ALERTE CRITIQUE - Morgan Digital Landing Page 🚨\n\n";
        $message .= "Un événement de sécurité critique a été détecté:\n\n";
        $message .= "Événement: " . $alertData['event'] . "\n";
        $message .= "Timestamp: " . $alertData['timestamp'] . "\n";
        $message .= "Sévérité: CRITIQUE\n\n";
        $message .= "ACTION IMMÉDIATE REQUISE\n\n";
        $message .= "Détails complets dans les logs de sécurité.\n";
        
        $headers = [
            'From: critical-security@morgandigital.fr',
            'Reply-To: critical-security@morgandigital.fr',
            'X-Priority: 1',
            'X-MSMail-Priority: High',
            'Importance: High'
        ];
        
        mail($to, $subject, $message, implode("\r\n", $headers));
    }
    
    /**
     * Utilitaires de logging
     */
    private function getLogFile($type) {
        $date = date('Y-m-d');
        return $this->logDir . '/' . $type . '/' . $date . '_' . $type . '.log';
    }
    
    private function rotateLogIfNeeded($logFile) {
        if (file_exists($logFile) && filesize($logFile) > $this->maxLogSize) {
            $rotatedFile = $logFile . '.' . time();
            rename($logFile, $rotatedFile);
            
            // Compresser le fichier rotaté
            if (function_exists('gzopen')) {
                $this->compressLogFile($rotatedFile);
            }
        }
    }
    
    private function compressLogFile($file) {
        $compressed = $file . '.gz';
        $input = fopen($file, 'rb');
        $output = gzopen($compressed, 'wb9');
        
        if ($input && $output) {
            while (!feof($input)) {
                gzwrite($output, fread($input, 8192));
            }
            fclose($input);
            gzclose($output);
            unlink($file); // Supprimer l'original
        }
    }
    
    private function cleanOldLogs() {
        $cutoffDate = strtotime('-' . $this->retentionDays . ' days');
        $logTypes = ['security', 'events', 'performance', 'errors', 'alerts', 'critical'];
        
        foreach ($logTypes as $type) {
            $typeDir = $this->logDir . '/' . $type;
            if (is_dir($typeDir)) {
                $files = glob($typeDir . '/*');
                foreach ($files as $file) {
                    if (filemtime($file) < $cutoffDate) {
                        unlink($file);
                    }
                }
            }
        }
    }
    
    /**
     * Rate limiting
     */
    private function checkRateLimit($clientIP, $limit = 100, $window = 300) {
        $rateLimitFile = sys_get_temp_dir() . '/morgan_log_rate_' . md5($clientIP) . '.json';
        
        $attempts = [];
        if (file_exists($rateLimitFile)) {
            $attempts = json_decode(file_get_contents($rateLimitFile), true) ?? [];
        }
        
        // Nettoyer les anciennes tentatives
        $now = time();
        $attempts = array_filter($attempts, function($timestamp) use ($now, $window) {
            return ($now - $timestamp) < $window;
        });
        
        if (count($attempts) >= $limit) {
            $this->logSystemError('Rate limit exceeded for logging', $clientIP);
            return false;
        }
        
        $attempts[] = $now;
        file_put_contents($rateLimitFile, json_encode($attempts));
        
        return true;
    }
    
    /**
     * Compteurs et statistiques
     */
    private function incrementSecurityCounter($clientHash, $event) {
        $counterFile = $this->logDir . '/counters/security_' . date('Y-m-d') . '.json';
        $counterDir = dirname($counterFile);
        
        if (!is_dir($counterDir)) {
            mkdir($counterDir, 0755, true);
        }
        
        $counters = [];
        if (file_exists($counterFile)) {
            $counters = json_decode(file_get_contents($counterFile), true) ?? [];
        }
        
        if (!isset($counters[$clientHash])) {
            $counters[$clientHash] = [];
        }
        
        if (!isset($counters[$clientHash][$event])) {
            $counters[$clientHash][$event] = 0;
        }
        
        $counters[$clientHash][$event]++;
        file_put_contents($counterFile, json_encode($counters));
    }
    
    private function getSecurityEventCount($clientHash) {
        $counterFile = $this->logDir . '/counters/security_' . date('Y-m-d') . '.json';
        
        if (!file_exists($counterFile)) {
            return 0;
        }
        
        $counters = json_decode(file_get_contents($counterFile), true) ?? [];
        
        if (!isset($counters[$clientHash])) {
            return 0;
        }
        
        return array_sum($counters[$clientHash]);
    }
    
    /**
     * Utilitaires
     */
    private function getClientIP() {
        if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            return explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0];
        }
        return $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    }
    
    private function generateRequestId() {
        return bin2hex(random_bytes(8));
    }
    
    private function logSystemError($message, $clientIP) {
        $systemLogFile = $this->logDir . '/system_errors.log';
        $logEntry = date('c') . " [SYSTEM_ERROR] " . $message . " IP: " . hash('sha256', $clientIP) . PHP_EOL;
        file_put_contents($systemLogFile, $logEntry, FILE_APPEND | LOCK_EX);
    }
    
    private function getAlertCount() {
        $alertFile = $this->logDir . '/alert_cooldown.json';
        if (file_exists($alertFile)) {
            $data = json_decode(file_get_contents($alertFile), true);
            return $data['alert_count'] ?? 0;
        }
        return 0;
    }
}

// ========================================
// POINT D'ENTRÉE
// ========================================

try {
    $logger = new SecureLogger();
    $logger->handleLogRequest();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error']);
}
?>
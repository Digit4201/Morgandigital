<?php
/**
 * EXEMPLE D'API BACKEND SÉCURISÉE
 * Morgan Digital Landing Page - Gestion côté serveur
 * 
 * CORRECTION SÉCURITÉ: Toute la logique métier critique est maintenant côté serveur
 */

// Configuration sécurisée
define('API_VERSION', '1.0.0');
define('MAX_REQUEST_SIZE', 1048576); // 1MB
define('CSRF_TOKEN_LIFETIME', 3600); // 1 heure
define('RATE_LIMIT_WINDOW', 300); // 5 minutes
define('RATE_LIMIT_MAX_REQUESTS', 10);

// Headers de sécurité
header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
header('Referrer-Policy: strict-origin-when-cross-origin');

// Vérification HTTPS obligatoire
if (!isset($_SERVER['HTTPS']) || $_SERVER['HTTPS'] !== 'on') {
    http_response_code(400);
    die(json_encode(['error' => 'HTTPS required']));
}

// Limitation de la taille des requêtes
if (isset($_SERVER['CONTENT_LENGTH']) && $_SERVER['CONTENT_LENGTH'] > MAX_REQUEST_SIZE) {
    http_response_code(413);
    die(json_encode(['error' => 'Request too large']));
}

/**
 * Classe de sécurité principale
 */
class SecurityManager {
    private $sessionPath;
    private $ipAddress;
    
    public function __construct() {
        $this->sessionPath = sys_get_temp_dir() . '/morgan_sessions/';
        $this->ipAddress = $this->getRealIpAddress();
        
        if (!is_dir($this->sessionPath)) {
            mkdir($this->sessionPath, 0700, true);
        }
    }
    
    /**
     * Obtenir l'adresse IP réelle du client
     */
    private function getRealIpAddress() {
        $headers = ['HTTP_X_FORWARDED_FOR', 'HTTP_X_REAL_IP', 'HTTP_CLIENT_IP', 'REMOTE_ADDR'];
        foreach ($headers as $header) {
            if (!empty($_SERVER[$header])) {
                $ips = explode(',', $_SERVER[$header]);
                $ip = trim($ips[0]);
                if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
                    return $ip;
                }
            }
        }
        return $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    }
    
    /**
     * Génération de token CSRF sécurisé
     */
    public function generateCSRFToken() {
        $token = bin2hex(random_bytes(32));
        $expiry = time() + CSRF_TOKEN_LIFETIME;
        
        // Stocker le token avec son expiration
        file_put_contents(
            $this->sessionPath . 'csrf_' . hash('sha256', $this->ipAddress),
            json_encode(['token' => $token, 'expiry' => $expiry]),
            LOCK_EX
        );
        
        return $token;
    }
    
    /**
     * Validation du token CSRF
     */
    public function validateCSRFToken($token) {
        $tokenFile = $this->sessionPath . 'csrf_' . hash('sha256', $this->ipAddress);
        
        if (!file_exists($tokenFile)) {
            return false;
        }
        
        $tokenData = json_decode(file_get_contents($tokenFile), true);
        
        if (!$tokenData || $tokenData['expiry'] < time()) {
            @unlink($tokenFile);
            return false;
        }
        
        $isValid = hash_equals($tokenData['token'], $token);
        
        if ($isValid) {
            @unlink($tokenFile); // Token à usage unique
        }
        
        return $isValid;
    }
    
    /**
     * Rate limiting basique
     */
    public function checkRateLimit() {
        $rateLimitFile = $this->sessionPath . 'rate_' . hash('sha256', $this->ipAddress);
        $now = time();
        
        if (file_exists($rateLimitFile)) {
            $data = json_decode(file_get_contents($rateLimitFile), true);
            
            if ($data && $now - $data['window_start'] < RATE_LIMIT_WINDOW) {
                if ($data['request_count'] >= RATE_LIMIT_MAX_REQUESTS) {
                    return false;
                }
                $data['request_count']++;
            } else {
                $data = ['window_start' => $now, 'request_count' => 1];
            }
        } else {
            $data = ['window_start' => $now, 'request_count' => 1];
        }
        
        file_put_contents($rateLimitFile, json_encode($data), LOCK_EX);
        return true;
    }
    
    /**
     * Validation des données d'entrée
     */
    public function sanitizeInput($data, $type) {
        switch ($type) {
            case 'name':
                $data = trim($data);
                if (strlen($data) < 2 || strlen($data) > 50) {
                    throw new Exception('Invalid name length');
                }
                if (!preg_match('/^[a-zA-ZÀ-ÿ\s\-\']+$/', $data)) {
                    throw new Exception('Invalid name format');
                }
                break;
                
            case 'email':
                $data = trim(strtolower($data));
                if (strlen($data) > 254 || !filter_var($data, FILTER_VALIDATE_EMAIL)) {
                    throw new Exception('Invalid email format');
                }
                break;
                
            case 'message':
                $data = trim($data);
                if (strlen($data) < 10 || strlen($data) > 2000) {
                    throw new Exception('Invalid message length');
                }
                // Protection contre les injections basiques
                $dangerous_patterns = ['<script', 'javascript:', 'data:text/html', 'vbscript:'];
                foreach ($dangerous_patterns as $pattern) {
                    if (stripos($data, $pattern) !== false) {
                        throw new Exception('Dangerous content detected');
                    }
                }
                break;
                
            default:
                throw new Exception('Unknown input type');
        }
        
        return htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    }
}

/**
 * Gestionnaire de campagne (CORRECTION: logique serveur)
 */
class CampaignManager {
    private $campaignEndDate;
    private $isActive;
    
    public function __construct() {
        // CORRECTION: Date de fin stockée côté serveur, non manipulable par le client
        $this->campaignEndDate = strtotime('2025-08-31 23:59:59');
        $this->isActive = time() < $this->campaignEndDate;
    }
    
    public function getCampaignStatus() {
        return [
            'active' => $this->isActive,
            'end_date' => date('c', $this->campaignEndDate),
            'time_remaining' => max(0, $this->campaignEndDate - time())
        ];
    }
    
    public function validatePromoCode($code) {
        // CORRECTION: Validation côté serveur des codes promo
        $validCodes = [
            'SAVE50' => [
                'discount' => 50,
                'type' => 'percentage',
                'active' => $this->isActive,
                'max_uses' => 1000,
                'used_count' => 0 // À implémenter avec base de données
            ]
        ];
        
        $code = strtoupper(trim($code));
        
        if (!isset($validCodes[$code])) {
            return ['valid' => false, 'error' => 'Code not found'];
        }
        
        $codeData = $validCodes[$code];
        
        if (!$codeData['active']) {
            return ['valid' => false, 'error' => 'Code expired'];
        }
        
        if ($codeData['used_count'] >= $codeData['max_uses']) {
            return ['valid' => false, 'error' => 'Code usage limit reached'];
        }
        
        return [
            'valid' => true,
            'code' => $code,
            'discount' => $codeData['discount'],
            'type' => $codeData['type']
        ];
    }
    
    // CORRECTION: Suppression de la fausse rareté, remplacement par vraie disponibilité
    public function getAvailability() {
        // Ici, on devrait interroger une vraie base de données
        // Exemple avec des données réelles (à adapter selon votre système)
        return [
            'starter' => [
                'available' => true,
                'slots_remaining' => null // null = illimité
            ],
            'professional' => [
                'available' => true,
                'slots_remaining' => null
            ],
            'enterprise' => [
                'available' => true,
                'slots_remaining' => null
            ]
        ];
    }
}

/**
 * Gestionnaire principal de l'API
 */
class APIHandler {
    private $security;
    private $campaign;
    
    public function __construct() {
        $this->security = new SecurityManager();
        $this->campaign = new CampaignManager();
    }
    
    public function handleRequest() {
        $method = $_SERVER['REQUEST_METHOD'];
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $endpoint = basename($path);
        
        // Vérification du rate limiting
        if (!$this->security->checkRateLimit()) {
            http_response_code(429);
            return ['error' => 'Too many requests'];
        }
        
        try {
            switch ($endpoint) {
                case 'csrf-token':
                    if ($method === 'GET') {
                        return $this->generateCSRFToken();
                    }
                    break;
                    
                case 'campaign-status':
                    if ($method === 'GET') {
                        return $this->getCampaignStatus();
                    }
                    break;
                    
                case 'validate-promo':
                    if ($method === 'POST') {
                        return $this->validatePromoCode();
                    }
                    break;
                    
                case 'availability':
                    if ($method === 'GET') {
                        return $this->getAvailability();
                    }
                    break;
                    
                case 'contact':
                    if ($method === 'POST') {
                        return $this->handleContactForm();
                    }
                    break;
                    
                default:
                    http_response_code(404);
                    return ['error' => 'Endpoint not found'];
            }
        } catch (Exception $e) {
            error_log('API Error: ' . $e->getMessage());
            http_response_code(400);
            return ['error' => $e->getMessage()];
        }
        
        http_response_code(405);
        return ['error' => 'Method not allowed'];
    }
    
    private function generateCSRFToken() {
        return ['csrf_token' => $this->security->generateCSRFToken()];
    }
    
    private function getCampaignStatus() {
        return $this->campaign->getCampaignStatus();
    }
    
    private function validatePromoCode() {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['code'])) {
            throw new Exception('Promo code required');
        }
        
        return $this->campaign->validatePromoCode($input['code']);
    }
    
    private function getAvailability() {
        return $this->campaign->getAvailability();
    }
    
    private function handleContactForm() {
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Validation CSRF
        if (!isset($input['_csrf']) || !$this->security->validateCSRFToken($input['_csrf'])) {
            throw new Exception('Invalid CSRF token');
        }
        
        // Vérification honeypot
        if (!empty($input['_honeypot'])) {
            throw new Exception('Spam detected');
        }
        
        // Validation des données
        $name = $this->security->sanitizeInput($input['name'] ?? '', 'name');
        $email = $this->security->sanitizeInput($input['email'] ?? '', 'email');
        $message = $this->security->sanitizeInput($input['message'] ?? '', 'message');
        
        // Ici, vous intégreriez avec Formspree ou votre système d'email
        $emailData = [
            'name' => $name,
            'email' => $email,
            'message' => $message,
            'timestamp' => date('c'),
            'ip' => $this->security->getRealIpAddress()
        ];
        
        // Log sécurisé pour audit
        error_log('Contact form submission: ' . json_encode([
            'email' => $email,
            'timestamp' => $emailData['timestamp'],
            'ip' => hash('sha256', $emailData['ip']) // Hash de l'IP pour la confidentialité
        ]));
        
        // Simulation d'envoi d'email (remplacer par vraie intégration)
        $success = $this->sendEmail($emailData);
        
        if ($success) {
            return ['success' => true, 'message' => 'Message sent successfully'];
        } else {
            throw new Exception('Failed to send message');
        }
    }
    
    private function sendEmail($data) {
        // CORRECTION: Ici, vous devriez intégrer avec un vrai service d'email
        // Exemple avec Formspree, SendGrid, Mailgun, etc.
        
        // Simulation pour l'exemple
        return true;
    }
}

// Point d'entrée de l'API
try {
    $api = new APIHandler();
    $response = $api->handleRequest();
    echo json_encode($response);
} catch (Exception $e) {
    error_log('Critical API error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Internal server error']);
}
?>
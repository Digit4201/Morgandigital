// ========================================
// SYSTÈME DE MONITORING ET LOGGING SÉCURISÉ
// Morgan Digital Landing Page - Monitoring Client-Side
// ========================================

class SecurityMonitor {
    constructor() {
        this.apiEndpoint = '/api/security-log';
        this.sessionId = this.generateSecureSessionId();
        this.startTime = Date.now();
        this.eventQueue = [];
        this.maxQueueSize = 50;
        this.flushInterval = 30000; // 30 secondes
        
        // Configuration de monitoring
        this.config = {
            trackUserInteractions: true,
            trackSecurityEvents: true,
            trackPerformance: true,
            trackErrors: true,
            enableAnonymization: true
        };
        
        this.initializeMonitoring();
    }
    
    /**
     * Initialise tous les systèmes de monitoring
     */
    initializeMonitoring() {
        this.setupErrorHandling();
        this.setupSecurityEventHandlers();
        this.setupPerformanceMonitoring();
        this.setupUserInteractionTracking();
        this.startAutoFlush();
        
        console.log('🔒 Security Monitor initialized');
    }
    
    // ========================================
    // MONITORING DES ERREURS SÉCURISÉ
    // ========================================
    
    setupErrorHandling() {
        // Capturer les erreurs JavaScript globales
        window.addEventListener('error', (event) => {
            this.logSecurityEvent('javascript_error', {
                message: this.sanitizeError(event.message),
                filename: this.sanitizeFilename(event.filename),
                lineno: event.lineno,
                colno: event.colno,
                stack: this.sanitizeStackTrace(event.error?.stack)
            }, 'medium');
        });
        
        // Capturer les erreurs de promesses non gérées
        window.addEventListener('unhandledrejection', (event) => {
            this.logSecurityEvent('unhandled_promise_rejection', {
                reason: this.sanitizeError(event.reason?.toString()),
                stack: this.sanitizeStackTrace(event.reason?.stack)
            }, 'medium');
        });
        
        // Intercepter les erreurs de ressources (images, scripts, etc.)
        window.addEventListener('error', (event) => {
            if (event.target !== window) {
                this.logSecurityEvent('resource_load_error', {
                    tagName: event.target.tagName,
                    src: this.sanitizeUrl(event.target.src || event.target.href),
                    type: event.target.type
                }, 'low');
            }
        }, true);
    }
    
    // ========================================
    // MONITORING DES ÉVÉNEMENTS DE SÉCURITÉ
    // ========================================
    
    setupSecurityEventHandlers() {
        // Détecter les tentatives de manipulation du DOM
        this.observeSecurityThreats();
        
        // Monitoring des formulaires
        this.monitorForms();
        
        // Détecter les changements d'URL suspects
        this.monitorNavigation();
        
        // Surveiller les tentatives d'accès aux développeurs tools
        this.detectDevTools();
    }
    
    observeSecurityThreats() {
        // Observer les changements suspects du DOM
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Détecter l'injection de scripts
                            if (node.tagName === 'SCRIPT') {
                                this.logSecurityEvent('script_injection_attempt', {
                                    src: this.sanitizeUrl(node.src),
                                    innerHTML: node.innerHTML ? 'present' : 'empty'
                                }, 'high');
                            }
                            
                            // Détecter l'injection d'iframes suspects
                            if (node.tagName === 'IFRAME') {
                                this.logSecurityEvent('iframe_injection_attempt', {
                                    src: this.sanitizeUrl(node.src)
                                }, 'high');
                            }
                        }
                    });
                }
                
                // Surveiller les modifications d'attributs suspects
                if (mutation.type === 'attributes') {
                    const target = mutation.target;
                    if (mutation.attributeName === 'onclick' || 
                        mutation.attributeName === 'onload' ||
                        mutation.attributeName === 'onerror') {
                        this.logSecurityEvent('suspicious_attribute_modification', {
                            tagName: target.tagName,
                            attribute: mutation.attributeName,
                            value: target.getAttribute(mutation.attributeName) ? 'present' : 'removed'
                        }, 'medium');
                    }
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['onclick', 'onload', 'onerror', 'src', 'href']
        });
    }
    
    monitorForms() {
        document.addEventListener('submit', (event) => {
            const form = event.target;
            if (form.tagName === 'FORM') {
                // Logger les soumissions de formulaires
                this.logEvent('form_submission', {
                    formId: form.id || 'unnamed',
                    action: this.sanitizeUrl(form.action),
                    method: form.method,
                    fieldCount: form.elements.length
                }, 'info');
                
                // Vérifier les tentatives de manipulation des champs cachés
                const hiddenFields = form.querySelectorAll('input[type="hidden"]');
                hiddenFields.forEach((field) => {
                    if (field.name.includes('csrf') || field.name.includes('token')) {
                        if (!field.value || field.value.length < 10) {
                            this.logSecurityEvent('csrf_token_manipulation', {
                                fieldName: field.name,
                                hasValue: !!field.value
                            }, 'high');
                        }
                    }
                });
            }
        });
    }
    
    monitorNavigation() {
        // Surveiller les changements d'URL
        let lastUrl = location.href;
        const observer = new MutationObserver(() => {
            if (location.href !== lastUrl) {
                this.logEvent('navigation_change', {
                    from: this.sanitizeUrl(lastUrl),
                    to: this.sanitizeUrl(location.href),
                    type: 'spa_navigation'
                }, 'info');
                lastUrl = location.href;
            }
        });
        
        observer.observe(document, { subtree: true, childList: true });
        
        // Surveiller les événements de navigation
        window.addEventListener('popstate', (event) => {
            this.logEvent('popstate_navigation', {
                url: this.sanitizeUrl(location.href),
                hasState: !!event.state
            }, 'info');
        });
    }
    
    detectDevTools() {
        // Détecter l'ouverture des outils de développement (méthode approximative)
        let devtools = false;
        const threshold = 160;
        
        const detectDevTools = () => {
            if (window.outerHeight - window.innerHeight > threshold || 
                window.outerWidth - window.innerWidth > threshold) {
                if (!devtools) {
                    devtools = true;
                    this.logSecurityEvent('devtools_detected', {
                        windowSize: `${window.innerWidth}x${window.innerHeight}`,
                        outerSize: `${window.outerWidth}x${window.outerHeight}`
                    }, 'low');
                }
            } else {
                devtools = false;
            }
        };
        
        setInterval(detectDevTools, 1000);
    }
    
    // ========================================
    // MONITORING DE PERFORMANCE
    // ========================================
    
    setupPerformanceMonitoring() {
        // Surveiller les performances de chargement
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData) {
                    this.logEvent('page_performance', {
                        domContentLoaded: Math.round(perfData.domContentLoadedEventEnd - perfData.navigationStart),
                        loadComplete: Math.round(perfData.loadEventEnd - perfData.navigationStart),
                        firstPaint: this.getFirstPaint(),
                        resourceCount: performance.getEntriesByType('resource').length
                    }, 'info');
                }
            }, 100);
        });
        
        // Surveiller les ressources lentes
        this.monitorSlowResources();
        
        // Surveiller les erreurs de performance
        this.monitorPerformanceErrors();
    }
    
    getFirstPaint() {
        const paintEntries = performance.getEntriesByType('paint');
        const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
        return firstPaint ? Math.round(firstPaint.startTime) : null;
    }
    
    monitorSlowResources() {
        const resourceObserver = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                if (entry.duration > 2000) { // Plus de 2 secondes
                    this.logEvent('slow_resource', {
                        name: this.sanitizeUrl(entry.name),
                        duration: Math.round(entry.duration),
                        size: entry.transferSize || 0,
                        type: entry.initiatorType
                    }, 'warning');
                }
            });
        });
        
        if ('PerformanceObserver' in window) {
            resourceObserver.observe({ entryTypes: ['resource'] });
        }
    }
    
    monitorPerformanceErrors() {
        // Surveiller les problèmes de mémoire
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                const usageRatio = memory.usedJSHeapSize / memory.totalJSHeapSize;
                
                if (usageRatio > 0.9) { // Plus de 90% de mémoire utilisée
                    this.logEvent('high_memory_usage', {
                        used: Math.round(memory.usedJSHeapSize / 1048576), // MB
                        total: Math.round(memory.totalJSHeapSize / 1048576), // MB
                        ratio: Math.round(usageRatio * 100)
                    }, 'warning');
                }
            }, 30000); // Vérifier toutes les 30 secondes
        }
    }
    
    // ========================================
    // TRACKING DES INTERACTIONS UTILISATEUR
    // ========================================
    
    setupUserInteractionTracking() {
        // Tracking sécurisé des clics
        document.addEventListener('click', (event) => {
            const target = event.target;
            
            // Ne tracker que les éléments importants
            if (target.tagName === 'BUTTON' || 
                target.tagName === 'A' || 
                target.classList.contains('btn') ||
                target.closest('.pricing-card')) {
                
                this.logEvent('user_interaction', {
                    type: 'click',
                    element: target.tagName,
                    id: target.id || null,
                    classes: Array.from(target.classList).slice(0, 3), // Max 3 classes
                    href: this.sanitizeUrl(target.href),
                    timestamp: Date.now() - this.startTime
                }, 'info');
            }
        });
        
        // Tracking du scroll pour mesurer l'engagement
        let lastScrollDepth = 0;
        const trackScrollDepth = () => {
            const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            
            // Logger les jalons de scroll (25%, 50%, 75%, 100%)
            if (scrollDepth >= 25 && lastScrollDepth < 25) {
                this.logEvent('scroll_milestone', { depth: 25 }, 'info');
            } else if (scrollDepth >= 50 && lastScrollDepth < 50) {
                this.logEvent('scroll_milestone', { depth: 50 }, 'info');
            } else if (scrollDepth >= 75 && lastScrollDepth < 75) {
                this.logEvent('scroll_milestone', { depth: 75 }, 'info');
            } else if (scrollDepth >= 100 && lastScrollDepth < 100) {
                this.logEvent('scroll_milestone', { depth: 100 }, 'info');
            }
            
            lastScrollDepth = scrollDepth;
        };
        
        window.addEventListener('scroll', this.throttle(trackScrollDepth, 1000));
        
        // Tracking de la durée de session
        setInterval(() => {
            this.logEvent('session_heartbeat', {
                duration: Date.now() - this.startTime,
                isActive: this.isUserActive()
            }, 'info');
        }, 60000); // Toutes les minutes
    }
    
    // ========================================
    // MÉTHODES DE LOGGING SÉCURISÉ
    // ========================================
    
    logSecurityEvent(eventType, data, severity = 'medium') {
        this.addToQueue({
            type: 'security',
            event: eventType,
            data: this.sanitizeData(data),
            severity: severity,
            timestamp: new Date().toISOString(),
            sessionId: this.sessionId,
            userAgent: this.getHashedUserAgent(),
            url: this.sanitizeUrl(window.location.href)
        });
    }
    
    logEvent(eventType, data, level = 'info') {
        this.addToQueue({
            type: 'event',
            event: eventType,
            data: this.sanitizeData(data),
            level: level,
            timestamp: new Date().toISOString(),
            sessionId: this.sessionId,
            url: this.sanitizeUrl(window.location.href)
        });
    }
    
    addToQueue(logEntry) {
        this.eventQueue.push(logEntry);
        
        // Flush immédiatement les événements de sécurité critiques
        if (logEntry.severity === 'high') {
            this.flushLogs();
        }
        
        // Vider la queue si elle est pleine
        if (this.eventQueue.length >= this.maxQueueSize) {
            this.flushLogs();
        }
    }
    
    async flushLogs() {
        if (this.eventQueue.length === 0) return;
        
        const logs = [...this.eventQueue];
        this.eventQueue = [];
        
        try {
            await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({
                    logs: logs,
                    meta: {
                        timestamp: new Date().toISOString(),
                        sessionId: this.sessionId,
                        pageLoadTime: this.startTime
                    }
                })
            });
        } catch (error) {
            console.warn('Failed to send logs:', error.message);
            // Remettre les logs en queue en cas d'échec
            this.eventQueue = [...logs, ...this.eventQueue];
        }
    }
    
    startAutoFlush() {
        setInterval(() => {
            this.flushLogs();
        }, this.flushInterval);
        
        // Flush avant déchargement de la page
        window.addEventListener('beforeunload', () => {
            // Utiliser sendBeacon pour un envoi fiable
            if (navigator.sendBeacon && this.eventQueue.length > 0) {
                const payload = JSON.stringify({
                    logs: this.eventQueue,
                    meta: {
                        timestamp: new Date().toISOString(),
                        sessionId: this.sessionId,
                        reason: 'page_unload'
                    }
                });
                
                navigator.sendBeacon(this.apiEndpoint, payload);
            }
        });
    }
    
    // ========================================
    // MÉTHODES DE SANITISATION
    // ========================================
    
    sanitizeData(data) {
        if (typeof data !== 'object' || data === null) {
            return String(data).substring(0, 500); // Limiter la longueur
        }
        
        const sanitized = {};
        for (const [key, value] of Object.entries(data)) {
            if (typeof value === 'string') {
                sanitized[key] = value.substring(0, 500);
            } else if (typeof value === 'number') {
                sanitized[key] = value;
            } else if (Array.isArray(value)) {
                sanitized[key] = value.slice(0, 10); // Max 10 éléments
            } else {
                sanitized[key] = String(value).substring(0, 100);
            }
        }
        
        return sanitized;
    }
    
    sanitizeError(error) {
        if (!error) return 'unknown';
        return String(error).substring(0, 200);
    }
    
    sanitizeStackTrace(stack) {
        if (!stack) return null;
        // Retourner seulement les 3 premières lignes de la stack trace
        return stack.split('\n').slice(0, 3).join('\n').substring(0, 500);
    }
    
    sanitizeUrl(url) {
        if (!url) return null;
        try {
            const urlObj = new URL(url);
            // Retourner seulement le domaine et le path, pas les query params
            return urlObj.origin + urlObj.pathname;
        } catch {
            return 'invalid_url';
        }
    }
    
    sanitizeFilename(filename) {
        if (!filename) return null;
        // Extraire seulement le nom du fichier, pas le chemin complet
        return filename.split('/').pop().substring(0, 100);
    }
    
    // ========================================
    // MÉTHODES UTILITAIRES
    // ========================================
    
    generateSecureSessionId() {
        const array = new Uint8Array(16);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
    
    getHashedUserAgent() {
        // Hasher le user agent pour la confidentialité
        return btoa(navigator.userAgent).substring(0, 20);
    }
    
    isUserActive() {
        // Détecter si l'utilisateur est actif (page visible)
        return !document.hidden && document.visibilityState === 'visible';
    }
    
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// ========================================
// INITIALISATION
// ========================================

// Initialiser le monitoring de sécurité
document.addEventListener('DOMContentLoaded', () => {
    if (typeof window !== 'undefined') {
        window.securityMonitor = new SecurityMonitor();
    }
});

// Exporter pour utilisation en module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SecurityMonitor;
}
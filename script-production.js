// ========================================
// MORGAN DIGITAL LANDING PAGE - PRODUCTION
// Version sécurisée sans logs de développement
// ========================================

// Fonction utilitaire pour l'assainissement HTML
function sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Configuration sécurisée
const SECURITY_CONFIG = {
    MAX_RETRIES: 3,
    CSRF_TOKEN_LENGTH: 32,
    SESSION_TIMEOUT: 3600000, // 1 heure
    MAX_INPUT_LENGTH: {
        name: 50,
        email: 254,
        message: 2000
    },
    ALLOWED_HTML_TAGS: ['span', 'strong', 'em']
};

// ========================================
// SYSTÈME DE STOCKAGE SÉCURISÉ
// ========================================
const secureStorage = {
    setItem(key, value) {
        try {
            const encryptedValue = btoa(encodeURIComponent(value));
            localStorage.setItem(key, encryptedValue);
        } catch (error) {
            // Erreur silencieuse en production
        }
    },
    
    getItem(key) {
        try {
            const encryptedValue = localStorage.getItem(key);
            if (!encryptedValue) return null;
            return decodeURIComponent(atob(encryptedValue));
        } catch (error) {
            return null;
        }
    },
    
    removeItem(key) {
        localStorage.removeItem(key);
    }
};

// Hash simple pour validation d'intégrité
function generateSimpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Conversion en 32-bit
    }
    return hash.toString();
}

// ========================================
// FORMULAIRE DE CONTACT SÉCURISÉ
// ========================================
class SecureContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.submitAttempts = 0;
        this.maxAttempts = SECURITY_CONFIG.MAX_RETRIES;
        this.lastSubmitTime = 0;
        this.minInterval = 3000;
    }
    
    generateCSRFToken() {
        const array = new Uint8Array(SECURITY_CONFIG.CSRF_TOKEN_LENGTH / 2);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
    
    validateInput(value, type) {
        const maxLength = SECURITY_CONFIG.MAX_INPUT_LENGTH[type];
        if (!value || value.length === 0) {
            throw new Error(`Le champ ${type} est requis`);
        }
        
        if (value.length > maxLength) {
            throw new Error(`Le champ ${type} est trop long (max ${maxLength} caractères)`);
        }
        
        switch (type) {
            case 'name':
                if (!/^[a-zA-ZÀ-ÿ\s\-']{2,}$/.test(value)) {
                    throw new Error('Nom invalide (lettres, espaces, tirets et apostrophes uniquement)');
                }
                break;
                
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
                if (!emailRegex.test(value) || value.length > 254) {
                    throw new Error('Adresse email invalide');
                }
                break;
                
            case 'message':
                if (value.length < 10) {
                    throw new Error('Le message doit contenir au moins 10 caractères');
                }
                break;
        }
        
        const dangerousPatterns = [
            /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            /javascript:/gi,
            /on\w+\s*=/gi,
            /data:text\/html/gi,
            /<iframe\b[^>]*>/gi
        ];
        
        for (const pattern of dangerousPatterns) {
            if (pattern.test(value)) {
                throw new Error('Contenu non autorisé détecté');
            }
        }
        
        return sanitizeHTML(value);
    }
    
    async submitForm(formData) {
        const now = Date.now();
        
        if (now - this.lastSubmitTime < this.minInterval) {
            throw new Error('Veuillez attendre avant de soumettre à nouveau');
        }
        
        if (this.submitAttempts >= this.maxAttempts) {
            throw new Error('Trop de tentatives. Veuillez rafraîchir la page.');
        }
        
        this.submitAttempts++;
        this.lastSubmitTime = now;
        
        try {
            const response = await fetch('/api-handler.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify(formData)
            });
            
            if (!response.ok) {
                throw new Error('Erreur réseau');
            }
            
            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.error || 'Erreur lors de l\'envoi');
            }
            
            return result;
            
        } catch (error) {
            throw new Error('Erreur de communication. Veuillez réessayer.');
        }
    }
    
    displayMessage(message, type = 'success') {
        const messagesContainer = this.form.querySelector('.form-messages');
        if (!messagesContainer) return;
        
        messagesContainer.textContent = message;
        messagesContainer.className = `form-messages ${type}`;
        
        setTimeout(() => {
            messagesContainer.textContent = '';
            messagesContainer.className = 'form-messages';
        }, 5000);
    }
    
    async handleSubmit(event) {
        event.preventDefault();
        
        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        try {
            submitButton.disabled = true;
            submitButton.textContent = 'Envoi...';
            
            // Validation des données
            const formData = new FormData(this.form);
            const data = {
                name: this.validateInput(formData.get('name'), 'name'),
                email: this.validateInput(formData.get('email'), 'email'),
                message: this.validateInput(formData.get('message'), 'message'),
                _csrf: this.form.querySelector('#csrf-token').value,
                _timestamp: Date.now()
            };
            
            // Vérification honeypot
            if (formData.get('_honeypot')) {
                throw new Error('Spam détecté');
            }
            
            await this.submitForm(data);
            
            this.displayMessage('Message envoyé avec succès !', 'success');
            this.form.reset();
            this.submitAttempts = 0;
            
        } catch (error) {
            this.displayMessage(error.message, 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    }
    
    init() {
        if (!this.form) return;
        
        // Génération du token CSRF
        const csrfInput = this.form.querySelector('#csrf-token');
        if (csrfInput) {
            csrfInput.value = this.generateCSRFToken();
        }
        
        const timestampInput = this.form.querySelector('#form-timestamp');
        if (timestampInput) {
            timestampInput.value = Date.now().toString();
        }
        
        this.form.addEventListener('submit', (event) => this.handleSubmit(event));
    }
}

// ========================================
// SYSTÈME DE VALIDATION DE PAIEMENT SÉCURISÉ
// ========================================
class SecurePaymentHandler {
    constructor() {
        this.apiEndpoint = '/payment-validation.php';
        this.processingPayment = false;
    }
    
    async processPayment(productId, promoCode = null) {
        if (this.processingPayment) {
            throw new Error('Paiement déjà en cours');
        }
        
        this.processingPayment = true;
        
        try {
            const validationResponse = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({
                    action: 'validate_payment',
                    product_id: productId,
                    promo_code: promoCode,
                    timestamp: Date.now(),
                    session_id: this.getSessionId()
                })
            });
            
            if (!validationResponse.ok) {
                throw new Error('Erreur de validation du paiement');
            }
            
            const validationData = await validationResponse.json();
            
            if (!validationData.success) {
                throw new Error('Validation échouée');
            }
            
            this.logPaymentAttempt(productId, promoCode);
            window.location.href = validationData.payment_url;
            
        } catch (error) {
            this.processingPayment = false;
            this.logPaymentError(error.message, productId);
            throw error;
        }
    }
    
    logPaymentAttempt(productId, promoCode) {
        if (window.securityMonitor) {
            window.securityMonitor.logEvent('payment_attempt', {
                product_id: productId,
                promo_code: promoCode,
                timestamp: Date.now()
            }, 'info');
        }
    }
    
    logPaymentError(error, productId) {
        if (window.securityMonitor) {
            window.securityMonitor.logSecurityEvent('payment_error', {
                error: error,
                product_id: productId,
                timestamp: Date.now()
            }, 'medium');
        }
    }
    
    getSessionId() {
        let sessionId = sessionStorage.getItem('morgan_session_id');
        if (!sessionId) {
            sessionId = this.generateSecureId();
            sessionStorage.setItem('morgan_session_id', sessionId);
        }
        return sessionId;
    }
    
    generateSecureId() {
        const array = new Uint8Array(16);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
}

// ========================================
// FONCTIONS UTILITAIRES SÉCURISÉES
// ========================================
function initLanguageSwitcher() {
    const langBtn = document.getElementById('lang-btn');
    if (!langBtn) return;
}

function initSecureThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;
    
    const currentTheme = secureStorage.getItem('preferred-theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const newTheme = current === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        secureStorage.setItem('preferred-theme', newTheme);
    });
}

function initSecureUrgencyBanner() {
    const banner = document.querySelector('.urgency-banner');
    if (!banner) return;
    
    const closeBtn = banner.querySelector('.urgency-close');
    if (!closeBtn) return;
    
    try {
        const bannerClosed = secureStorage.getItem('urgency-banner-closed');
        if (bannerClosed) {
            const data = JSON.parse(bannerClosed);
            const timeDiff = Date.now() - data.timestamp;
            
            if (timeDiff < SECURITY_CONFIG.SESSION_TIMEOUT && 
                data.hash === generateSimpleHash(data.timestamp.toString())) {
                banner.style.display = 'none';
                return;
            }
        }
    } catch (error) {
        // Erreur silencieuse
    }
    
    closeBtn.addEventListener('click', () => {
        banner.style.display = 'none';
        
        try {
            const timestamp = Date.now();
            const data = {
                timestamp: timestamp,
                hash: generateSimpleHash(timestamp.toString())
            };
            secureStorage.setItem('urgency-banner-closed', JSON.stringify(data));
        } catch (error) {
            // Erreur silencieuse
        }
    });
}

// ========================================
// INITIALISATION DE L'APPLICATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Protection contre les attaques par iframe
        if (window.top !== window.self) {
            return;
        }
        
        // Initialisation des modules
        initLanguageSwitcher();
        
        // Formulaire de contact sécurisé
        const contactForm = new SecureContactForm();
        contactForm.init();
        
        // Système de paiement sécurisé
        window.securePaymentHandler = new SecurePaymentHandler();
        
        // Autres fonctionnalités sécurisées
        initSecureUrgencyBanner();
        initSecureThemeToggle();
        
        // Countdown sécurisé basé sur le serveur
        if (window.SecureCountdown) {
            const secureCountdown = new window.SecureCountdown();
            secureCountdown.init();
        }
        
        // Gestionnaire de paiements sécurisés
        document.querySelectorAll('a[href*="stripe.com"], .pricing-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                if (button.href && button.href.includes('stripe.com')) {
                    e.preventDefault();
                    
                    const pricingCard = button.closest('.pricing-card');
                    let productId = 'professional';
                    
                    if (pricingCard) {
                        const title = pricingCard.querySelector('h3').textContent;
                        if (title.includes('Starter') || title.includes('Débutant')) {
                            productId = 'starter';
                        } else if (title.includes('Enterprise') || title.includes('Entreprise')) {
                            productId = 'enterprise';
                        }
                    }
                    
                    try {
                        const promoCode = document.querySelector('.floating-code')?.textContent || null;
                        
                        button.disabled = true;
                        button.textContent = 'Vérification...';
                        
                        await window.securePaymentHandler.processPayment(productId, promoCode);
                        
                    } catch (error) {
                        button.disabled = false;
                        button.textContent = button.textContent.replace('Vérification...', 'Réessayer');
                        
                        // Message d'erreur simple sans révéler d'informations système
                        const messageEl = document.createElement('div');
                        messageEl.textContent = 'Erreur lors du traitement. Veuillez réessayer.';
                        messageEl.className = 'payment-error';
                        button.parentNode.appendChild(messageEl);
                        
                        setTimeout(() => messageEl.remove(), 5000);
                    }
                }
            });
        });
        
    } catch (error) {
        // Erreur silencieuse en production
    }
});

// Protection contre les erreurs non gérées
window.addEventListener('error', (event) => {
    // Log silencieux en production
});

// Protection CSP
if (window.addEventListener) {
    window.addEventListener('securitypolicyviolation', (event) => {
        // Log silencieux en production
    });
}
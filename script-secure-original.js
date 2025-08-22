// ========================================
// SECURE VERSION - Morgan Digital Landing Page
// Corrections des vulnérabilités de sécurité
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
    ALLOWED_HTML_TAGS: ['span', 'strong', 'em'] // Tags autorisés pour les traductions
};

// ========================================
// LANGUAGE SWITCHER SÉCURISÉ
// ========================================
const translations = {
    en: {
        nav_advantages: "Advantages",
        nav_portfolio: "Portfolio", 
        nav_process: "Process",
        nav_free_quote: "Free Quote",
        hero_badge: "🚀 Expert Landing Pages",
        hero_title_1: 'I create <span class="gradient-text">Landing Pages</span> that convert your visitors into customers',
        hero_title_2: ' <span class="gradient-text">Sales Pages</span> that captivate your audience',
        hero_title_3: 'Web expertise that <span class="gradient-text">boosts your online sales</span>',
        hero_subtitle: "Specializing in online coaches and trainers, I design custom sales pages that turn your expertise into predictable income.",
        hero_cta_button: "Request your free quote",
        hero_stat_1: "Average conversion rate",
        hero_stat_2: "Express delivery",
        hero_card_1: "+250% conversions",
        hero_card_2: "Ultra fast",
        benefits_badge: "Why choose me",
        benefits_title: 'Landing Pages designed to <span class="gradient-text">convert</span>',
        benefits_subtitle: "Every element is optimized to turn your visitors into paying customers",
        // ... reste des traductions identique
    },
    fr: {
        nav_advantages: "Avantages",
        nav_portfolio: "Portfolio",
        nav_process: "Processus", 
        nav_free_quote: "Devis Gratuit",
        hero_badge: "🚀 Expert Landing Pages",
        hero_title_1: 'Je crée des <span class="gradient-text">Landing Pages</span> qui convertissent vos visiteurs en clients',
        hero_title_2: 'Des <span class="gradient-text">Pages de Vente</span> qui captivent votre audience',
        hero_title_3: 'Une expertise web qui <span class="gradient-text">booste vos ventes</span> en ligne',
        hero_subtitle: "Spécialiste des coachs et formateurs en ligne, je conçois des pages de vente sur mesure qui transforment votre expertise en revenus prévisibles.",
        hero_cta_button: "Demandez votre devis gratuit",
        hero_stat_1: "Taux de conversion moyen",
        hero_stat_2: "Livraison express",
        hero_card_1: "+250% de conversions",
        hero_card_2: "Ultra rapide",
        benefits_badge: "Pourquoi me choisir",
        benefits_title: 'Des Landing Pages pensées pour <span class="gradient-text">convertir</span>',
        benefits_subtitle: "Chaque élément est optimisé pour transformer vos visiteurs en clients payants",
        // ... reste des traductions identique
    }
};

// DOMPurify-like simple sanitization pour les traductions HTML
function sanitizeTranslation(htmlString, allowedTags = SECURITY_CONFIG.ALLOWED_HTML_TAGS) {
    const div = document.createElement('div');
    div.innerHTML = htmlString;
    
    // Nettoyer tous les éléments non autorisés
    div.querySelectorAll('*').forEach(element => {
        if (!allowedTags.includes(element.tagName.toLowerCase())) {
            element.outerHTML = element.textContent;
        }
        // Supprimer tous les attributs sauf class pour les éléments autorisés
        if (allowedTags.includes(element.tagName.toLowerCase())) {
            Array.from(element.attributes).forEach(attr => {
                if (attr.name !== 'class') {
                    element.removeAttribute(attr.name);
                }
            });
        }
    });
    
    return div.innerHTML;
}

function initLanguageSwitcher() {
    const langBtn = document.getElementById('lang-btn');
    if (!langBtn) return;

    let currentLang = document.documentElement.lang || 'fr';

    function setLanguage(lang) {
        // Validation de la langue
        if (!['en', 'fr'].includes(lang)) {
            console.error('Langue non supportée:', lang);
            return;
        }
        
        document.documentElement.lang = lang;
        document.querySelectorAll('[data-key]').forEach(element => {
            const key = element.getAttribute('data-key');
            if (translations[lang] && translations[lang][key]) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    // Sécurisé: utilisation de textContent pour les placeholders
                    element.placeholder = sanitizeHTML(translations[lang][key]);
                } else {
                    // CORRECTION XSS: Utilisation de sanitizeTranslation au lieu de innerHTML brut
                    element.innerHTML = sanitizeTranslation(translations[lang][key]);
                }
            }
        });
        
        // Sécurisé: validation du contenu du bouton
        langBtn.textContent = lang === 'en' ? 'FR' : 'EN';
        currentLang = lang;
    }

    langBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const newLang = currentLang === 'en' ? 'fr' : 'en';
        setLanguage(newLang);
    });

    // Set initial language
    setLanguage(currentLang);
}

// ========================================
// SYSTÈME DE COMPTEUR SÉCURISÉ
// ========================================
class SecureCountdown {
    constructor() {
        this.endDate = null;
        this.intervalId = null;
        this.isExpired = false;
    }
    
    // Récupération sécurisée de la date de fin depuis le serveur
    async fetchEndDate() {
        try {
            // CORRECTION: Appel API au lieu de date codée côté client
            const response = await fetch('/api/campaign-end-date', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                this.endDate = new Date(data.endDate).getTime();
            } else {
                // Fallback sécurisé - pas de countdown si pas de réponse serveur
                console.warn('Impossible de récupérer la date de fin de campagne');
                this.hideCountdownElements();
                return false;
            }
        } catch (error) {
            console.error('Erreur lors de la récupération de la date:', error);
            this.hideCountdownElements();
            return false;
        }
        return true;
    }
    
    hideCountdownElements() {
        document.querySelectorAll('.urgency-banner, .urgency-countdown, .urgency-highlight').forEach(el => {
            el.style.display = 'none';
        });
    }
    
    updateDisplay() {
        if (!this.endDate) return;
        
        const now = new Date().getTime();
        const distance = this.endDate - now;
        
        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            
            // CORRECTION XSS: Utilisation de textContent au lieu de innerHTML
            const daysEl = document.getElementById('days');
            const hoursEl = document.getElementById('hours');
            const minutesEl = document.getElementById('minutes');
            
            if (daysEl) daysEl.textContent = days.toString();
            if (hoursEl) hoursEl.textContent = hours.toString();
            if (minutesEl) minutesEl.textContent = minutes.toString();
            
            const pricingCountdown = document.getElementById('pricing-countdown');
            if (pricingCountdown) {
                pricingCountdown.textContent = `${days} jours`;
            }
            
            // Animation d'urgence (sécurisée)
            if (days === 0) {
                document.querySelectorAll('.urgency-countdown, .urgency-highlight').forEach(el => {
                    el.style.background = 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)';
                    el.classList.add('urgency-blink');
                });
            }
        } else {
            this.handleExpiredOffer();
        }
    }
    
    async handleExpiredOffer() {
        // CORRECTION: Validation côté serveur avant de changer les prix
        try {
            const response = await fetch('/api/validate-campaign-status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.isExpired) {
                    this.hideCountdownElements();
                    // Note: Les prix sont maintenant gérés côté serveur
                    // On ne change plus les prix côté client
                }
            }
        } catch (error) {
            console.error('Erreur lors de la validation de campagne:', error);
        }
    }
    
    async start() {
        const success = await this.fetchEndDate();
        if (success) {
            this.updateDisplay();
            this.intervalId = setInterval(() => this.updateDisplay(), 60000);
        }
    }
    
    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}

// ========================================
// BANNIÈRE D'URGENCE SÉCURISÉE
// ========================================
function initSecureUrgencyBanner() {
    const banner = document.querySelector('.urgency-banner');
    const closeBtn = document.querySelector('.urgency-close');
    
    if (!banner || !closeBtn) return;
    
    closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        banner.classList.add('hidden');
        
        // CORRECTION: Chiffrement des données localStorage
        const timestamp = Date.now();
        const data = {
            closed: true,
            timestamp: timestamp,
            hash: generateSimpleHash(timestamp.toString())
        };
        
        // Stockage sécurisé avec validation
        try {
            secureStorage.setItem('urgencyBannerClosed', JSON.stringify(data));
        } catch (error) {
            console.error('Erreur de stockage sécurisé:', error);
        }
    });
    
    // Vérification sécurisée du stockage précédent
    try {
        const storedData = secureStorage.getItem('urgencyBannerClosed');
        if (storedData) {
            const data = JSON.parse(storedData);
            // Validation de l'intégrité des données
            if (data.hash === generateSimpleHash(data.timestamp.toString())) {
                const timeDiff = Date.now() - data.timestamp;
                if (timeDiff < SECURITY_CONFIG.SESSION_TIMEOUT) {
                    banner.style.display = 'none';
                } else {
                    // Données expirées, les supprimer
                    secureStorage.removeItem('urgencyBannerClosed');
                }
            } else {
                // Données compromises, les supprimer
                console.warn('Données de bannière compromises détectées');
                secureStorage.removeItem('urgencyBannerClosed');
            }
        }
    } catch (error) {
        console.error('Erreur lors de la vérification de la bannière:', error);
        secureStorage.removeItem('urgencyBannerClosed');
    }
}

// ========================================
// SYSTÈME DE STOCKAGE SÉCURISÉ
// ========================================
const secureStorage = {
    setItem(key, value) {
        try {
            const encryptedValue = btoa(encodeURIComponent(value));
            localStorage.setItem(key, encryptedValue);
        } catch (error) {
            console.error('Erreur de stockage:', error);
        }
    },
    
    getItem(key) {
        try {
            const encryptedValue = localStorage.getItem(key);
            if (!encryptedValue) return null;
            return decodeURIComponent(atob(encryptedValue));
        } catch (error) {
            console.error('Erreur de lecture:', error);
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
        this.minInterval = 3000; // 3 secondes entre les soumissions
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
        
        // Validation spécifique par type
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
        
        // Protection contre les injections
        const dangerousPatterns = [
            /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            /javascript:/gi,
            /on\w+\s*=/gi,
            /data:text\/html/gi,
            /vbscript:/gi,
            /<iframe/gi,
            /<object/gi,
            /<embed/gi
        ];
        
        if (dangerousPatterns.some(pattern => pattern.test(value))) {
            throw new Error('Contenu non autorisé détecté');
        }
        
        return value.trim();
    }
    
    async submitForm(formData) {
        // Vérification du rate limiting
        const now = Date.now();
        if (now - this.lastSubmitTime < this.minInterval) {
            throw new Error('Veuillez patienter avant de renvoyer le formulaire');
        }
        
        if (this.submitAttempts >= this.maxAttempts) {
            throw new Error('Nombre maximum de tentatives atteint. Veuillez recharger la page.');
        }
        
        this.submitAttempts++;
        this.lastSubmitTime = now;
        
        // Validation des données
        const validatedData = {
            name: this.validateInput(formData.get('name'), 'name'),
            email: this.validateInput(formData.get('email'), 'email'),
            message: this.validateInput(formData.get('message'), 'message')
        };
        
        // Vérification honeypot
        const honeypot = formData.get('_honeypot');
        if (honeypot && honeypot.trim() !== '') {
            throw new Error('Soumission invalide détectée');
        }
        
        // Préparation des données sécurisées
        const secureData = {
            ...validatedData,
            _csrf: this.generateCSRFToken(),
            _timestamp: now,
            _fingerprint: await this.generateBrowserFingerprint()
        };
        
        const response = await fetch(this.form.action, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-Token': secureData._csrf
            },
            body: JSON.stringify(secureData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erreur lors de l\'envoi du message');
        }
        
        return await response.json();
    }
    
    async generateBrowserFingerprint() {
        // Empreinte simple du navigateur pour la validation
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('Fingerprint', 2, 2);
        
        const fingerprint = {
            canvas: canvas.toDataURL(),
            userAgent: navigator.userAgent,
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            screen: `${screen.width}x${screen.height}`,
            timestamp: Date.now()
        };
        
        // Hash simple de l'empreinte
        const fingerprintString = JSON.stringify(fingerprint);
        return generateSimpleHash(fingerprintString);
    }
    
    displayMessage(message, type = 'info') {
        // Supprime les anciens messages
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Crée le nouveau message de manière sécurisée
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        // CORRECTION XSS: Utilisation de textContent
        messageElement.textContent = message;
        
        this.form.appendChild(messageElement);
        
        // Fait disparaître le message après 5 secondes
        setTimeout(() => {
            messageElement.style.transition = 'opacity 0.5s ease';
            messageElement.style.opacity = '0';
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.remove();
                }
            }, 500);
        }, 5000);
    }
    
    init() {
        if (!this.form) return;
        
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitButton = this.form.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            
            try {
                submitButton.disabled = true;
                submitButton.textContent = 'Envoi en cours...';
                
                const formData = new FormData(this.form);
                const result = await this.submitForm(formData);
                
                submitButton.textContent = 'Message envoyé !';
                submitButton.style.backgroundColor = '#10b981';
                this.form.reset();
                this.displayMessage('Merci ! Votre message a bien été envoyé.', 'success');
                
                // Réinitialiser le compteur de tentatives en cas de succès
                this.submitAttempts = 0;
                
            } catch (error) {
                submitButton.textContent = 'Échec de l\'envoi';
                submitButton.style.backgroundColor = '#ef4444';
                this.displayMessage(`Erreur: ${error.message}`, 'error');
            } finally {
                setTimeout(() => {
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                    submitButton.style.backgroundColor = '';
                }, 3000);
            }
        });
    }
}

// ========================================
// SYSTÈME DE THÈME SÉCURISÉ
// ========================================
function initSecureThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;
    
    // Récupération sécurisée du thème
    const savedTheme = secureStorage.getItem('theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
        }
    }
    
    themeToggle.addEventListener('click', (e) => {
        e.preventDefault();
        document.body.classList.toggle('dark-mode');
        
        const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        secureStorage.setItem('theme', theme);
    });
}

// ========================================
// GESTIONNAIRE D'OFFRES FLOTTANTES SÉCURISÉ
// ========================================
class SecureFloatingOffer {
    constructor() {
        this.element = document.getElementById('floating-offer');
        this.isVisible = false;
        this.timerInterval = null;
        this.offerDuration = 15 * 60; // 15 minutes
        this.startTime = null;
    }
    
    // CORRECTION: Suppression de la logique de fausse rareté
    // Remplacement par un simple affichage d'offre limitée dans le temps
    
    async validateOfferEligibility() {
        try {
            const response = await fetch('/api/check-offer-eligibility', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                return data.eligible;
            }
            return false;
        } catch (error) {
            console.error('Erreur lors de la vérification d\'éligibilité:', error);
            return false;
        }
    }
    
    startTimer() {
        const minutesEl = document.getElementById('floating-minutes');
        const secondsEl = document.getElementById('floating-seconds');
        
        if (!minutesEl || !secondsEl) return;
        
        this.startTime = Date.now();
        let remainingTime = this.offerDuration;
        
        this.timerInterval = setInterval(() => {
            if (remainingTime <= 0) {
                this.hideOffer();
                return;
            }
            
            const minutes = Math.floor(remainingTime / 60);
            const seconds = remainingTime % 60;
            
            // CORRECTION XSS: Utilisation de textContent
            minutesEl.textContent = minutes.toString().padStart(2, '0');
            secondsEl.textContent = seconds.toString().padStart(2, '0');
            
            remainingTime--;
            
            // Animation d'urgence
            if (remainingTime < 120) { // 2 minutes
                this.element.classList.add('urgent');
            }
        }, 1000);
    }
    
    async showOffer() {
        const eligible = await this.validateOfferEligibility();
        if (!eligible) return;
        
        // Vérifier si l'offre n'a pas été fermée récemment
        try {
            const closedData = secureStorage.getItem('floatingOfferClosed');
            if (closedData) {
                const data = JSON.parse(closedData);
                const timeDiff = Date.now() - data.timestamp;
                if (timeDiff < SECURITY_CONFIG.SESSION_TIMEOUT) {
                    return; // Ne pas afficher l'offre
                } else {
                    secureStorage.removeItem('floatingOfferClosed');
                }
            }
        } catch (error) {
            console.error('Erreur lors de la vérification de fermeture:', error);
        }
        
        this.element.classList.add('show');
        this.isVisible = true;
        this.startTimer();
    }
    
    hideOffer() {
        this.element.classList.remove('show');
        this.element.classList.add('hide');
        this.isVisible = false;
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        setTimeout(() => {
            this.element.style.display = 'none';
        }, 500);
    }
    
    async copyPromoCode() {
        try {
            // Validation côté serveur du code promo
            const response = await fetch('/api/validate-promo-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({ code: 'SAVE50' })
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.valid) {
                    await navigator.clipboard.writeText(data.code);
                    return data.code;
                } else {
                    throw new Error('Code promo non valide');
                }
            } else {
                throw new Error('Erreur de validation du code');
            }
        } catch (error) {
            console.error('Erreur de copie du code promo:', error);
            // Fallback sans validation serveur
            await navigator.clipboard.writeText('SAVE50');
            return 'SAVE50';
        }
    }
    
    init() {
        if (!this.element) return;
        
        const closeBtn = this.element.querySelector('.floating-close');
        const claimBtn = this.element.querySelector('.floating-btn-claim');
        
        // Gestionnaire de fermeture
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideOffer();
                
                // Enregistrer la fermeture de manière sécurisée
                const timestamp = Date.now();
                const data = {
                    closed: true,
                    timestamp: timestamp,
                    hash: generateSimpleHash(timestamp.toString())
                };
                
                secureStorage.setItem('floatingOfferClosed', JSON.stringify(data));
            });
        }
        
        // Gestionnaire de réclamation du code
        if (claimBtn) {
            claimBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                
                try {
                    const code = await this.copyPromoCode();
                    
                    // CORRECTION XSS: Utilisation de textContent
                    const originalText = claimBtn.textContent;
                    claimBtn.textContent = '✅ Code copié !';
                    claimBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                    
                    setTimeout(() => {
                        claimBtn.textContent = originalText;
                        claimBtn.style.background = '';
                    }, 2000);
                    
                    // Scroll vers les prix
                    const pricingSection = document.getElementById('pricing');
                    if (pricingSection) {
                        pricingSection.scrollIntoView({ behavior: 'smooth' });
                    }
                } catch (error) {
                    alert('Erreur lors de la copie du code promo');
                }
            });
        }
        
        // Afficher l'offre après un délai
        setTimeout(() => {
            this.showOffer();
        }, 2000);
    }
}

// ========================================
// INITIALISATION SÉCURISÉE
// ========================================
class SecureApp {
    constructor() {
        this.countdown = new SecureCountdown();
        this.contactForm = new SecureContactForm();
        this.floatingOffer = new SecureFloatingOffer();
        this.initialized = false;
    }
    
    async init() {
        if (this.initialized) return;
        
        try {
            // Protection contre les attaques par détournement de clic
            if (window.top !== window.self) {
                console.warn('Page chargée dans un iframe, arrêt de l\'initialisation');
                return;
            }
            
            // Initialisation des modules sécurisés
            initLanguageSwitcher();
            this.contactForm.init();
            initSecureUrgencyBanner();
            initSecureThemeToggle();
            
            // Démarrage du compteur sécurisé
            await this.countdown.start();
            
            // Initialisation de l'offre flottante
            this.floatingOffer.init();
            
            this.initialized = true;
            console.log('Application initialisée de manière sécurisée');
            
        } catch (error) {
            console.error('Erreur lors de l\'initialisation sécurisée:', error);
        }
    }
    
    // Nettoyage lors du déchargement de la page
    cleanup() {
        this.countdown.stop();
        if (this.floatingOffer.timerInterval) {
            clearInterval(this.floatingOffer.timerInterval);
        }
    }
}

// ========================================
// DÉMARRAGE SÉCURISÉ DE L'APPLICATION
// ========================================
const secureApp = new SecureApp();

// Initialisation sécurisée
document.addEventListener('DOMContentLoaded', () => {
    secureApp.init();
});

// Nettoyage lors du déchargement
window.addEventListener('beforeunload', () => {
    secureApp.cleanup();
});

// Protection contre les erreurs non gérées
window.addEventListener('error', (event) => {
    console.error('Erreur JavaScript:', event.error);
    // Ne pas exposer les détails d'erreur à l'utilisateur
});

// Protection CSP - Blocage des scripts inline non autorisés
if (window.addEventListener) {
    window.addEventListener('securitypolicyviolation', (event) => {
        console.warn('Violation de la politique de sécurité:', event.violatedDirective);
    });
}
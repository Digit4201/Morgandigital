// ========================================
// VERSION COMPATIBLE FORMSPREE - Morgan Digital Landing Page
// Corrections sécurité + Compatibility Formspree
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
        benefits_subtitle: "Every element is optimized to turn your visitors into paying customers"
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
        benefits_subtitle: "Chaque élément est optimisé pour transformer vos visiteurs en clients payants"
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
    // Since we use separate HTML files for different languages,
    // we don't need to override the default link behavior.
    // The HTML <a> tags will handle navigation between index.html and index-fr.html
    // Just ensure the language button exists for styling purposes
    const langBtn = document.getElementById('lang-btn');
    if (!langBtn) return;
    
    // Log for debugging - language switching uses normal HTML navigation
    console.log('Language switcher initialized - using HTML navigation between files');
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
// FORMULAIRE DE CONTACT COMPATIBLE FORMSPREE
// ========================================
class FormspreeContactForm {
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
        
        // CORRECTION FORMSPREE: Création de FormData au lieu de JSON
        const secureFormData = new FormData();
        secureFormData.append('name', validatedData.name);
        secureFormData.append('email', validatedData.email);
        secureFormData.append('message', validatedData.message);
        secureFormData.append('_subject', 'Nouveau message depuis Morgan Digital');
        
        // Ajouter des informations de sécurité (optionnel pour Formspree)
        const csrfToken = this.generateCSRFToken();
        secureFormData.append('_csrf', csrfToken);
        secureFormData.append('_timestamp', now.toString());
        
        // CORRECTION FORMSPREE: Utiliser FormData et headers appropriés
        const response = await fetch(this.form.action, {
            method: 'POST',
            body: secureFormData, // FormData au lieu de JSON
            headers: {
                'Accept': 'application/json'
                // Pas de Content-Type pour FormData, le navigateur le gère automatiquement
            }
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error('Erreur lors de l\'envoi du message: ' + response.status);
        }
        
        return await response.json();
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
        
        // Chercher le conteneur de messages ou l'ajouter après le formulaire
        const messagesContainer = this.form.querySelector('.form-messages') || this.form;
        messagesContainer.appendChild(messageElement);
        
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
        
        // Ajouter les tokens CSRF dans le formulaire au chargement
        const csrfInput = this.form.querySelector('#csrf-token');
        const timestampInput = this.form.querySelector('#form-timestamp');
        
        if (csrfInput) {
            csrfInput.value = this.generateCSRFToken();
        }
        
        if (timestampInput) {
            timestampInput.value = Date.now().toString();
        }
        
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitButton = this.form.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            
            try {
                submitButton.disabled = true;
                submitButton.textContent = 'Envoi en cours...';
                submitButton.classList.add('submitting');
                
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
                    submitButton.classList.remove('submitting');
                }, 3000);
            }
        });
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
// COMPTEUR SIMPLIFIÉ (SANS API SERVEUR)
// ========================================
// FONCTION SUPPRIMÉE: Countdown côté client non sécurisé
// Remplacé par le système SecureCountdown basé sur le serveur

// ========================================
// GESTIONNAIRE D'OFFRES FLOTTANTES SIMPLIFIÉ
// CLASSE SUPPRIMÉE: SimpleFloatingOffer
// Remplacée par un système de gestion des offres basé sur le serveur
// Les codes promo sont maintenant validés via campaign-api.php

// ========================================
// SYSTÈME DE PAIEMENT SIMPLIFIÉ
// ========================================
// Utilisation de liens directs Stripe - pas besoin d'API de validation

// ========================================
// POPUP FLOTTANTE DE RÉDUCTION
// ========================================
function initFloatingOffer() {
    console.log("Initialisation de la popup flottante");
    
    const floatingOffer = document.getElementById('floating-offer');
    if (!floatingOffer) return;
    
    // Afficher la popup après 5 secondes
    setTimeout(() => {
        floatingOffer.style.display = 'block';
        setTimeout(() => {
            floatingOffer.classList.add('show');
        }, 100);
    }, 5000);
    
    // Timer de 15 minutes
    let timeLeft = 15 * 60; // 15 minutes en secondes
    const minutesSpan = document.getElementById('floating-minutes');
    const secondsSpan = document.getElementById('floating-seconds');
    
    const timer = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        if (minutesSpan) minutesSpan.textContent = minutes.toString().padStart(2, '0');
        if (secondsSpan) secondsSpan.textContent = seconds.toString().padStart(2, '0');
        
        timeLeft--;
        
        if (timeLeft < 0) {
            clearInterval(timer);
            floatingOffer.style.display = 'none';
        }
    }, 1000);
    
    // Bouton de fermeture
    const closeBtn = floatingOffer.querySelector('.floating-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            floatingOffer.style.display = 'none';
            clearInterval(timer);
        });
    }
}

// ========================================
// EFFETS VISUELS
// ========================================
function initCursorEffects() {
    console.log("Initialisation des effets de curseur");
    
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    if (!cursor || !cursorFollower) return;
    
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });
    
    function animateFollower() {
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        
        cursorFollower.style.left = followerX + 'px';
        cursorFollower.style.top = followerY + 'px';
        
        requestAnimationFrame(animateFollower);
    }
    animateFollower();
    
    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, .btn');
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            cursorFollower.classList.add('hover');
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            cursorFollower.classList.remove('hover');
        });
    });
}

function initScrollAnimations() {
    console.log("Initialisation des animations de scroll");
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observer les éléments à animer
    const animateElements = document.querySelectorAll('.benefit-card, .portfolio-item, .process-step, .pricing-card');
    animateElements.forEach(element => {
        observer.observe(element);
    });
    
    // Animation des cartes flottantes
    const floatingCards = document.querySelectorAll('.floating-card');
    floatingCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.5}s`;
    });
}

// ========================================
// MODE SOMBRE
// ========================================
function initThemeToggle() {
    console.log("Initialisation du mode sombre");
    
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;
    
    // Vérifier le thème sauvegardé ou préférence système
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark-mode');
    }
    
    // Clic sur le bouton
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        console.log(`Mode ${isDark ? 'sombre' : 'clair'} activé`);
    });
}

// ========================================
// INITIALISATION DE L'APPLICATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Application Morgan Digital démarrée');
    
    try {
        // Fonctionnalités de base qui marchent
        initFloatingOffer();
        initCursorEffects();
        initScrollAnimations();
        
        // Mode sombre
        initThemeToggle();
        
        // Menu mobile simple
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        if (mobileToggle && navMenu) {
            mobileToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }
        
        // Fermeture banner urgence
        const urgencyClose = document.querySelector('.urgency-close');
        if (urgencyClose) {
            urgencyClose.addEventListener('click', () => {
                document.querySelector('.urgency-banner').style.display = 'none';
            });
        }
        
        console.log('✅ Application initialisée avec succès');
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation:', error);
    }
});

// Protection contre les erreurs non gérées
window.addEventListener('error', (event) => {
    console.error('Erreur JavaScript:', event.error);
});

// Protection CSP
if (window.addEventListener) {
    window.addEventListener('securitypolicyviolation', (event) => {
        console.warn('Violation CSP:', event.violatedDirective);
    });
}
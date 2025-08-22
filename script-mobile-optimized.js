// ========================================
// SCRIPT OPTIMISÉ MOBILE - Morgan Digital Landing Page
// ========================================

// Configuration pour mobile
const MOBILE_CONFIG = {
    MOBILE_BREAKPOINT: 768,
    TABLET_BREAKPOINT: 1024,
    REDUCED_MOTION: window.matchMedia('(prefers-reduced-motion: reduce)').matches
};

// Utilitaires
function isMobile() {
    return window.innerWidth <= MOBILE_CONFIG.MOBILE_BREAKPOINT;
}

function isTablet() {
    return window.innerWidth <= MOBILE_CONFIG.TABLET_BREAKPOINT;
}

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

function sanitizeTranslation(htmlString, allowedTags = SECURITY_CONFIG.ALLOWED_HTML_TAGS) {
    const div = document.createElement('div');
    div.innerHTML = htmlString;
    
    div.querySelectorAll('*').forEach(element => {
        if (!allowedTags.includes(element.tagName.toLowerCase())) {
            element.outerHTML = element.textContent;
        }
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
    
    const currentLang = window.location.pathname.includes('index-fr.html') ? 'fr' : 'en';
    updateContent(currentLang);
}

function updateContent(lang) {
    const content = translations[lang];
    if (!content) return;
    
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        const translation = content[key];
        if (translation) {
            element.innerHTML = translation;
        }
    });
}

// ========================================
// FONCTIONS PRINCIPALES OPTIMISÉES MOBILE
// ========================================

function initThemeSwitcher() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;
    
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark.matches)) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!mobileToggle || !navMenu) return;
    
    mobileToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        this.classList.toggle('active');
        
        const spans = this.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
    
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                
                const spans = mobileToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    });
}

// Particules optimisées pour mobile
function initParticles() {
    // Désactiver complètement les particules sur mobile et tablette
    if (isMobile() || MOBILE_CONFIG.REDUCED_MOTION) {
        const particlesContainer = document.getElementById('particles-js');
        if (particlesContainer) {
            particlesContainer.style.display = 'none';
        }
        return;
    }
    
    // Particules réduites pour tablette
    if (isTablet()) {
        if (typeof tsParticles !== 'undefined') {
            tsParticles.load("particles-js", {
                fpsLimit: 30,
                particles: {
                    color: { value: "#a78bfa" },
                    links: {
                        color: "#a78bfa",
                        distance: 100,
                        enable: true,
                        opacity: 0.1,
                        width: 1
                    },
                    move: {
                        direction: "none",
                        enable: true,
                        speed: 1,
                        straight: false
                    },
                    number: { value: 20 }, // Très réduit
                    opacity: { value: 0.1 },
                    shape: { type: "circle" },
                    size: { value: { min: 1, max: 2 } }
                },
                detectRetina: true
            });
        }
        return;
    }
    
    // Version desktop complète
    if (typeof tsParticles !== 'undefined') {
        tsParticles.load("particles-js", {
            fpsLimit: 60,
            interactivity: {
                events: {
                    onHover: { enable: true, mode: "bubble" },
                    resize: true
                },
                modes: {
                    bubble: {
                        distance: 200,
                        duration: 2,
                        opacity: 0.8,
                        size: 15
                    }
                }
            },
            particles: {
                color: { value: "#a78bfa" },
                links: {
                    color: "#a78bfa",
                    distance: 150,
                    enable: true,
                    opacity: 0.2,
                    width: 1
                },
                collisions: { enable: true },
                move: {
                    direction: "none",
                    enable: true,
                    outModes: { default: "bounce" },
                    random: true,
                    speed: 1.5,
                    straight: false
                },
                number: {
                    density: { enable: true, area: 800 },
                    value: 35
                },
                opacity: { value: 0.2 },
                shape: { type: "circle" },
                size: { value: { min: 1, max: 4 } }
            },
            detectRetina: true
        });
    }
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // Offset réduit sur mobile
                const offset = isMobile() ? 60 : 80;
                window.scrollTo({
                    top: target.getBoundingClientRect().top + window.pageYOffset - offset,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initNavbarEffect() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    let lastScrollTop = 0;
    
    // Throttle scroll events pour de meilleures performances
    let ticking = false;
    
    function updateNavbar() {
        const scrollTop = window.pageYOffset;
        
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Auto-hide navigation sur mobile seulement
        if (isMobile()) {
            if (scrollTop > lastScrollTop && scrollTop > 300) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });
}

function initScrollAnimations() {
    // Désactiver les animations complexes sur mobile si reduced motion
    if (MOBILE_CONFIG.REDUCED_MOTION) return;
    
    const observerOptions = {
        threshold: isMobile() ? 0.05 : 0.1,
        rootMargin: isMobile() ? "0px 0px -40px 0px" : "0px 0px -80px 0px"
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const animatedElements = document.querySelectorAll('.benefit-card, .portfolio-item, .process-step, .testimonial-card, .pricing-card');
    
    animatedElements.forEach((el, index) => {
        el.style.setProperty('--animation-delay', `${isMobile() ? 80 : 120 * index}ms`);
        observer.observe(el);
    });
    
    // Styles d'animation optimisés
    const animationCSS = document.createElement('style');
    animationCSS.textContent = `
        .benefit-card, .portfolio-item, .process-step, .testimonial-card, .pricing-card {
            opacity: 0;
            transform: translateY(${isMobile() ? '20px' : '40px'}) scale(0.98);
            transition: opacity ${isMobile() ? '0.4s' : '0.8s'} cubic-bezier(0.165, 0.84, 0.44, 1), 
                       transform ${isMobile() ? '0.4s' : '0.8s'} cubic-bezier(0.165, 0.84, 0.44, 1);
            transition-delay: var(--animation-delay, 0ms);
        }
        .benefit-card.is-visible, .portfolio-item.is-visible, .process-step.is-visible, .testimonial-card.is-visible, .pricing-card.is-visible {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    `;
    document.head.appendChild(animationCSS);
}

function initTitleFader() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    
    const titleLines = heroTitle.querySelectorAll('.title-line');
    if (titleLines.length <= 1) return;
    
    let currentIndex = 0;
    
    // Intervalle plus long sur mobile pour économiser la batterie
    const interval = isMobile() ? 5000 : 4000;
    
    setInterval(() => {
        titleLines[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % titleLines.length;
        titleLines[currentIndex].classList.add('active');
    }, interval);
}

// Désactiver les effets 3D sur mobile
function initCardTilt() {
    if (isMobile() || MOBILE_CONFIG.REDUCED_MOTION) return;
    
    document.querySelectorAll('.benefit-card, .portfolio-item').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const width = rect.width;
            const height = rect.height;
            
            const rotateY = (x / width - 0.5) * 20;
            const rotateX = (y / height - 0.5) * -20;
            
            card.style.transition = 'transform 150ms ease';
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 400ms ease';
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
}

function initStatCounters() {
    const stats = document.querySelectorAll('.stat-number');
    if (!stats.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = parseInt(target.textContent);
                
                if (!isNaN(finalValue)) {
                    animateCounter(target, 0, finalValue, isMobile() ? 1000 : 2000);
                }
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => observer.observe(stat));
}

function animateCounter(element, start, end, duration) {
    const increment = (end - start) / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            element.textContent = end + (element.textContent.includes('%') ? '%' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (element.textContent.includes('%') ? '%' : '');
        }
    }, 16);
}

function initTimelineAnimation() {
    if (isMobile()) return; // Désactiver sur mobile
    
    const timeline = document.querySelector('.process-timeline');
    const progressBar = document.querySelector('.timeline-progress');
    
    if (!timeline || !progressBar) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const rect = entry.target.getBoundingClientRect();
                const progress = Math.min(100, Math.max(0, 
                    ((window.innerHeight - rect.top) / rect.height) * 100
                ));
                progressBar.style.height = progress + '%';
            }
        });
    }, { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] });
    
    observer.observe(timeline);
}

function initCustomCursor() {
    // Désactiver complètement sur mobile et tablette
    if (isMobile() || isTablet()) return;
    
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    if (!cursor || !cursorFollower) return;
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.9;
        cursorY += (mouseY - cursorY) * 0.9;
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        
        cursor.style.transform = `translate(${cursorX - 5}px, ${cursorY - 5}px)`;
        cursorFollower.style.transform = `translate(${followerX - 15}px, ${followerY - 15}px)`;
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform += ' scale(1.5)';
            cursorFollower.style.transform += ' scale(1.5)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = cursor.style.transform.replace(' scale(1.5)', '');
            cursorFollower.style.transform = cursorFollower.style.transform.replace(' scale(1.5)', '');
        });
    });
}

// ========================================
// INITIALISATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Landing Page Mobile-Optimized initialized successfully!');
    
    // Fonctions critiques d'abord
    initThemeSwitcher();
    initMobileMenu();
    initSmoothScroll();
    initNavbarEffect();
    
    // Fonctions d'amélioration progressive
    setTimeout(() => {
        initParticles();
        initScrollAnimations();
        initTitleFader();
        initStatCounters();
        initLanguageSwitcher();
        
        // Fonctions desktop uniquement
        if (!isMobile()) {
            initCardTilt();
            initTimelineAnimation();
            initCustomCursor();
        }
        
        // Animation d'entrée du hero
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.opacity = '0';
            setTimeout(() => {
                heroContent.style.transition = 'opacity 1s ease';
                heroContent.style.opacity = '1';
            }, 100);
        }
    }, 100);
});

// Optimisation du redimensionnement
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Réinitialiser les particules si nécessaire
        const particlesContainer = document.getElementById('particles-js');
        if (particlesContainer) {
            if (isMobile()) {
                particlesContainer.style.display = 'none';
            } else {
                particlesContainer.style.display = 'block';
            }
        }
    }, 250);
});
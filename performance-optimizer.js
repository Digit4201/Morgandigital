// ========================================
// SYSTÈME D'OPTIMISATION DE PERFORMANCE
// Morgan Digital Landing Page - Performance Optimizer
// ========================================

class PerformanceOptimizer {
    constructor() {
        this.config = {
            lazyLoadOffset: 100, // pixels before entering viewport
            imagePlaceholderColor: '#f3f4f6',
            criticalResourceTimeout: 5000,
            preloadLimit: 3,
            cacheVersion: '1.0.0'
        };
        
        this.metrics = {
            loadStart: performance.now(),
            resourcesLoaded: 0,
            imagesOptimized: 0,
            cacheHits: 0
        };
        
        this.initialize();
    }
    
    initialize() {
        // Attendre que le DOM soit prêt
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.startOptimizations());
        } else {
            this.startOptimizations();
        }
    }
    
    startOptimizations() {
        console.log('🚀 Performance Optimizer initialized');
        
        // Optimisations par ordre de priorité
        this.optimizeCriticalResources();
        this.setupLazyLoading();
        this.optimizeImages();
        this.setupIntelligentPreloading();
        this.optimizeAnimations();
        this.setupCacheStrategy();
        this.monitorPerformance();
        
        // Rapport de performance après optimisation
        setTimeout(() => this.generatePerformanceReport(), 3000);
    }
    
    // ========================================
    // OPTIMISATION DES RESSOURCES CRITIQUES
    // ========================================
    
    optimizeCriticalResources() {
        // Inline du CSS critique
        this.inlineCriticalCSS();
        
        // Précharger les ressources importantes
        this.preloadCriticalResources();
        
        // Optimiser le chargement des polices
        this.optimizeFontLoading();
        
        // Déferer le JavaScript non critique
        this.deferNonCriticalJS();
    }
    
    inlineCriticalCSS() {
        // Identifier et inliner le CSS above-the-fold
        const criticalSelectors = [
            '.navbar',
            '.hero',
            '.urgency-banner',
            '.btn-primary',
            'h1, h2',
            '.container'
        ];
        
        // Créer un style inline pour le CSS critique
        const criticalCSS = this.extractCriticalCSS(criticalSelectors);
        if (criticalCSS) {
            const style = document.createElement('style');
            style.textContent = criticalCSS;
            style.setAttribute('data-critical', 'true');
            document.head.insertBefore(style, document.head.firstChild);
        }
    }
    
    extractCriticalCSS(selectors) {
        // Simuler l'extraction du CSS critique
        // En production, utiliser un outil comme Critical ou Penthouse
        return `
            .navbar { position: fixed; top: 0; width: 100%; z-index: 1000; }
            .hero { padding: 10rem 0 6rem; }
            .btn-primary { display: inline-flex; padding: 0.875rem 1.75rem; }
            .container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }
            .urgency-banner { background: linear-gradient(135deg, #1f2937 0%, #374151 100%); }
        `;
    }
    
    preloadCriticalResources() {
        const criticalResources = [
            { href: 'style.css', as: 'style' },
            { href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Montserrat:wght@400;500;600;700&display=swap', as: 'style' },
            { href: 'portfolio-greenhorizens.webp', as: 'image' }
        ];
        
        criticalResources.forEach(resource => {
            if (!document.querySelector(`link[href="${resource.href}"]`)) {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.href = resource.href;
                link.as = resource.as;
                if (resource.as === 'style') {
                    link.onload = () => {
                        link.rel = 'stylesheet';
                        this.metrics.resourcesLoaded++;
                    };
                }
                document.head.appendChild(link);
            }
        });
    }
    
    optimizeFontLoading() {
        // Précharger les polices critiques
        const fontPreloads = [
            'https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecnFHGPc.woff2',
            'https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm459WlhyyTh89Y.woff2'
        ];
        
        fontPreloads.forEach(fontUrl => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = fontUrl;
            link.as = 'font';
            link.type = 'font/woff2';
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
        
        // Optimiser l'affichage des polices
        if ('fontDisplay' in document.documentElement.style) {
            const style = document.createElement('style');
            style.textContent = `
                @font-face {
                    font-family: 'Poppins';
                    font-display: swap;
                }
                @font-face {
                    font-family: 'Montserrat';
                    font-display: swap;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    deferNonCriticalJS() {
        // Identifier et déferer les scripts non critiques
        const nonCriticalScripts = [
            'vendor/tsparticles.bundle.min.js'
        ];
        
        nonCriticalScripts.forEach(scriptSrc => {
            const script = document.querySelector(`script[src="${scriptSrc}"]`);
            if (script) {
                script.defer = true;
                script.setAttribute('data-deferred', 'true');
            }
        });
    }
    
    // ========================================
    // LAZY LOADING INTELLIGENT
    // ========================================
    
    setupLazyLoading() {
        // Lazy loading des images
        this.setupImageLazyLoading();
        
        // Lazy loading des sections non critiques
        this.setupSectionLazyLoading();
        
        // Lazy loading des iframes et embeds
        this.setupEmbedLazyLoading();
    }
    
    setupImageLazyLoading() {
        // Utiliser Intersection Observer pour les images
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    this.loadImageOptimized(img);
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: `${this.config.lazyLoadOffset}px`,
            threshold: 0.1
        });
        
        // Observer toutes les images avec data-src
        document.querySelectorAll('img[data-src]').forEach(img => {
            // Ajouter un placeholder
            this.addImagePlaceholder(img);
            imageObserver.observe(img);
        });
    }
    
    loadImageOptimized(img) {
        const src = img.dataset.src;
        if (!src) return;
        
        // Créer une nouvelle image pour précharger
        const tempImg = new Image();
        
        tempImg.onload = () => {
            // Transition fluide
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
            
            setTimeout(() => {
                img.src = src;
                img.style.opacity = '1';
                img.classList.add('loaded');
                img.removeAttribute('data-src');
                this.metrics.imagesOptimized++;
            }, 50);
        };
        
        tempImg.onerror = () => {
            console.warn('Failed to load image:', src);
            img.alt = 'Image failed to load';
            img.classList.add('error');
        };
        
        tempImg.src = src;
    }
    
    addImagePlaceholder(img) {
        // Créer un placeholder coloré
        const width = img.getAttribute('width') || '100%';
        const height = img.getAttribute('height') || '200px';
        
        img.style.backgroundColor = this.config.imagePlaceholderColor;
        img.style.width = width;
        img.style.height = height;
        img.style.objectFit = 'cover';
        
        // Ajouter une animation de loading
        img.classList.add('loading-placeholder');
    }
    
    setupSectionLazyLoading() {
        // Lazy load des sections non critiques
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const section = entry.target;
                    this.activateSection(section);
                }
            });
        }, {
            rootMargin: '50px',
            threshold: 0.1
        });
        
        // Observer les sections avec data-lazy
        document.querySelectorAll('[data-lazy="section"]').forEach(section => {
            sectionObserver.observe(section);
        });
    }
    
    activateSection(section) {
        section.classList.add('section-loaded');
        
        // Charger les ressources spécifiques à la section
        const lazyElements = section.querySelectorAll('[data-lazy-load]');
        lazyElements.forEach(element => {
            this.loadLazyElement(element);
        });
    }
    
    // ========================================
    // OPTIMISATION DES IMAGES
    // ========================================
    
    optimizeImages() {
        // Conversion automatique vers des formats modernes
        this.modernImageFormats();
        
        // Responsive images automatiques
        this.setupResponsiveImages();
        
        // Compression intelligente
        this.setupImageCompression();
    }
    
    modernImageFormats() {
        // Détecter le support WebP et AVIF
        const supportsWebP = this.supportsImageFormat('webp');
        const supportsAVIF = this.supportsImageFormat('avif');
        
        document.querySelectorAll('img[data-optimize]').forEach(img => {
            const originalSrc = img.src;
            let optimizedSrc = originalSrc;
            
            if (supportsAVIF && originalSrc.includes('.jpg')) {
                optimizedSrc = originalSrc.replace(/\.(jpg|jpeg)$/i, '.avif');
            } else if (supportsWebP && originalSrc.includes('.jpg')) {
                optimizedSrc = originalSrc.replace(/\.(jpg|jpeg)$/i, '.webp');
            }
            
            // Tester si l'image optimisée existe
            this.testImageExists(optimizedSrc).then(exists => {
                if (exists && optimizedSrc !== originalSrc) {
                    img.src = optimizedSrc;
                    console.log('Optimized image format used:', optimizedSrc);
                }
            });
        });
    }
    
    supportsImageFormat(format) {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL(`image/${format}`).indexOf(`data:image/${format}`) === 0;
    }
    
    testImageExists(url) {
        return new Promise(resolve => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    }
    
    setupResponsiveImages() {
        // Générer des srcsets automatiques pour les images
        document.querySelectorAll('img[data-responsive]').forEach(img => {
            const baseSrc = img.src;
            const sizes = ['320w', '640w', '960w', '1280w'];
            
            const srcset = sizes.map(size => {
                const width = parseInt(size);
                const responsiveSrc = this.generateResponsiveSrc(baseSrc, width);
                return `${responsiveSrc} ${size}`;
            }).join(', ');
            
            img.srcset = srcset;
            img.sizes = '(max-width: 640px) 320px, (max-width: 960px) 640px, (max-width: 1280px) 960px, 1280px';
        });
    }
    
    generateResponsiveSrc(src, width) {
        // Simuler la génération d'URLs responsives
        // En production, utiliser un service comme Cloudinary ou ImageKit
        const extension = src.split('.').pop();
        const baseName = src.replace(`.${extension}`, '');
        return `${baseName}_${width}w.${extension}`;
    }
    
    // ========================================
    // PRELOADING INTELLIGENT
    // ========================================
    
    setupIntelligentPreloading() {
        // Précharger les ressources probables basées sur l'interaction utilisateur
        this.predictivePreloading();
        
        // Précharger au survol
        this.hoverPreloading();
        
        // Précharger selon le scroll
        this.scrollBasedPreloading();
    }
    
    predictivePreloading() {
        // Analyser les patterns de navigation pour précharger
        const navigationPatterns = this.analyzeNavigationPatterns();
        
        // Précharger les ressources les plus probables
        navigationPatterns.forEach(pattern => {
            if (pattern.probability > 0.7) {
                this.preloadResource(pattern.resource);
            }
        });
    }
    
    hoverPreloading() {
        // Précharger au survol des liens
        document.addEventListener('mouseover', (event) => {
            if (event.target.tagName === 'A') {
                const href = event.target.href;
                if (href && !this.isExternalLink(href)) {
                    this.preloadPage(href);
                }
            }
        });
        
        // Précharger les images au survol
        document.addEventListener('mouseover', (event) => {
            if (event.target.tagName === 'IMG' && event.target.dataset.hoverSrc) {
                const hoverSrc = event.target.dataset.hoverSrc;
                this.preloadImage(hoverSrc);
            }
        });
    }
    
    scrollBasedPreloading() {
        // Précharger selon la profondeur de scroll
        let lastScrollDepth = 0;
        
        const handleScroll = this.throttle(() => {
            const scrollDepth = this.getScrollDepth();
            
            // Précharger différentes ressources selon la profondeur
            if (scrollDepth > 25 && lastScrollDepth <= 25) {
                this.preloadNextSection();
            }
            
            if (scrollDepth > 50 && lastScrollDepth <= 50) {
                this.preloadPricingResources();
            }
            
            if (scrollDepth > 75 && lastScrollDepth <= 75) {
                this.preloadContactFormAssets();
            }
            
            lastScrollDepth = scrollDepth;
        }, 250);
        
        window.addEventListener('scroll', handleScroll);
    }
    
    // ========================================
    // OPTIMISATION DES ANIMATIONS
    // ========================================
    
    optimizeAnimations() {
        // Utiliser CSS transforms pour les animations
        this.optimizeCSSAnimations();
        
        // Réduire les animations selon les préférences utilisateur
        this.respectMotionPreferences();
        
        // Optimiser les animations au scroll
        this.optimizeScrollAnimations();
    }
    
    optimizeCSSAnimations() {
        // Ajouter will-change aux éléments animés
        document.querySelectorAll('[class*="animate"], [class*="transition"]').forEach(element => {
            element.style.willChange = 'transform, opacity';
        });
        
        // Utiliser transform3d pour forcer l'accélération GPU
        const style = document.createElement('style');
        style.textContent = `
            .hero-visual, .floating-card, .benefit-card {
                transform: translate3d(0, 0, 0);
            }
        `;
        document.head.appendChild(style);
    }
    
    respectMotionPreferences() {
        // Respecter prefers-reduced-motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            const style = document.createElement('style');
            style.textContent = `
                *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                    scroll-behavior: auto !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    optimizeScrollAnimations() {
        // Utiliser requestAnimationFrame pour les animations scroll
        let ticking = false;
        
        const updateAnimations = () => {
            // Traiter les animations
            this.updateScrollBasedAnimations();
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateAnimations);
                ticking = true;
            }
        });
    }
    
    // ========================================
    // STRATÉGIE DE CACHE
    // ========================================
    
    setupCacheStrategy() {
        // Cache intelligent avec Service Worker
        this.setupServiceWorker();
        
        // Cache localStorage pour les données
        this.setupLocalStorageCache();
        
        // Cache des ressources critiques
        this.setupResourceCache();
    }
    
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js', {
                scope: '/',
                updateViaCache: 'none'
            }).then(registration => {
                console.log('Service Worker registered successfully');
                this.metrics.cacheHits++;
            }).catch(error => {
                console.warn('Service Worker registration failed:', error);
            });
        }
    }
    
    setupLocalStorageCache() {
        const cache = {
            set: (key, data, expiry = 3600000) => { // 1 heure par défaut
                const item = {
                    data: data,
                    timestamp: Date.now(),
                    expiry: expiry
                };
                localStorage.setItem(`morgan_cache_${key}`, JSON.stringify(item));
            },
            
            get: (key) => {
                const itemStr = localStorage.getItem(`morgan_cache_${key}`);
                if (!itemStr) return null;
                
                const item = JSON.parse(itemStr);
                if (Date.now() - item.timestamp > item.expiry) {
                    localStorage.removeItem(`morgan_cache_${key}`);
                    return null;
                }
                
                this.metrics.cacheHits++;
                return item.data;
            },
            
            clear: () => {
                Object.keys(localStorage).forEach(key => {
                    if (key.startsWith('morgan_cache_')) {
                        localStorage.removeItem(key);
                    }
                });
            }
        };
        
        window.MorganCache = cache;
    }
    
    // ========================================
    // MONITORING DE PERFORMANCE
    // ========================================
    
    monitorPerformance() {
        // Observer les Core Web Vitals
        this.observeCoreWebVitals();
        
        // Surveiller les ressources lentes
        this.monitorSlowResources();
        
        // Analyser la performance continue
        this.setupPerformanceAnalysis();
    }
    
    observeCoreWebVitals() {
        // Largest Contentful Paint
        if ('PerformanceObserver' in window) {
            try {
                const lcpObserver = new PerformanceObserver((entryList) => {
                    const entries = entryList.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    
                    console.log('LCP:', lastEntry.startTime);
                    this.reportMetric('lcp', lastEntry.startTime);
                });
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {
                console.warn('LCP observer not supported');
            }
        }
        
        // First Input Delay
        if ('PerformanceObserver' in window) {
            try {
                const fidObserver = new PerformanceObserver((entryList) => {
                    const entries = entryList.getEntries();
                    entries.forEach(entry => {
                        console.log('FID:', entry.processingStart - entry.startTime);
                        this.reportMetric('fid', entry.processingStart - entry.startTime);
                    });
                });
                fidObserver.observe({ entryTypes: ['first-input'] });
            } catch (e) {
                console.warn('FID observer not supported');
            }
        }
        
        // Cumulative Layout Shift
        if ('PerformanceObserver' in window) {
            try {
                let clsScore = 0;
                const clsObserver = new PerformanceObserver((entryList) => {
                    for (const entry of entryList.getEntries()) {
                        if (!entry.hadRecentInput) {
                            clsScore += entry.value;
                        }
                    }
                    console.log('CLS:', clsScore);
                    this.reportMetric('cls', clsScore);
                });
                clsObserver.observe({ entryTypes: ['layout-shift'] });
            } catch (e) {
                console.warn('CLS observer not supported');
            }
        }
    }
    
    generatePerformanceReport() {
        const loadTime = performance.now() - this.metrics.loadStart;
        const performanceData = performance.getEntriesByType('navigation')[0];
        
        const report = {
            timestamp: new Date().toISOString(),
            loadTime: Math.round(loadTime),
            domContentLoaded: performanceData ? Math.round(performanceData.domContentLoadedEventEnd - performanceData.navigationStart) : null,
            resourcesLoaded: this.metrics.resourcesLoaded,
            imagesOptimized: this.metrics.imagesOptimized,
            cacheHits: this.metrics.cacheHits,
            memoryUsage: this.getMemoryUsage(),
            connectionType: this.getConnectionType()
        };
        
        console.log('📊 Performance Report:', report);
        
        // Envoyer le rapport au monitoring
        if (window.securityMonitor) {
            window.securityMonitor.logEvent('performance_report', report, 'info');
        }
        
        return report;
    }
    
    // ========================================
    // UTILITAIRES
    // ========================================
    
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
    
    getScrollDepth() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        return Math.round((scrollTop / docHeight) * 100);
    }
    
    isExternalLink(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname !== window.location.hostname;
        } catch {
            return false;
        }
    }
    
    getMemoryUsage() {
        if ('memory' in performance) {
            return {
                used: Math.round(performance.memory.usedJSHeapSize / 1048576), // MB
                total: Math.round(performance.memory.totalJSHeapSize / 1048576) // MB
            };
        }
        return null;
    }
    
    getConnectionType() {
        if ('connection' in navigator) {
            return {
                effectiveType: navigator.connection.effectiveType,
                saveData: navigator.connection.saveData
            };
        }
        return null;
    }
    
    reportMetric(name, value) {
        // Reporter les métriques au système de monitoring
        if (window.securityMonitor) {
            window.securityMonitor.logEvent('web_vital', {
                metric: name,
                value: Math.round(value),
                timestamp: performance.now()
            }, 'info');
        }
    }
    
    // Méthodes placeholder pour les fonctionnalités avancées
    analyzeNavigationPatterns() { return []; }
    preloadResource(resource) { console.log('Preloading:', resource); }
    preloadPage(href) { console.log('Preloading page:', href); }
    preloadImage(src) { console.log('Preloading image:', src); }
    preloadNextSection() { console.log('Preloading next section'); }
    preloadPricingResources() { console.log('Preloading pricing resources'); }
    preloadContactFormAssets() { console.log('Preloading contact form assets'); }
    updateScrollBasedAnimations() { /* Animations logic */ }
    loadLazyElement(element) { console.log('Loading lazy element:', element); }
    activateSection(section) { section.classList.add('loaded'); }
    monitorSlowResources() { /* Resource monitoring */ }
    setupPerformanceAnalysis() { /* Analysis setup */ }
    setupResourceCache() { /* Resource cache setup */ }
}

// ========================================
// SERVICE WORKER POUR CACHE AVANCÉ
// ========================================

const serviceWorkerCode = `
// Service Worker pour cache intelligent
const CACHE_NAME = 'morgan-digital-v1.0.0';
const STATIC_CACHE = 'morgan-static-v1';
const DYNAMIC_CACHE = 'morgan-dynamic-v1';

const STATIC_ASSETS = [
    '/',
    '/style.css',
    '/script.js',
    '/portfolio-greenhorizens.webp',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Montserrat:wght@400;500;600;700&display=swap'
];

// Installation du Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => cache.addAll(STATIC_ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Activation du Service Worker
self.addEventListener('activate', event => {
    event.waitUntil(
        Promise.all([
            // Nettoyer les anciens caches
            caches.keys().then(cacheNames => 
                Promise.all(
                    cacheNames
                        .filter(cacheName => 
                            cacheName !== STATIC_CACHE && 
                            cacheName !== DYNAMIC_CACHE
                        )
                        .map(cacheName => caches.delete(cacheName))
                )
            ),
            self.clients.claim()
        ])
    );
});

// Stratégie de cache
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Cache First pour les assets statiques
    if (STATIC_ASSETS.includes(request.url) || request.url.includes('.css') || request.url.includes('.js')) {
        event.respondWith(
            caches.match(request)
                .then(response => response || fetch(request))
        );
        return;
    }
    
    // Network First pour les pages et API
    if (request.method === 'GET' && url.origin === location.origin) {
        event.respondWith(
            fetch(request)
                .then(response => {
                    const responseClone = response.clone();
                    caches.open(DYNAMIC_CACHE)
                        .then(cache => cache.put(request, responseClone));
                    return response;
                })
                .catch(() => caches.match(request))
        );
    }
});
`;

// ========================================
// INITIALISATION
// ========================================

// Créer le Service Worker
if ('serviceWorker' in navigator) {
    const blob = new Blob([serviceWorkerCode], { type: 'application/javascript' });
    const swUrl = URL.createObjectURL(blob);
    
    navigator.serviceWorker.register(swUrl).catch(console.warn);
}

// Initialiser l'optimiseur de performance
document.addEventListener('DOMContentLoaded', () => {
    window.performanceOptimizer = new PerformanceOptimizer();
});

// Exporter pour utilisation en module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceOptimizer;
}
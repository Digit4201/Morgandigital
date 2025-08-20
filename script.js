// ========================================
// LANGUAGE SWITCHER
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
        benefit_1_title: "Optimized for conversion",
        benefit_1_text: "Each section is designed according to the best practices of persuasion and consumer psychology to maximize your conversion rates.",
        benefit_1_item_1: "Persuasive copywriting",
        benefit_1_item_2: "Strategically placed CTAs",
        benefit_1_item_3: "A/B testing included",
        benefit_2_title: "Custom design",
        benefit_2_text: "A unique design that reflects your personality and speaks directly to your target audience. No generic templates.",
        benefit_2_item_1: "100% personalized",
        benefit_2_item_2: "Adapted to your branding",
        benefit_2_item_3: "Mobile-first responsive",
        benefit_3_title: "Easy integration",
        benefit_3_text: "Compatible with all your current tools: Zoom, Calendly, payment systems, CRM, email marketing...",
        benefit_3_item_1: "Stripe, PayPal integrated",
        benefit_3_item_2: "Native CRM connection",
        benefit_3_item_3: "Tracking & Analytics",
        benefit_4_title: "Fast delivery",
        benefit_4_text: "Your professional landing page delivered in 48-72h. No more waiting for weeks to start selling.",
        benefit_4_item_1: "Optimized process",
        benefit_4_item_2: "Direct communication",
        benefit_4_item_3: "Unlimited revisions for 7 days",
        portfolio_badge: "Achievements",
        portfolio_title: 'Results that speak for <span class="gradient-text">themselves</span>',
        portfolio_subtitle: "Discover one of my recent creations",
        portfolio_tag: "Sustainable Investment",
        portfolio_item_title: "Green Horizens Group",
        portfolio_item_text: "Investment platform in renewable energies.",
        portfolio_stat_1_strong: "+12%",
        portfolio_stat_1_text: "annual return",
        portfolio_stat_2_strong: "2000+",
        portfolio_stat_2_text: "investors",
        process_badge: "How it works",
        process_title: 'A simple process in <span class="gradient-text">3 steps</span>',
        process_subtitle: "From idea to online launch, I take care of everything",
        process_step_1_title: "Briefing & Strategy",
        process_step_1_text: "We discuss your goals, your audience, and your specific needs. I ask the right questions to create a page that converts.",
        process_step_1_item_1: "✓ 30min discovery call",
        process_step_1_item_2: "✓ Market analysis",
        process_step_1_item_3: "✓ Conversion strategy",
        process_step_2_title: "Conception & Design",
        process_step_2_text: "I create your custom landing page with a modern design and persuasive texts that speak to your audience.",
        process_step_2_item_1: "✓ Interactive mockup",
        process_step_2_item_2: "✓ Copywriting included",
        process_step_2_item_3: "✓ Unlimited revisions",
        process_step_3_title: "Delivery & Optimization",
        process_step_3_text: "Your page is put online, tested, and optimized. I train you on its use and remain available for adjustments.",
        process_step_3_item_1: "✓ Online launch",
        process_step_3_item_2: "✓ Training included",
        process_step_3_item_3: "✓ 30-day support",
        cta_title: 'Ready to <span class="gradient-text">multiply your conversions</span>?',
        cta_subtitle: "Let's discuss your project and see how I can turn your expertise into a conversion machine",
        cta_highlight_1: "Free, no-obligation quote",
        cta_highlight_2: "Delivery in 48-72h",
        cta_highlight_3: "30-day money-back guarantee",
        cta_highlight_4: "Support and training included",
        form_name_placeholder: "Your name",
        form_email_placeholder: "Your email",
        form_message_placeholder: "Your message",
        form_submit_button: "Send message",
        cta_badge_1: "Landing Pages created",
        cta_badge_2: "Average conversion rate",
        footer_description: "Expert in creating high-conversion Landing Pages for online coaches and trainers.",
        footer_services_title: "Services",
        footer_service_1: "Landing Pages",
        footer_service_2: "Sales Pages",
        footer_service_3: "Complete Funnels",
        footer_service_4: "CRO Optimization",
        footer_resources_title: "Resources",
        footer_resource_1: "Landing Page Guide",
        footer_resource_2: "Free Templates",
        footer_resource_3: "Blog",
        footer_resource_4: "FAQ",
        footer_contact_title: "Contact",
        footer_legal_mentions: "Legal Mentions",
        footer_privacy_policy: "Privacy Policy",
        pricing_badge: "Our Packages",
        pricing_title: 'Choose your <span class="gradient-text">perfect plan</span>',
        pricing_subtitle: "Professional landing pages at unbeatable prices. Limited time offer!",
        pricing_starter_title: "Starter",
        pricing_starter_subtitle: "Perfect for getting started",
        pricing_starter_old_price: "€599",
        pricing_starter_new_price: "€399",
        pricing_starter_period: "One-time payment",
        pricing_starter_feature_1: "✓ Custom Landing Page",
        pricing_starter_feature_2: "✓ Mobile Responsive",
        pricing_starter_feature_3: "✓ Basic SEO Optimization",
        pricing_starter_feature_4: "✓ 48h Delivery",
        pricing_starter_feature_5: "✓ 3 Revisions",
        pricing_starter_button: "Get Started",
        pricing_popular_badge: "Most Popular",
        pricing_professional_title: "Professional",
        pricing_professional_subtitle: "For serious businesses",
        pricing_professional_old_price: "€1,199",
        pricing_professional_new_price: "€799",
        pricing_professional_period: "One-time payment",
        pricing_professional_feature_1: "✓ Premium Landing Page",
        pricing_professional_feature_2: "✓ Advanced Animations",
        pricing_professional_feature_3: "✓ Complete SEO Package",
        pricing_professional_feature_4: "✓ Analytics Integration",
        pricing_professional_feature_5: "✓ 24h Express Delivery",
        pricing_professional_feature_6: "✓ Unlimited Revisions",
        pricing_professional_feature_7: "✓ 30-day Support",
        pricing_professional_button: "Choose Professional",
        pricing_enterprise_title: "Enterprise",
        pricing_enterprise_subtitle: "Complete solution",
        pricing_enterprise_old_price: "€1,999",
        pricing_enterprise_new_price: "€1,299",
        pricing_enterprise_period: "One-time payment",
        pricing_enterprise_feature_1: "✓ Multi-page Website",
        pricing_enterprise_feature_2: "✓ Custom CRM Integration",
        pricing_enterprise_feature_3: "✓ Advanced Analytics",
        pricing_enterprise_feature_4: "✓ Email Marketing Setup",
        pricing_enterprise_feature_5: "✓ Priority Support",
        pricing_enterprise_feature_6: "✓ 12h Ultra-fast Delivery",
        pricing_enterprise_feature_7: "✓ 90-day Warranty",
        pricing_enterprise_button: "Go Enterprise",
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
        benefit_1_title: "Optimisées pour la conversion",
        benefit_1_text: "Chaque section est conçue selon les meilleures pratiques de persuasion et de psychologie du consommateur pour maximiser vos taux de conversion.",
        benefit_1_item_1: "Copywriting persuasif",
        benefit_1_item_2: "CTAs stratégiquement placés",
        benefit_1_item_3: "Tests A/B inclus",
        benefit_2_title: "Design sur mesure",
        benefit_2_text: "Un design unique qui reflète votre personnalité et parle directement à votre audience cible. Pas de templates génériques.",
        benefit_2_item_1: "100% personnalisé",
        benefit_2_item_2: "Adapté à votre branding",
        benefit_2_item_3: "Mobile-first responsive",
        benefit_3_title: "Intégration facile",
        benefit_3_text: "Compatible avec tous vos outils actuels : Zoom, Calendly, systèmes de paiement, CRM, email marketing...",
        benefit_3_item_1: "Stripe, PayPal intégrés",
        benefit_3_item_2: "Connexion CRM native",
        benefit_3_item_3: "Tracking & Analytics",
        benefit_4_title: "Livraison rapide",
        benefit_4_text: "Votre landing page professionnelle livrée en 48-72h. Plus besoin d'attendre des semaines pour commencer à vendre.",
        benefit_4_item_1: "Process optimisé",
        benefit_4_item_2: "Communication directe",
        benefit_4_item_3: "Révisions illimitées 7j",
        portfolio_badge: "Réalisations",
        portfolio_title: 'Des résultats qui parlent <span class="gradient-text">d\'eux-mêmes</span>',
        portfolio_subtitle: "Découvrez une de mes créations récentes",
        portfolio_tag: "Investissement Durable",
        portfolio_item_title: "Green Horizens Group",
        portfolio_item_text: "Plateforme d'investissement dans les énergies renouvelables.",
        portfolio_stat_1_strong: "+12%",
        portfolio_stat_1_text: "rendement annuel",
        portfolio_stat_2_strong: "2000+",
        portfolio_stat_2_text: "investisseurs",
        process_badge: "Comment ça marche",
        process_title: 'Un process simple en <span class="gradient-text">3 étapes</span>',
        process_subtitle: "De l'idée à la mise en ligne, je m'occupe de tout",
        process_step_1_title: "Brief & Stratégie",
        process_step_1_text: "On échange sur vos objectifs, votre audience et vos besoins spécifiques. Je vous pose les bonnes questions pour créer une page qui convertit.",
        process_step_1_item_1: "✓ Appel découverte 30min",
        process_step_1_item_2: "✓ Analyse de votre marché",
        process_step_1_item_3: "✓ Stratégie de conversion",
        process_step_2_title: "Conception & Design",
        process_step_2_text: "Je crée votre landing page sur mesure avec un design moderne et des textes persuasifs qui parlent à votre audience.",
        process_step_2_item_1: "✓ Maquette interactive",
        process_step_2_item_2: "✓ Copywriting inclus",
        process_step_2_item_3: "✓ Révisions illimitées",
        process_step_3_title: "Livraison & Optimisation",
        process_step_3_text: "Votre page est mise en ligne, testée et optimisée. Je vous forme à son utilisation et reste disponible pour les ajustements.",
        process_step_3_item_1: "✓ Mise en ligne",
        process_step_3_item_2: "✓ Formation incluse",
        process_step_3_item_3: "✓ Support 30 jours",
        cta_title: 'Prêt à <span class="gradient-text">multiplier vos conversions</span> ?',
        cta_subtitle: "Discutons de votre projet et voyons comment je peux transformer votre expertise en machine à convertir",
        cta_highlight_1: "Devis gratuit et sans engagement",
        cta_highlight_2: "Livraison en 48-72h",
        cta_highlight_3: "Garantie satisfait ou remboursé 30 jours",
        cta_highlight_4: "Support et formation inclus",
        form_name_placeholder: "Votre nom",
        form_email_placeholder: "Votre email",
        form_message_placeholder: "Votre message",
        form_submit_button: "Envoyer le message",
        cta_badge_1: "Landing Pages créées",
        cta_badge_2: "Taux de conversion moyen",
        footer_description: "Expert en création de Landing Pages haute conversion pour coachs et formateurs en ligne.",
        footer_services_title: "Services",
        footer_service_1: "Landing Pages",
        footer_service_2: "Pages de Vente",
        footer_service_3: "Funnels Complets",
        footer_service_4: "Optimisation CRO",
        footer_resources_title: "Ressources",
        footer_resource_1: "Guide Landing Page",
        footer_resource_2: "Templates Gratuits",
        footer_resource_3: "Blog",
        footer_resource_4: "FAQ",
        footer_contact_title: "Contact",
        footer_legal_mentions: "Mentions Légales",
        footer_privacy_policy: "Politique de Confidentialité",
        pricing_badge: "Nos Forfaits",
        pricing_title: 'Choisissez votre <span class="gradient-text">forfait idéal</span>',
        pricing_subtitle: "Landing pages professionnelles à prix imbattables. Offre limitée !",
        pricing_starter_title: "Débutant",
        pricing_starter_subtitle: "Parfait pour commencer",
        pricing_starter_old_price: "€599",
        pricing_starter_new_price: "€399",
        pricing_starter_period: "Paiement unique",
        pricing_starter_feature_1: "✓ Landing Page Sur-Mesure",
        pricing_starter_feature_2: "✓ Responsive Mobile",
        pricing_starter_feature_3: "✓ SEO de Base",
        pricing_starter_feature_4: "✓ Livraison 48h",
        pricing_starter_feature_5: "✓ 3 Révisions",
        pricing_starter_button: "Commencer",
        pricing_popular_badge: "Le Plus Populaire",
        pricing_professional_title: "Professionnel",
        pricing_professional_subtitle: "Pour les entreprises sérieuses",
        pricing_professional_old_price: "€1,199",
        pricing_professional_new_price: "€799",
        pricing_professional_period: "Paiement unique",
        pricing_professional_feature_1: "✓ Landing Page Premium",
        pricing_professional_feature_2: "✓ Animations Avancées",
        pricing_professional_feature_3: "✓ Package SEO Complet",
        pricing_professional_feature_4: "✓ Intégration Analytics",
        pricing_professional_feature_5: "✓ Livraison Express 24h",
        pricing_professional_feature_6: "✓ Révisions Illimitées",
        pricing_professional_feature_7: "✓ Support 30 jours",
        pricing_professional_button: "Choisir Professionnel",
        pricing_enterprise_title: "Entreprise",
        pricing_enterprise_subtitle: "Solution complète",
        pricing_enterprise_old_price: "€1,999",
        pricing_enterprise_new_price: "€1,299",
        pricing_enterprise_period: "Paiement unique",
        pricing_enterprise_feature_1: "✓ Site Multi-pages",
        pricing_enterprise_feature_2: "✓ Intégration CRM Custom",
        pricing_enterprise_feature_3: "✓ Analytics Avancées",
        pricing_enterprise_feature_4: "✓ Setup Email Marketing",
        pricing_enterprise_feature_5: "✓ Support Prioritaire",
        pricing_enterprise_feature_6: "✓ Livraison Ultra-rapide 12h",
        pricing_enterprise_feature_7: "✓ Garantie 90 jours",
        pricing_enterprise_button: "Aller Entreprise",
    }
};

function initLanguageSwitcher() {
    const langBtn = document.getElementById('lang-btn');
    if (!langBtn) return;

    let currentLang = document.documentElement.lang;

    function setLanguage(lang) {
        document.documentElement.lang = lang;
        document.querySelectorAll('[data-key]').forEach(element => {
            const key = element.getAttribute('data-key');
            if (translations[lang] && translations[lang][key]) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translations[lang][key];
                } else {
                    element.innerHTML = translations[lang][key];
                }
            }
        });
        langBtn.textContent = lang === 'en' ? 'FR' : 'EN';
        currentLang = lang;
    }

    langBtn.addEventListener('click', () => {
        const newLang = currentLang === 'en' ? 'fr' : 'en';
        setLanguage(newLang);
    });

    // Set initial language
    setLanguage(currentLang);
}

document.addEventListener('DOMContentLoaded', () => {
    initLanguageSwitcher();
    initContactForm();
});


// ========================================
// CONTACT FORM HANDLING
// ======================================== 
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    // Génération d'un token CSRF simple côté client
    function generateCSRFToken() {
        return Array.from(crypto.getRandomValues(new Uint8Array(16)), b => b.toString(16).padStart(2, '0')).join('');
    }

    // Validation côté client renforcée
    function validateForm(formData) {
        const name = formData.get('name')?.trim();
        const email = formData.get('email')?.trim();
        const message = formData.get('message')?.trim();

        // Validation nom (2-50 caractères, lettres et espaces uniquement)
        if (!name || name.length < 2 || name.length > 50 || !/^[a-zA-ZÀ-ÿ\s-']+$/.test(name)) {
            throw new Error('Nom invalide (2-50 caractères, lettres uniquement)');
        }

        // Validation email (format + longueur)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || email.length > 254 || !emailRegex.test(email)) {
            throw new Error('Adresse email invalide');
        }

        // Validation message (10-2000 caractères)
        if (!message || message.length < 10 || message.length > 2000) {
            throw new Error('Message doit contenir entre 10 et 2000 caractères');
        }

        // Protection contre les injections basiques
        const dangerousPatterns = [/<script/i, /javascript:/i, /on\w+\s*=/i, /data:text\/html/i];
        const content = name + email + message;
        if (dangerousPatterns.some(pattern => pattern.test(content))) {
            throw new Error('Contenu non autorisé détecté');
        }

        return { name, email, message };
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        
        try {
            const formData = new FormData(form);
            
            // Validation des données
            const validatedData = validateForm(formData);
            
            // Affiche un état de chargement
            submitButton.disabled = true;
            submitButton.innerHTML = 'Envoi en cours...';

            // Ajout du token CSRF et timestamp
            const csrfToken = generateCSRFToken();
            const timestamp = Date.now();
            
            const data = {
                ...validatedData,
                _csrf: csrfToken,
                _timestamp: timestamp,
                _honeypot: '' // Protection anti-spam (champ caché)
            };

            const response = await fetch(form.action, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest' // Protection CSRF additionnelle
                }
            });

            if (response.ok) {
                // Succès
                submitButton.innerHTML = 'Message envoyé !';
                submitButton.style.backgroundColor = '#10b981'; // Vert succès
                form.reset();
                displayFormMessage('Merci ! Votre message a bien été envoyé.', 'success');
            } else {
                // Erreur gérée par le serveur
                const errorData = await response.json();
                throw new Error(errorData.error || 'Une erreur est survenue.');
            }
        } catch (error) {
            // Erreur de validation ou réseau
            submitButton.innerHTML = 'Échec de l\'envoi';
            submitButton.style.backgroundColor = '#ef4444'; // Rouge erreur
            displayFormMessage(`Erreur: ${error.message}`, 'error');
        } finally {
            // Réinitialise le bouton après quelques secondes
            setTimeout(() => {
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
                submitButton.style.backgroundColor = '';
            }, 5000);
        }
    });
}

function displayFormMessage(message, type) {
    // Supprime les anciens messages
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Crée le nouveau message
    const messageElement = document.createElement('div');
    messageElement.className = `form-message ${type}`;
    messageElement.textContent = message;
    
    const form = document.getElementById('contact-form');
    form.appendChild(messageElement);

    // Style pour le message
    const style = document.createElement('style');
    style.textContent = `
        .form-message {
            margin-top: 1rem;
            padding: 1rem;
            border-radius: var(--radius-md);
            text-align: center;
            font-weight: 500;
            animation: fadeIn 0.5s ease;
        }
        .form-message.success {
            background-color: rgba(16, 185, 129, 0.1);
            color: #10b981;
            border: 1px solid #10b981;
        }
        .form-message.error {
            background-color: rgba(239, 68, 68, 0.1);
            color: #ef4444;
            border: 1px solid #ef4444;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);

    // Fait disparaître le message après 5 secondes
    setTimeout(() => {
        messageElement.style.transition = 'opacity 0.5s ease';
        messageElement.style.opacity = '0';
        setTimeout(() => messageElement.remove(), 500);
    }, 5000);
}
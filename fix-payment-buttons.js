// ========================================
// CORRECTION RAPIDE DES BOUTONS DE PAIEMENT
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🔧 Correction des boutons de paiement');
    
    // Supprimer tous les event listeners qui bloquent les liens Stripe
    const stripeButtons = document.querySelectorAll('a[href*="stripe.com"], .pricing-btn');
    
    stripeButtons.forEach(button => {
        if (button.href && button.href.includes('stripe.com')) {
            console.log('✅ Bouton Stripe trouvé:', button.textContent.trim());
            
            // Créer un nouveau bouton sans event listeners
            const newButton = button.cloneNode(true);
            
            // Remplacer l'ancien bouton
            button.parentNode.replaceChild(newButton, button);
            
            // Ajouter un simple tracking (optionnel)
            newButton.addEventListener('click', () => {
                console.log('🛒 Redirection vers Stripe:', newButton.href);
                
                // Tracking analytics optionnel
                if (window.gtag) {
                    window.gtag('event', 'click', {
                        'event_category': 'payment',
                        'event_label': newButton.textContent.trim()
                    });
                }
            });
        }
    });
    
    console.log('✅ Boutons de paiement corrigés - liens directs vers Stripe actifs');
});
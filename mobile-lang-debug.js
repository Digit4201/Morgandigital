// Debug script pour le bouton de langue sur mobile
document.addEventListener('DOMContentLoaded', function() {
    const langBtn = document.getElementById('lang-btn');
    const langSwitcher = document.getElementById('language-switcher');
    
    if (langBtn) {
        console.log('Bouton langue trouvé:', langBtn);
        console.log('Position:', window.getComputedStyle(langSwitcher).position);
        console.log('Z-index:', window.getComputedStyle(langSwitcher).zIndex);
        console.log('Bottom:', window.getComputedStyle(langSwitcher).bottom);
        console.log('Right:', window.getComputedStyle(langSwitcher).right);
        
        // Test des événements tactiles
        langBtn.addEventListener('touchstart', function(e) {
            console.log('Touch start détecté sur bouton langue');
            langBtn.style.transform = 'scale(0.95)';
        });
        
        langBtn.addEventListener('touchend', function(e) {
            console.log('Touch end détecté sur bouton langue');
            langBtn.style.transform = 'scale(1)';
        });
        
        langBtn.addEventListener('click', function(e) {
            console.log('Click détecté sur bouton langue, redirection vers:', this.href);
        });
        
        // Vérifier les éléments qui pourraient bloquer
        document.addEventListener('touchstart', function(e) {
            const element = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
            if (element && element !== langBtn && element.closest('#language-switcher')) {
                console.log('Touch intercepté par:', element);
            }
        });
    } else {
        console.error('Bouton langue non trouvé !');
    }
});
// ========================================
// CORRECTION RAPIDE DU FORMULAIRE - Morgan Digital
// ========================================

// Vérification simple du formulaire au chargement
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔧 Script de correction du formulaire chargé');
    
    const form = document.getElementById('contact-form');
    console.log('📝 Formulaire trouvé:', !!form);
    
    if (!form) {
        console.error('❌ Formulaire contact-form introuvable!');
        return;
    }
    
    // Fonction de soumission simple et sécurisée
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('📤 Soumission du formulaire interceptée');
        
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        try {
            // Désactiver le bouton
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            
            // Validation simple des champs
            const formData = new FormData(form);
            const name = formData.get('name')?.trim();
            const email = formData.get('email')?.trim();
            const message = formData.get('message')?.trim();
            
            console.log('📋 Données du formulaire:', { name: !!name, email: !!email, message: !!message });
            
            // Validations basiques
            if (!name || name.length < 2) {
                throw new Error('Please enter a valid name (at least 2 characters)');
            }
            
            if (!email || !email.includes('@') || !email.includes('.')) {
                throw new Error('Please enter a valid email address');
            }
            
            if (!message || message.length < 10) {
                throw new Error('Please enter a message (at least 10 characters)');
            }
            
            // Vérification anti-spam honeypot
            const honeypot = formData.get('_honeypot');
            if (honeypot && honeypot.trim() !== '') {
                throw new Error('Spam detected');
            }
            
            console.log('✅ Validation réussie, envoi vers Formspree...');
            
            // Envoyer vers Formspree
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            console.log('📡 Réponse Formspree:', response.status);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('❌ Erreur Formspree:', errorData);
                throw new Error('Network error. Please try again.');
            }
            
            const result = await response.json();
            console.log('✅ Succès Formspree:', result);
            
            // Message de succès
            showMessage('✅ Message sent successfully! We\'ll get back to you soon.', 'success');
            form.reset();
            
            // Réinitialiser le compteur de tentatives
            submitButton.dataset.attempts = '0';
            
        } catch (error) {
            console.error('❌ Erreur lors de l\'envoi:', error);
            showMessage('❌ ' + error.message, 'error');
            
            // Compteur de tentatives
            const attempts = parseInt(submitButton.dataset.attempts || '0') + 1;
            submitButton.dataset.attempts = attempts.toString();
            
            if (attempts >= 3) {
                submitButton.disabled = true;
                submitButton.textContent = 'Too many attempts';
                showMessage('Too many failed attempts. Please refresh the page.', 'error');
                return;
            }
            
        } finally {
            if (!submitButton.disabled) {
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
        }
    });
    
    // Fonction pour afficher les messages
    function showMessage(message, type = 'info') {
        // Supprimer les anciens messages
        const oldMessages = document.querySelectorAll('.form-message-fix');
        oldMessages.forEach(msg => msg.remove());
        
        // Créer le nouveau message
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message-fix form-message-${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            padding: 12px 16px;
            margin: 16px 0;
            border-radius: 8px;
            font-weight: 500;
            font-size: 14px;
            ${type === 'success' ? 'background: #dcfce7; color: #166534; border: 1px solid #bbf7d0;' : ''}
            ${type === 'error' ? 'background: #fef2f2; color: #dc2626; border: 1px solid #fecaca;' : ''}
            ${type === 'info' ? 'background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe;' : ''}
        `;
        
        // Ajouter après le formulaire
        const container = form.querySelector('.form-messages') || form.parentNode;
        container.appendChild(messageDiv);
        
        // Faire disparaître après 5 secondes
        setTimeout(() => {
            messageDiv.style.transition = 'opacity 0.5s ease';
            messageDiv.style.opacity = '0';
            setTimeout(() => messageDiv.remove(), 500);
        }, 5000);
    }
    
    // Ajouter token CSRF et timestamp
    const csrfInput = form.querySelector('#csrf-token');
    const timestampInput = form.querySelector('#form-timestamp');
    
    if (csrfInput && !csrfInput.value) {
        csrfInput.value = generateCSRFToken();
        console.log('🔐 Token CSRF généré');
    }
    
    if (timestampInput && !timestampInput.value) {
        timestampInput.value = Date.now().toString();
        console.log('⏰ Timestamp ajouté');
    }
    
    console.log('✅ Formulaire correctement initialisé');
});

// Fonction pour générer un token CSRF simple
function generateCSRFToken() {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}
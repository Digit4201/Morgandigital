/**
 * Système de countdown sécurisé basé sur le serveur
 * Morgan Digital - Sécurité renforcée
 */

class SecureCountdown {
    constructor() {
        this.isActive = false;
        this.serverTime = null;
        this.campaignData = null;
        this.updateInterval = null;
        this.syncInterval = null;
        this.lastSyncTime = 0;
        this.syncFrequency = 300000; // 5 minutes
    }

    async syncWithServer() {
        try {
            const response = await fetch('/campaign-api.php?action=get_countdown', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'same-origin'
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success && data.active) {
                this.campaignData = data.campaign;
                this.isActive = true;
                this.serverTime = new Date().getTime();
                this.lastSyncTime = Date.now();
                
                // Démarrer le countdown local basé sur les données serveur
                this.startLocalCountdown(data.countdown);
                
                console.log('✅ Sync serveur réussie:', data.campaign.name);
            } else if (data.expired) {
                this.stopCountdown();
                this.hideCountdownElements();
                console.log('⏰ Campagne expirée côté serveur');
            } else {
                this.isActive = false;
                this.hideCountdownElements();
                console.log('❌ Aucune campagne active');
            }
        } catch (error) {
            console.error('❌ Erreur sync serveur:', error);
            // En cas d'erreur, masquer le countdown pour éviter les fausses informations
            this.hideCountdownElements();
        }
    }

    startLocalCountdown(initialCountdown) {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }

        let remainingSeconds = initialCountdown.total_seconds;
        const startTime = Date.now();

        this.updateInterval = setInterval(() => {
            // Calculer le temps écoulé depuis le début du countdown local
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            const currentRemaining = Math.max(0, remainingSeconds - elapsed);

            if (currentRemaining <= 0) {
                this.stopCountdown();
                this.hideCountdownElements();
                return;
            }

            this.updateCountdownDisplay({
                days: Math.floor(currentRemaining / (60 * 60 * 24)),
                hours: Math.floor((currentRemaining % (60 * 60 * 24)) / (60 * 60)),
                minutes: Math.floor((currentRemaining % (60 * 60)) / 60),
                seconds: currentRemaining % 60,
                total_seconds: currentRemaining
            });

            // Re-synchroniser avec le serveur périodiquement
            if (Date.now() - this.lastSyncTime > this.syncFrequency) {
                this.syncWithServer();
            }
        }, 1000);
    }

    updateCountdownDisplay(countdown) {
        // Mettre à jour les éléments du DOM de manière sécurisée
        const elements = {
            days: document.getElementById('days'),
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds'),
            pricingCountdown: document.getElementById('pricing-countdown')
        };

        // Utiliser textContent pour éviter les injections XSS
        if (elements.days) {
            elements.days.textContent = countdown.days.toString();
        }
        if (elements.hours) {
            elements.hours.textContent = countdown.hours.toString();
        }
        if (elements.minutes) {
            elements.minutes.textContent = countdown.minutes.toString();
        }
        if (elements.seconds) {
            elements.seconds.textContent = countdown.seconds.toString();
        }
        if (elements.pricingCountdown) {
            elements.pricingCountdown.textContent = `${countdown.days} jours`;
        }

        // Mettre à jour la date d'urgence si elle existe
        const urgencyDate = document.getElementById('urgency-date');
        if (urgencyDate && this.campaignData) {
            const endDate = new Date(this.campaignData.end_date);
            urgencyDate.textContent = endDate.toLocaleDateString('fr-FR', {
                month: 'long',
                day: 'numeric'
            });
        }
    }

    hideCountdownElements() {
        // Masquer tous les éléments liés au countdown
        const elementsToHide = [
            '.urgency-banner',
            '.urgency-countdown', 
            '.urgency-highlight',
            '.floating-offer',
            '#pricing-countdown'
        ];

        elementsToHide.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                element.style.display = 'none';
            });
        });

        console.log('🚫 Éléments de countdown masqués');
    }

    stopCountdown() {
        this.isActive = false;
        
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
        
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            this.syncInterval = null;
        }
    }

    async init() {
        // Sync initial avec le serveur
        await this.syncWithServer();
        
        // Programmer des syncs régulières avec le serveur
        this.syncInterval = setInterval(() => {
            this.syncWithServer();
        }, this.syncFrequency);
        
        // Gestion de la fermeture de page
        window.addEventListener('beforeunload', () => {
            this.stopCountdown();
        });
        
        // Gestion de la visibilité de la page (pause quand invisible)
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible' && this.isActive) {
                // Re-synchroniser quand la page redevient visible
                this.syncWithServer();
            }
        });
        
        console.log('🔒 Countdown sécurisé initialisé');
    }
}

// Gestionnaire de codes promo sécurisé
class SecurePromoHandler {
    constructor() {
        this.isValidating = false;
    }

    async validatePromoCode(code, amount) {
        if (this.isValidating) {
            return { success: false, error: 'Validation en cours...' };
        }

        this.isValidating = true;

        try {
            const response = await fetch('/campaign-api.php?action=validate_promo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    code: code.trim().toUpperCase(),
                    amount: parseFloat(amount)
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const result = await response.json();
            return result;

        } catch (error) {
            console.error('❌ Erreur validation code promo:', error);
            return { 
                success: false, 
                error: 'Erreur de validation, veuillez réessayer' 
            };
        } finally {
            this.isValidating = false;
        }
    }
}

// Export des classes pour utilisation globale
window.SecureCountdown = SecureCountdown;
window.SecurePromoHandler = SecurePromoHandler;
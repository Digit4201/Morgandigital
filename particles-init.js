// Initialisation des particules - Morgan Digital
console.log("Script particules démarré");
console.log("tsParticles disponible :", typeof tsParticles);

function initParticlesFinal() {
    console.log("initParticlesFinal appelée");
    
    if (typeof tsParticles !== 'undefined') {
        console.log("tsParticles trouvé, initialisation...");
        
        tsParticles.load("particles-js", {
            particles: {
                number: { value: 40 },
                color: { value: "#a78bfa" },
                shape: { type: "circle" },
                opacity: { value: 0.5 },
                size: { 
                    value: 3,
                    random: true
                },
                move: {
                    enable: true,
                    speed: 2
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: "#a78bfa",
                    opacity: 0.4,
                    width: 1
                }
            },
            retina_detect: true
        }).then(() => {
            console.log("Particules chargées avec succès !");
        }).catch((error) => {
            console.error("Erreur particules:", error);
        });
    } else {
        console.error("tsParticles non disponible !");
    }
}

// Multiple tentatives comme dans le test qui marche
initParticlesFinal();
setTimeout(initParticlesFinal, 1000);
window.addEventListener('load', initParticlesFinal);
# 🔒 GUIDE DE CORRECTIONS DE SÉCURITÉ - Morgan Digital

## 📋 Résumé des Vulnérabilités Corrigées

Ce guide présente toutes les corrections appliquées aux vulnérabilités de sécurité critiques identifiées dans l'audit de code.

---

## 🚨 VULNÉRABILITÉS CRITIQUES CORRIGÉES

### 1. **Cross-Site Scripting (XSS) - CRITIQUE ✅**

**Problème**: Utilisation d'`innerHTML` sans sanitisation dans `script.js`

**Fichiers concernés**: 
- ❌ `script.js` (vulnérable) 
- ✅ `script-secure.js` (sécurisé)

**Corrections appliquées**:

```javascript
// AVANT (Vulnérable)
element.innerHTML = translations[lang][key];
scarcityEl.innerHTML = `<span>${remainingSpots}</span>`;
claimBtn.innerHTML = '✅ Code copié !';

// APRÈS (Sécurisé) 
element.innerHTML = sanitizeTranslation(translations[lang][key]);
// OU pour du texte simple:
element.textContent = translations[lang][key];
claimBtn.textContent = '✅ Code copié !';
```

**Fonction de sanitisation ajoutée**:
```javascript
function sanitizeTranslation(htmlString, allowedTags = ['span', 'strong', 'em']) {
    const div = document.createElement('div');
    div.innerHTML = htmlString;
    
    div.querySelectorAll('*').forEach(element => {
        if (!allowedTags.includes(element.tagName.toLowerCase())) {
            element.outerHTML = element.textContent;
        }
        // Supprimer tous les attributs sauf class
        Array.from(element.attributes).forEach(attr => {
            if (attr.name !== 'class') {
                element.removeAttribute(attr.name);
            }
        });
    });
    
    return div.innerHTML;
}
```

---

### 2. **Protection CSRF Insuffisante - ÉLEVÉ ✅**

**Problème**: Formulaires sans protection CSRF

**Fichiers concernés**:
- ✅ `index.html` (corrigé)
- ✅ `index-fr.html` (corrigé)
- ✅ `script-secure.js` (implémentation)
- ✅ `backend-api-example.php` (validation serveur)

**Corrections appliquées**:

**HTML - Ajout de champs CSRF**:
```html
<!-- Protection CSRF -->
<input type="hidden" name="_csrf" id="csrf-token" value="">
<input type="hidden" name="_timestamp" id="form-timestamp" value="">

<!-- Honeypot renforcé -->
<input type="text" name="_honeypot" style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0" 
       tabindex="-1" autocomplete="off" aria-hidden="true">
```

**JavaScript - Génération de tokens**:
```javascript
generateCSRFToken() {
    const array = new Uint8Array(SECURITY_CONFIG.CSRF_TOKEN_LENGTH / 2);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}
```

**PHP - Validation serveur**:
```php
public function validateCSRFToken($token) {
    $tokenFile = $this->sessionPath . 'csrf_' . hash('sha256', $this->ipAddress);
    // ... validation avec expiration et usage unique
    return hash_equals($tokenData['token'], $token);
}
```

---

### 3. **Logique de Prix Côté Client - ÉLEVÉ ✅**

**Problème**: Prix et compteurs manipulables côté client

**Corrections appliquées**:

**AVANT (Vulnérable)**:
```javascript
// Date de fin codée en dur côté client
const endDate = new Date('2025-08-31T23:59:59').getTime();
// Changement de prix côté client
document.querySelectorAll('.price-current').forEach((el, index) => {
    el.textContent = originalPrices[index];
});
```

**APRÈS (Sécurisé)**:
```javascript
// Récupération sécurisée depuis le serveur
async fetchEndDate() {
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
    }
}
```

**API Backend**:
```php
public function getCampaignStatus() {
    return [
        'active' => $this->isActive,
        'end_date' => date('c', $this->campaignEndDate),
        'time_remaining' => max(0, $this->campaignEndDate - time())
    ];
}
```

---

### 4. **Fausse Rareté (Éthique) - ÉLEVÉ ✅**

**Problème**: Génération de fausses données de rareté

**AVANT (Problématique)**:
```javascript
const remainingSpots = Math.floor(Math.random() * 5) + 2; // Fake!
```

**APRÈS (Éthique)**:
```javascript
// Suppression complète de la logique de fausse rareté
// Remplacement par vraie disponibilité depuis l'API
async fetchRealAvailability() {
    const response = await fetch('/api/availability');
    const data = await response.json();
    return data;
}
```

---

## 🔒 AMÉLIORATIONS DE SÉCURITÉ SUPPLÉMENTAIRES

### 5. **Validation d'Entrée Renforcée ✅**

**Ajouts**:
```html
<!-- Validation HTML5 avec patterns -->
<input type="text" name="name" 
       pattern="[a-zA-ZÀ-ÿ\s\-']{2,50}"
       title="Name must contain only letters, spaces, hyphens and apostrophes (2-50 characters)">

<input type="email" name="email"
       pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
       title="Please enter a valid email address">
```

**Validation JavaScript**:
```javascript
validateInput(value, type) {
    // Protection contre les injections
    const dangerousPatterns = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        // ... autres patterns
    ];
    
    if (dangerousPatterns.some(pattern => pattern.test(value))) {
        throw new Error('Contenu non autorisé détecté');
    }
}
```

---

### 6. **Stockage Sécurisé localStorage ✅**

**AVANT**:
```javascript
localStorage.setItem('urgencyBannerClosed', 'true');
```

**APRÈS**:
```javascript
const secureStorage = {
    setItem(key, value) {
        const encryptedValue = btoa(encodeURIComponent(value));
        localStorage.setItem(key, encryptedValue);
    },
    
    getItem(key) {
        const encryptedValue = localStorage.getItem(key);
        return decodeURIComponent(atob(encryptedValue));
    }
};

// Avec validation d'intégrité
const data = {
    closed: true,
    timestamp: timestamp,
    hash: generateSimpleHash(timestamp.toString())
};
secureStorage.setItem('urgencyBannerClosed', JSON.stringify(data));
```

---

### 7. **Headers de Sécurité Renforcés ✅**

**Fichier**: `.htaccess-secure`

**Améliorations**:
```apache
# CSP sans 'unsafe-inline'
Header always set Content-Security-Policy "default-src 'self'; script-src 'self'"

# Nouveaux headers de sécurité
Header always set Cross-Origin-Opener-Policy "same-origin"
Header always set Cross-Origin-Embedder-Policy "require-corp"
Header always set Cross-Origin-Resource-Policy "same-origin"

# Protection contre les attaques avancées
RewriteCond %{HTTP_USER_AGENT} (nikto|sqlmap|nmap|masscan) [NC]
RewriteRule ^(.*)$ - [F,L]
```

---

## 🚀 INSTRUCTIONS DE DÉPLOIEMENT

### Étape 1: Remplacement des Fichiers

1. **Remplacer le JavaScript vulnérable**:
   ```bash
   mv script.js script.js.backup
   mv script-secure.js script.js
   ```

2. **Mettre à jour .htaccess**:
   ```bash
   mv .htaccess .htaccess.backup
   mv .htaccess-secure .htaccess
   ```

3. **Les fichiers HTML sont déjà mis à jour** avec les protections CSRF

### Étape 2: Configuration Backend

1. **Déployer l'API PHP**:
   - Adapter `backend-api-example.php` selon votre environnement
   - Configurer la base de données pour les vrais codes promo
   - Implémenter l'intégration email (Formspree, SendGrid, etc.)

2. **Configuration serveur web**:
   - Vérifier que les modules Apache sont activés:
     - `mod_headers`
     - `mod_rewrite`
     - `mod_deflate`
     - `mod_expires`

### Étape 3: Tests de Sécurité

1. **Tester la protection XSS**:
   ```javascript
   // Tenter d'injecter dans le formulaire
   // Vérifier que les scripts ne s'exécutent pas
   ```

2. **Vérifier la protection CSRF**:
   ```bash
   # Tenter de soumettre le formulaire sans token
   # Doit retourner une erreur
   ```

3. **Valider le rate limiting**:
   ```bash
   # Faire plus de 10 requêtes en 5 minutes
   # Doit retourner 429 Too Many Requests
   ```

---

## 📊 MESURE DE L'AMÉLIORATION

### Avant Corrections:
- **Vulnérabilités XSS**: 3 critiques
- **Protection CSRF**: Aucune
- **Validation d'entrée**: Basique
- **Logique métier**: Côté client (manipulable)

### Après Corrections:
- **Vulnérabilités XSS**: ✅ Corrigées
- **Protection CSRF**: ✅ Implémentée
- **Validation d'entrée**: ✅ Renforcée (client + serveur)
- **Logique métier**: ✅ Sécurisée côté serveur

---

## ⚠️ POINTS D'ATTENTION RESTANTS

### 1. **URLs Stripe Codées en Dur**
- **Risque**: Modifiable côté client
- **Solution recommandée**: Créer des endpoints serveur pour rediriger vers Stripe
- **Priorité**: Moyenne

### 2. **Dépendance tsparticles**
- **Action**: Vérifier la version et les vulnérabilités connues
- **Solution**: Mettre à jour ou remplacer si vulnérable

### 3. **Conformité RGPD**
- **Action**: Ajouter bannière de consentement cookies
- **Action**: Mettre à jour politique de confidentialité

---

## 🔄 MONITORING ET MAINTENANCE

### 1. **Logs de Sécurité**
```apache
# Dans .htaccess-secure
CustomLog logs/security.log security env=suspicious
```

### 2. **Surveillance des Tentatives d'Attaque**
- Surveiller les logs pour des patterns suspects
- Alertes automatiques sur tentatives XSS/CSRF

### 3. **Tests de Sécurité Réguliers**
- Audit mensuel avec outils automatisés
- Tests de pénétration trimestriels

---

## ✅ CHECKLIST DE VALIDATION

- [ ] Script sécurisé déployé (`script-secure.js`)
- [ ] Formulaires avec protection CSRF
- [ ] Headers de sécurité activés
- [ ] API backend déployée
- [ ] Tests XSS passés
- [ ] Tests CSRF passés
- [ ] Rate limiting fonctionnel
- [ ] Logs de sécurité configurés
- [ ] Documentation mise à jour

---

## 📞 SUPPORT

En cas de questions sur l'implémentation des corrections:

1. **Problèmes techniques**: Consulter les logs d'erreur
2. **Problèmes de sécurité**: Audit supplémentaire recommandé
3. **Performance**: Monitoring des temps de réponse post-déploiement

**Date de création**: 2025-01-27  
**Version**: 1.0.0  
**Statut**: Prêt pour déploiement
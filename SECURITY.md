# Guide de Sécurité - Morgan Digital Landing Page

## 🔒 Mesures de sécurité implémentées

### 1. Protection du formulaire de contact
- ✅ **Token CSRF** côté client pour prévenir les attaques Cross-Site Request Forgery
- ✅ **Champ honeypot** caché pour bloquer les bots spammeurs
- ✅ **Validation stricte** des données (nom, email, message)
- ✅ **Protection contre les injections** (XSS basique)
- ✅ **Limitation de taille** des champs (nom: 50 char, message: 2000 char)
- ✅ **Headers de sécurité** ajoutés aux requêtes AJAX

### 2. Headers de sécurité HTTP
- ✅ **Content Security Policy (CSP)** pour prévenir les injections de scripts
- ✅ **X-Frame-Options: DENY** contre le clickjacking  
- ✅ **X-Content-Type-Options: nosniff** contre le sniffing MIME
- ✅ **X-XSS-Protection** pour activer la protection XSS du navigateur
- ✅ **Strict-Transport-Security (HSTS)** pour forcer HTTPS
- ✅ **Referrer-Policy** pour contrôler les informations de referrer
- ✅ **Permissions-Policy** pour désactiver les APIs non nécessaires

### 3. Protection des ressources
- ✅ **Fichiers sensibles** cachés (.htaccess, logs, config)
- ✅ **Protection anti-hotlink** pour les images
- ✅ **Désactivation de l'indexation** des répertoires
- ✅ **Filtrage des requêtes malveillantes**

### 4. Liens externes sécurisés
- ✅ **rel="noopener noreferrer"** sur tous les liens externes
- ✅ **target="_blank"** pour ouvrir dans un nouvel onglet

### 5. Données personnelles
- ✅ **Coordonnées réelles** remplacent les données factices
- ✅ **Cohérence de la marque** (Morgan Digital partout)

## 📋 Configuration serveur requise

### Apache (.htaccess fourni)
```apache
# Upload du fichier .htaccess à la racine
# Activation des modules requis :
LoadModule headers_module modules/mod_headers.so
LoadModule rewrite_module modules/mod_rewrite.so
LoadModule expires_module modules/mod_expires.so
LoadModule deflate_module modules/mod_deflate.so
```

### Nginx (nginx-security.conf fourni)
```nginx
# Inclure la configuration dans votre server block
include /path/to/nginx-security.conf;
```

## 🚨 Points d'attention pour la production

### SSL/TLS obligatoire
- Certificat SSL valide requis
- Redirection HTTP → HTTPS configurée
- HSTS activé avec préchargement

### Configuration CSP
La CSP actuelle autorise :
- Scripts de Google Fonts et Formspree
- Styles inline (pour les animations)
- Images de tous les domaines HTTPS

⚠️ **À ajuster selon vos besoins spécifiques**

### Validation côté serveur
Le JavaScript validate côté client, mais **TOUJOURS** valider côté serveur :
```php
// Exemple PHP pour Formspree webhook
if ($_POST['_honeypot'] !== '') {
    die('Spam détecté');
}

if (time() - $_POST['_timestamp'] < 3) {
    die('Soumission trop rapide');
}

// Validation du token CSRF si vous gérez le backend
```

## 🔄 Maintenance de sécurité

### Surveillance recommandée
- [ ] Logs d'accès pour détecter les attaques
- [ ] Monitoring des erreurs 403/404
- [ ] Mise à jour régulière des certificats SSL
- [ ] Test des headers de sécurité (securityheaders.com)

### Tests de sécurité
- [ ] Test de pénétration périodique
- [ ] Scan de vulnérabilités 
- [ ] Validation des headers CSP
- [ ] Test du formulaire contre les injections

## 🆘 En cas d'incident

1. **Analyser les logs** d'accès et d'erreur
2. **Bloquer l'IP** malveillante dans .htaccess
3. **Renforcer la CSP** si injection détectée
4. **Changer les tokens** si compromission suspectée
5. **Notifier les utilisateurs** si données exposées

## 📞 Contact sécurité
En cas de découverte de vulnérabilité : heldt.morgan@proton.me

---
**Dernière mise à jour :** Août 2025  
**Version :** 1.0  
**Statut :** ✅ Production Ready
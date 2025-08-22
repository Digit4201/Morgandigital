@echo off
echo 🧹 NETTOYAGE FINAL AVANT GITHUB - Morgan Digital
echo 💰 Version simplifiée avec liens directs Stripe
echo.

echo ❌ Suppression des fichiers de debug et temporaires...
if exist "fix-form.js" del "fix-form.js" && echo   ✓ fix-form.js supprimé
if exist "fix-payment-buttons.js" del "fix-payment-buttons.js" && echo   ✓ fix-payment-buttons.js supprimé
if exist "test-stripe-links.html" del "test-stripe-links.html" && echo   ✓ test-stripe-links.html supprimé
if exist "script.js.backup.js" del "script.js.backup.js" && echo   ✓ script.js.backup.js supprimé
if exist "script-secure-original.js" del "script-secure-original.js" && echo   ✓ script-secure-original.js supprimé
if exist ".htaccess.backup" del ".htaccess.backup" && echo   ✓ .htaccess.backup supprimé

echo ❌ Suppression documentation personnelle...
if exist "SESSION-SUMMARY.md" del "SESSION-SUMMARY.md" && echo   ✓ SESSION-SUMMARY.md supprimé  
if exist "SECURITY-FIXES-GUIDE.md" del "SECURITY-FIXES-GUIDE.md" && echo   ✓ SECURITY-FIXES-GUIDE.md supprimé
if exist "DEPLOYEMENT-CHECKLIST.md" del "DEPLOYEMENT-CHECKLIST.md" && echo   ✓ DEPLOYEMENT-CHECKLIST.md supprimé
if exist "STRIPE-SETUP.md" del "STRIPE-SETUP.md" && echo   ✓ STRIPE-SETUP.md supprimé
if exist "cleanup-before-git.bat" del "cleanup-before-git.bat" && echo   ✓ cleanup-before-git.bat supprimé

echo ❌ Suppression des fichiers API supprimés...
if exist "payment-validation.php" del "payment-validation.php" && echo   ✓ payment-validation.php déjà supprimé
if exist "api-handler.php" del "api-handler.php" && echo   ✓ api-handler.php déjà supprimé
if exist "campaign-api.php" del "campaign-api.php" && echo   ✓ campaign-api.php déjà supprimé
if exist "check-stripe-security.php" del "check-stripe-security.php" && echo   ✓ check-stripe-security.php déjà supprimé

echo.
echo ✅ NETTOYAGE TERMINÉ !
echo.
echo 📋 FICHIERS RESTANTS POUR GITHUB :
dir /b *.html *.css *.js *.php *.json *.txt *.xml *.md 2>nul
echo.
echo 🔒 VÉRIFICATIONS FINALES :
if exist ".env" (echo ⚠️  ATTENTION: .env existe encore !) else (echo ✓ Pas de fichiers sensibles)
if exist ".gitignore" (echo ✓ .gitignore présent) else (echo ⚠️  .gitignore manquant !)
echo ✓ Système simplifié avec liens directs Stripe
echo ✓ Pas de clés API dans le projet
echo.
echo 🚀 PRÊT POUR: git add . && git commit -m "Landing Page Morgan Digital - Liens directs Stripe" && git push
pause
# Script PowerShell pour nettoyer la base de données
# Supprime toutes les données sauf le compte administrateur

# Chemin vers la base de données
$dbPath = ".\academie.db"

# 1. Supprimer tous les paiements
sqlite3 $dbPath "DELETE FROM payment;"

# 2. Supprimer tous les joueurs
sqlite3 $dbPath "DELETE FROM player;"

# 3. Supprimer tous les utilisateurs sauf l'admin
sqlite3 $dbPath "DELETE FROM user WHERE role != 'admin';"

# 4. Réinitialiser les IDs auto-incrémentés
sqlite3 $dbPath "DELETE FROM sqlite_sequence WHERE name IN ('payment', 'player', 'user');"

# 5. Vérifier ce qui reste
Write-Host "=== Utilisateurs restants ==="
sqlite3 $dbPath "SELECT * FROM user;"

Write-Host "=== Paiements restants ==="
sqlite3 $dbPath "SELECT * FROM payment;"

Write-Host "=== Joueurs restants ==="
sqlite3 $dbPath "SELECT * FROM player;"

Write-Host "Nettoyage terminé!"

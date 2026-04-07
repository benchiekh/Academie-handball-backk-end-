const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Chemin vers la base de données
const dbPath = path.join(__dirname, '..', 'academie.db');

console.log('Nettoyage de la base de données...');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erreur de connexion:', err.message);
    return;
  }
  
  console.log('Connecté à la base de données SQLite');
  
  // Désactiver les contraintes de clés étrangères temporairement
  db.run('PRAGMA foreign_keys = OFF');
  
  // 1. Supprimer tous les paiements
  db.run('DELETE FROM payment', (err) => {
    if (err) {
      console.error('Erreur suppression paiements:', err.message);
    } else {
      console.log('✓ Tous les paiements supprimés');
    }
    
    // 2. Supprimer tous les joueurs
    db.run('DELETE FROM player', (err) => {
      if (err) {
        console.error('Erreur suppression joueurs:', err.message);
      } else {
        console.log('✓ Tous les joueurs supprimés');
      }
      
      // 3. Supprimer tous les utilisateurs sauf les admins
      db.run("DELETE FROM user WHERE role != 'admin'", (err) => {
        if (err) {
          console.error('Erreur suppression utilisateurs:', err.message);
        } else {
          console.log('✓ Utilisateurs non-admin supprimés');
        }
        
        // 4. Réactiver les contraintes de clés étrangères
        db.run('PRAGMA foreign_keys = ON');
        
        // 5. Vérifier ce qui reste
        db.all('SELECT * FROM user', (err, rows) => {
          if (err) {
            console.error('Erreur vérification utilisateurs:', err.message);
          } else {
            console.log('\n=== Utilisateurs restants ===');
            console.log(rows);
            
            db.all('SELECT COUNT(*) as count FROM payment', (err, rows) => {
              if (!err) {
                console.log('\n=== Paiements restants ===');
                console.log(`Nombre: ${rows[0].count}`);
              }
              
              db.all('SELECT COUNT(*) as count FROM player', (err, rows) => {
                if (!err) {
                  console.log('\n=== Joueurs restants ===');
                  console.log(`Nombre: ${rows[0].count}`);
                }
                
                console.log('\n✅ Nettoyage terminé avec succès!');
                db.close((err) => {
                  if (err) {
                    console.error('Erreur fermeture DB:', err.message);
                  } else {
                    console.log('Base de données fermée');
                  }
                });
              });
            });
          }
        });
      });
    });
  });
});

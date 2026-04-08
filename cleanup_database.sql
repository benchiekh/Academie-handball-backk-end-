-- Script de nettoyage de la base de données
-- Supprime toutes les données sauf le compte administrateur

-- 1. Supprimer tous les paiements
DELETE FROM payment;

-- 2. Supprimer tous les joueurs
DELETE FROM player;

-- 3. Supprimer tous les utilisateurs sauf l'admin
-- (Garde seulement les utilisateurs avec role 'admin')
DELETE FROM user WHERE role != 'admin';

-- 4. Réinitialiser les IDs auto-incrémentés
DELETE FROM sqlite_sequence WHERE name IN ('payment', 'player', 'user');

-- 5. Vérifier ce qui reste
SELECT * FROM user WHERE role = 'admin';

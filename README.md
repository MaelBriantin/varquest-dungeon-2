\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\CONFIGURATION////////////////////////////////////////////////////
Une copie de la base est présente dans le dossier. Par défaut, la DB s'appelle 'varquest_dungeon' 

Une fois la base installée, modidier les données de connexions à la base de données dans le fichier back/controllers/Controller.php 
Il y a 4 constantes de connexion

const SERVER_NAME = 'adresse du serveur local';
const DB_NAME = 'nom de la base de données';
const USERNAME = 'nom de l'utilisateur MySQL;
const PASSWORD = 'mot de passe associé';


Lancer la commande php -S localhost:8080 /back/router/api.php depuis la racine du dossier

Ouvrir le fichier /front/index.html avec un navigateur Web


Si un autre port et/ou une autre IP que localhost:8080 sont utilisés pour faire tourner le back, 
changer la valeur de la constante ip dans le fichier /front/js/config.js

\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\NOTES//////////////////////////////////////////////////////

Le jeu est encore en cours de développement coté front. Il manque l'intégration du système de combat,
la génération de l'évènement 'Rencontre' et quelques bugs au niveau de la gestion de l'inventaire / equipement.
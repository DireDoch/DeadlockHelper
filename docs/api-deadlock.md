But : Source principale pour les matchs en temps réel, statistiques de héros et "scouting" de joueurs. 



Base URL : https://deadlock-api.com/v1 


Auth : Aucune (API communautaire ouverte). 

Endpoints prioritaires :


GET /matches/{match_id} : Détails d'une partie. 



GET /players/{steam_id}/history : Historique des matchs d'un joueur. 



GET /heroes : Stats globales (Winrate/Pickrate). 



Traitement Python : Le script doit calculer les "Behavior Tags" (ex: Smurf, Lane Bully) à partir des données brutes de l'historique.
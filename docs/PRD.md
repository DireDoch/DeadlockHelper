1. Vision et Objectifs
L'objectif est de concevoir une application "Compagnon" de bureau pour le jeu Deadlock de Valve. En l'absence d'une API officielle, l'application exploite l'API Communautaire Deadlock pour offrir un avantage tactique légitime, une base de connaissances exhaustive et une gestion multimédia intégrée.



Utilisateur cible : Anthony Boily, étudiant en Techniques de l'informatique au Cégep de La Pocatière.




Environnement cible : Windows 11 Education (Machine de développement : ASUS).


2. Stack Technique et Design
2.1 Technologies

Frontend/Main : Electron + Vite + TypeScript.




Moteur de Données : Python 3.12 (via Child Process Node.js) pour le traitement lourd (Data Crunching) et le nettoyage JSON.




Style : Tailwind CSS (sans bibliothèques tierces comme ShadCN).



Stockage local : Fichiers JSON structurés (electron-store).


2.2 Charte Graphique (Tailwind Custom)
L'interface doit utiliser exclusivement la palette suivante définie dans tailwind.config.ts :

Charcoal : #121212 (100) à #dedede (900). Fond principal : charcoal-100.

Frosted Mint : #edf7d2 (Default). Utilisé pour les accents et textes importants.

Cream : #edf7b5 (Default).

Dry Sage : #c9c19f (Default).

Grey : #7d7c7a (Default).

3. Architecture "Double Moteur"

Renderer (UI) : Gère l'affichage et les interactions utilisateur.





Main (Orchestrateur) : Gère le système, l'authentification Steam (OpenID) et lance les scripts Python.






Python Engine : Récupère les données brutes des API, calcule les tags et retourne un JSON propre via stdout au processus Main.



4. Spécifications des Fonctionnalités
4.1 Page : Statistique Heroes (Hero Section)

Hero Stats : Affichage des statistiques compétitives par patch (Tier S à F) basées sur le Winrate et le Pick Rate.

Tier List Interactive :

Filtrage par rang (Slider UI allant de Initiate I à Eternus 6).

Groupes prédéfinis : Top Elo (E4+), High Elo, No High Elo.

Bouton "Apply" pour confirmer les filtres complexes.

Hero Library :

Barre de recherche dynamique par nom.


Ability Description : Détails des capacités avec affichage de la carte "en jeu" (via API) au survol (on:hover).


Meta Items & Builds : Liste des items avec le plus haut "Win boost" (impact sur la victoire) et section "Best Value" (Win boost par âme dépensée).


Ability Order : Guide d'amélioration des 4 capacités par niveau.

4.2 Page : Game Overlay (Dashboard Tactique)
Activation automatique dès la détection d'un match (via chemin .exe configuré).




12 Player Cards : Disposition par "lane" (adversaires face à face).




Détails par carte : Username, Rang (icône), Winrate, nombre total de matchs, KDA, et icône du personnage.


Behavior Tags : Générés par le moteur Python (ex: Smurf, Lane Bully, Early Monster, On Main, Winstreak VS Lose Streak, Bad Laning, On First Time).



Items Match (Recommandeur) : Analyse de la composition adverse pour suggérer des contres (ex: items Anti-Heal si forte régénération adverse).

4.3 Page : Leaderboards & Ranks
Leaderboards : Copie du classement en jeu mis à jour quotidiennement. Onglets "Overall" et "Hero Leaderboards" (par personnage) avec filtres par région.

Rank Distribution :

Graphique (Axes X: Rangs individuels, Y: Nombre de matchs).

Filtres de période : 24h, 7 jours, 30 jours, All.

Section Ranks & Subranks : Détails du volume de matchs par sous-rang (ex: Initiate II - 0.63%).

4.4 Fonctionnalités Transverses

Spotify Wrapper : Widget intégré pour contrôler la lecture (Play/Pause/Next) et afficher le titre actuel sans Alt-Tab (Nécessite compte Premium).



Authentification Steam : Récupération du Steam ID public via OpenID pour lier automatiquement le profil Deadlock.




Paramètres : Choix de la langue (FR/EN), thème (Clair/Sombre), et gestion des chemins d'accès système.


5. Contraintes et Risques
Performance : L'empreinte mémoire doit rester minimale. Le traitement lourd est déchargé sur Python pour ne pas bloquer l'interface Electron.


Sécurité (Anti-Cheat) : L'application est strictement passive. Aucune injection de code ou lecture directe de la mémoire vive n'est autorisée.


Dépendance API : Gestion des erreurs via blocs try/except en Python avec affichage de notifications (Toasts) et mise en cache des dernières données connues si l'API est hors ligne.
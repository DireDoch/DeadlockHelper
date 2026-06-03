But : L’étudiant doit présenter, par écrit, son projet d’ESP final. 

 

 

Voici les éléments du rapport écrit final : 

 

1. Identification du projet (courte phrase): prendre contexte du premier travail.

2. Description sommaire du projet (un paragraphe): prendre contexte du premier travail.

3. Identification des domaines de l’informatique concernés (Réseaux, Web, Jeux, …) prendre le contexte du dernier travail et des noms de court de ceux-ci ex; 420-..._

4. Réalisation du projet: application de bureau qui est téléchargeable aupres de https://diredoch.github.io/DeadlockHelper/ , (.AppImage + .exe). Implimenter le musique player de Spotify pour fair des manipulation sur la musique (play, resume, skip, backward), implimenter la syncronisation du compte Steam de l'utilisateur pour prendre ces données et pour prendre les données de la Deadlock API pour afficher son profil, etc.

5. Comment le projet a été réalisé: le projet à été réaliser avec le Kaban shart de Microsoft Planner ou j'ai plannifier mes tâche et fonctionnalité que je devais avoir dans mon projet selon la communauté et des projets déja existant. J'ai réaliser le tout dans deux IDE différents, sur Windows j'utilisait cursor (qui est VScode wrapper autour d'un application Electron pour des feature moderne d'AI générative) et j,ai uitliser "Code - OSS" sur Linux pour le restant du développement qui est une version open source de VScode. De plus j'ai expérimenter avec NeoVIM comme IDE (secondaire). Par la suite j'ai commencer avec les étapes les plus difficiles pour mon projet pour prouver rapidement que les dépendances et technologies utiliser était fonctionnel pour les idées que j'avait pour l'application.

5. Étapes de réalisation: 1. plannifier les tache individuel 2. lire la documentation et s'assurer (le plus possible de voir les probleme que le stack technoligique pourrais fonctionner) 3. Séparer les tache dans Microsoft planner en terme de complexité (user stories ish) et séparer en tags ce qui est important de mettre dans le MVP (minimum viable product) pour la demo final du premier cours d'ESP et ce qui peux etre laisser pour plus tard. 4. Ensuite, j'ai pris 1-2 semaine pour planifier en dehors des cours pour avoir un tableau qui mets tout les idées que j'avais en tête pour ce qui est de l'application compagnon dans un "Excalidraw" (https://excalidraw.com/) cela dans mon vault Obsidian , cette étape était crucial pour moi pour ce qui est de visualiser mon projet à long terme et comment le tout vas ressembler à la fin, gérer mes idées, etc. 5. Par la suite j'ai fait un plan pour un PRD (product requirement document) pour savoir tout ce que j'avait avoir apsolument avoir besoin de source extérieur (clé API, Setup, documentation, etc.). 6. J'ai commencer l'application en fesant l'aspect visuel en premier: la charte de couleurs bien définit dans un .css, l'arboresence de mes fichiers dans mon projet soit bien structurer, que ma navigation dans mon application fonctionne et mettre une "en cours de développement dans chacune des page que j'avait au départ. 7. Par la suite je me suis impliquer dans la partie la plus important au départ qui était la mise en place de l'authentification du user pour spotify et Steam et de capable d'avoir une facon de monitorer l'API de deadlock avec un boutton heartbeat ("est-ce que L'API peux me répondre en ce moment?"). par la suite il fallais que je puisse prendre des partie qui sont active. (veuiller complété avec Claude pour voir mon historique de "git log").

6. Technologies choisies: demander le contexte à Claude""

7. Nombre d’heures consacrées: beaucoup, j'ai estimer de base dans mon document avant de commencer le projet à quoi cela vas ressembler (estimer) à 150heures et que je pense avoir faire un peu plus que cela (175heures).

8. Ressources utilisées (matérielles, logicielles, $, …) : ClaudeCode Subscription: 30$/mois pour le dernier mois de développement, spotify premium (12$ par moi pendant 5mois : 60$ en tout). Seulement le compte spotify était inclus dans les ressource $ stipuler au départ, claude Code est personnel et pour mon éducation.

9. Sources d’information:
Fondations et Environnement de Développement 

- Electron.js ([Documentation](https://www.electronjs.org/)) : Framework de référence pour créer des applications de bureau avec des technologies web. 
    

- Version d’Electron.js (40.0.0) ([Documentation](https://www.electronjs.org/fr/docs/latest/tutorial/electron-timelines)) : pour le choix de version que j’ai choisie. 
    

- Python 3.12 ([Documentation](https://docs.python.org/3.12/)) : Langage utilisé pour son efficacité dans le traitement des données massives (data crunching). 
    

- Next.js ([Documentation](https://nextjs.org/docs)) : Consulté pour les meilleures pratiques en matière de routage et de performance d'interface utilisateur. 
    

- Python Versioning ([Téléchargements](https://www.python.org/downloads/)) : Suivi des versions stables pour assurer la compatibilité entre les environnements Linux (Omarchy) et Windows. 
    

Données de jeu et APIs 

- Deadlock API ([Documentation Scalar](https://assets.deadlock-api.com/scalar) et [Site](https://deadlock-api.com/)) : Ma source principale de données pour l'historique des matchs, les statistiques des héros et le "scouting" des joueurs. 
    

- Monitoring de l'API ([UptimeRobot](https://dashboard.uptimerobot.com/monitors/802150090)) : Outil indispensable pour vérifier la disponibilité en temps réel de l'API communautaire et anticiper les interruptions de service. 
    

- Steam Web API ([Dev Portal](https://steamcommunity.com/dev)) : Utilisée pour valider l'identité des utilisateurs et vérifier l'installation locale du jeu. 
    

- Spotify API ([Documentation](https://developer.spotify.com/documentation/web-api)) : Guide technique pour l'intégration du lecteur multimédia directement dans l'interface. 
    

Design, UX et Inspiration 

- Design System ([Tailwind CSS](https://tailwindcss.com/) et [ShadCN UI](https://ui.shadcn.com/)) : Ressources critiques pour construire une interface moderne, performante et stylisée. 
    

- Benchmarks UX ([Porofessor.gg](https://porofessor.gg/fr/) et [U.gg](https://u.gg/)) : Ces sites leaders sur League of Legends servent de modèles pour l'organisation visuelle des statistiques et la création de "tags" visuels clairs.

*Game overlay doc:*
https://github.com/wmww/gtk-layer-shell
https://www.electronjs.org/blog/electron-41-0
https://docs.kde.org/stable_kf6/en/kwin/kcontrol/windowspecific/index.html

---
*Environnement Linux doc utiliser*:
https://userbase.kde.org/KWin_Rules_Window_Attributes
https://discourse.ardour.org/t/kwin-window-rules-fullscreen/104584
https://www.pcgamer.com/games/moba/valve-developer-has-to-keep-reminding-players-that-deadlock-s-anti-cheat-system-is-coming-and-very-high-priority-since-it-s-leaning-mostly-on-player-reports-right-now/
https://www.gamingonlinux.com/2024/09/deadlock-from-valve-has-an-amusing-new-anti-cheat-system-turning-cheaters-into-frogs/
https://github.com/flightlessmango/MangoHud
https://discuss.kde.org/t/invisible-window-when-activating-fullscreen-on-games-under-wayland/3122

---

 *python*:
Lien pour PEP 257 : https://peps.python.org/pep-0257/

GEMINI: veuiller regarder dans les autres documents données pour plus de liens à mettre dans ceux-ci, ajouter une courte descriptions de chaque lien de documentation et pourquoi cela à été utiliser pour le projet:

10. Difficultés rencontrées et solutions: j'ai rencontré une multitude de probleme, voici une liste et veuiller décrire les observations qui on été fait pour remédier à la situation:

- Veuiller demander à claude de faire une liste à partir de ces fichiers sur les probleme principal rencontrer (claude vas avoir le contexte avec les paths indiquer): 
- /home/anthonyb/Documents/ESP/Projet/DeadlockHelper/docs/adr/ (tout les fichier dans celui-ci).
- /home/anthonyb/Documents/ESP/Projet/DeadlockHelper/docs/ESP_FINAL/ tout les fichier dans celui-ci).
- fetch les bon items demander, hero, etc. parce que certain élément de l'API communotaire on des images, données qui sont deprecrated et qui ne sont plus dans le jeux (ex: images, heroes, statistique), donc il à fallu trouver les vrais données actuels (trimming).
- npm build problemes: en fesant le CI vers un actions github qui compile l'application en executable ou .AppImage, il y avait des erreur de build qui ne fonctionnais pas à cause de "Content Secure Policy" qui doit être implimenter sinon le build ne peux pas se faire (l'application est vue comme dangereux), donc est restreint au niveau du build. De plus le build ne voulais pas prendre le .env pour mes clés d'API donc le build ne voulais pas foncitonner pour les fonctionnalité de Steam et Spotify.
- Cela fesais partie de mes risque mais l'API est encore en plein développement donc il fallait que je "keep up" avec les nuveaux changements, endpoints qui changeait de nommenclature ou de donner qu'on recoit et à certain endroit je devais changer de place ou je mettais du dévleloppement, parce que l'API était DOWN à certaine place de celui-ci. De plus, certain endpoints sont restreint ou courrament changer ce qui fait mon prochain probleme que j'ai rencontrer:
    - Le LiveDashboard ne fonctionne pas comme entended, parce que le endpoint pour les partie active prenneais seulement les données de la personne en temps réelle et ne prend pas les données de tout les joueurs donc il a été restreint encore à ce jours. La solution serais un contournement pour aller prendre les données seulmenet à la fin des partie pour le LiveDashboard, de plus la gestion de tags qui est supposé être fait lorqu'une partie en prennat l'historique de l'historique des joueurs pour leurs associer des tags logique sur comment la personne joue à été remplcer (pour une fonctionnalité simillaire) pour des "Awards" dans la page de profil pour que j'aille un morceau de calculer quelque chose avec une partie fini (par exemple dans cette partie la personne à fait un total de 1.6k souls par minute donc je lui donne un badge disant qu'il a réussit à avoir cette "exploit durant cette partie").
    - J,ai essayer de faire un contournement pour avoir des données dans le fichier de log de deadlock en partie active, mais cela ne donne aussi pas les données (comme les noms des joueurs comme je l'avais espérer).
    - j,ai essayer de contourner encore une fois en prenant un screenshot avec ocr python (/ocr_worker dans mon projet), pour avoir une capture d'écran des noms Steam des gens dans la partie et leurs personnage qui joue, lorsue la personne pese sur ESC et le OCR détect celui-ci, cela prend une image convertie en texte pour la section de droite du jeux pour voler ces données. Malgrer un succès de 12/12 données pris (les noms et personnage des 12 personne dans une partie), l'api de steam et autre ne permet par d'aller voir les données demandé pour cette foncitonnalité. je vais simplement attendre que l'API de Deadlock puisse remettre cette fonctionnalité dans le future pour la réimplimenter. Il reste corrigeable dans une partie en MODE MOCK dans les parametre de mon application pour voir les données d'uine partie déja jouer...

11. Limites de la réalisation, et pourquoi 
- Veuiller demander à claude de faire une liste à partir de ces fichiers sur les probleme principal rencontrer (claude vas avoir le contexte avec les paths indiquer): 
- /home/anthonyb/Documents/ESP/Projet/DeadlockHelper/docs/adr/ (tout les fichier dans celui-ci).
- /home/anthonyb/Documents/ESP/Projet/DeadlockHelper/docs/ESP_FINAL/ tout les fichier dans celui-ci).
et Veuiller mentionner le probleme avec le fetch d'une partie active poour que le LiveDashboard soit fonctionnel.

12. Compétences du BTS/DEC réinvesties. rendre contexte des autres travails .docx pour répondre une liste déja mis dans un autre document.

13. Bilan des apprentissages réalisés. Expliquer les chose que j'ai appris (au niveau de la charge d'un projet et comment l'ordchestrer ET au niveau technique ce que j'ai appris).

 

L’étudiant(e) est fortement invité(e) à appuyer ses descriptions par des diagrammes, images, croquis pertinents. 

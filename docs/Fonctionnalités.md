Voici les ajouts et modification que je veux faire pour celui-ci:

Il vas y avoir des pages supplémentaire : Statistique hero, Statistique Items et game overlay. Voici la description des pages et leurs fonctionnalité. Certaine pages on des sous page déroulante qui vas être situer dans le side-bar de l'application (exemple Hero Stats, Tier List, ect).

Page: statistique heroes: le but est de récolter les données qui sont présent pour les personnage, voici les sous-page qui vas être présent:


Hero section - Hero Stats :

Cela vas être une page ou que l'utilisateurs vas pouvoir voir des statistique sur les heros qui sont présent dans le jeux, le but est de données de information "compétitive". Par exemple: leurs "rang tier" selon le patch, par exemple: "- Tier (S, A, B, C, D, E, F)" selon leurs pick rate, etc.



- Leurs pike rate 

- leurs WinRate



Hero section - Tier List:

Chaque personnage pourrais être moduler par les "Tier":

[S, A, B, C, D, E]



C'est selon le Winrate et le pick rate + communauter 

funcitonnalité de la page : la tier list peux changer avec les filtres déjà existant pour les autres pages, par exemple:

- Filtre par rank, all rank, by group. Le but étant de montrer que pour les gens qui sont dans un élo spécifique ce qui est vraiment fort ou trop "compliquer a jouer" selon la communoter et les statistique pris de l'API.

--> Exemple: une personnage peux être super fort en partie compétitive de haut niveau, mais être très difficile et avec pas beaucoup de "winrate" en bas elo.



---



voici certain filltre qui vont être utiliser par les utilisateurs pour afficher les informations qui veulent voir (peut avoir plusieurs filtre et plusieurs type de filtre l'un par dessus l'autre):

Filtre:

- Filter by rank:

[All Ranks, By Group, By Tier]



All Ranks:

    - "Everything"



By Group: 

    - Top Elo Matches (E4+)

    - High Elo Matches

    - No High Elo (Acsendent 5 or less)



By Tier:

By tier est un composant "Slider" au niveau du UI qui permet de filtrer entre deux rang que l'utilisateurs vas pouvoir indiquer avec un slider component (les rang vont de "Initiate I" à "Etnerus 6" et l'utilisateurs peut savoir les statistique entre deux rang précis et savoir les statistique selon ces deux rang.

Fonctionnalité:
- Pour confirmer certain filtre qui n'ai pas qu'un simple boutton a activer, un boutton "Apply" pour confirmer le filtre ajouter sera necessaire.


---


Hero Section - Hero Librairie

Fonctionnalité:

- Une bar de recherche qui permet de rechercher tout les personnage de Deadlock (list):
	- l'utilisateurs peut rechercher en tapant le nom du personnage et la bar de recherche vas seulement afficher les personnage rechercher (en terme de lettre rechercher).


Section : ability descriptionh
- Ability description : En sélectionnant un personnage, l'utilisateurs vas pouvoir voir les abiliteté du personnage et "on:hover" des abilité, il vas pouvoir la carte "en jeux" (pris de l'api) des détaille d'une habileté.


Section : Meta Items
- Meta items / build that are relevent / build conseiller: selon le "Win boost", highest impact on win chance (selon les items qui son build sur le personnage qui augmente le taux de winrate" une liste d'item vas pouvoir être indiquer (par exemple: "Healing Tempo" : +3.6%).

- Best value: "Win boost" per soul spent, serais une section qui liste aussi certaine items qui sont simplement bon pour le Win boost selon leurs cout d'objet.

Section: Ability order
- Donne (avec les 4 habileté que le personnage à) ce qu'il faut améliorer par niveau reçu.



Page: Game overlay section:


- C'est une page qui prend les données des joueurs qui sont présent dans la partie pour montrer leurs information qui son publique, le but étant de montrer des données qui sont stratégique et légitime pour le joueurs a regarder durant une partie.

Fonctionnalité:
- 12 "cards d'un joueur": dans cette page nous voyons toutes les joueurs qui sont dans la partie en format de "cards" (éléments de UI) pour montrer des détails sur c'est gens, voici certaine information qu'il va falloir inclure:
	- Leurs "username" (en haut des cards).
	- Leurs rang en jeux (exemple: initiate I ou Inititate 3 ou eternus 4), avec l'icone du rang qui va avec celui-ci.
	- Leurs winrate accompagner du nombre de match qu'ils ont jouer sur le jeux en tout
	- Montrer un icone s'il joue a plusieurs personne (tag: duo, trio ++)
	- L'icone de leur personnage en jeux
	- Leurs KDA (ex: 2.2) selon leurs partie enregistrer
	- tout les joueurs ont des tags relier a ceux-ci, par exemple voici une liste:
		- Smurf, lane bully, early monster, late monster, damage dealer, winstreak, On main etc. (more to come)
		- lose streak, bad laning, dies to gank, fall off, On first time, etc. (more to come).
	- les cards vont être sélectionner selon quelle "lane" qu'il sont, donc ceux qui sont contre dans une même lane vont par exemple etre en face au niveau du UI.

- Onglet: Items Match: Sa serais une sélectionner d'item qui serais recommander (selon la partie, les personages dans l'équipe et les personnages adverse), je vais expliquer plus en détail la logique dès que nous allons être rendue a cette étape, par exemple: ils y a beaucoup de personne qui on le "pouvoir" de régénérer des points de vie, il serais conseiller d'acheter des items "anti-heal", et c'est items serais afficher.

---

Page: Leaderbords:

This leaderboard showcases the top players based on Deadlocks in-game ranking system. This leaderboard mirrors the in-game leaderboard and is updated daily.

Onglet - overall:

Onglet - Hero Leaderboards:
- Même fonctionnalités que le "Onglet - overall", mais c'est selon le classement des Hero (personnage), il suffit de faire un filtre sur les personnage les plus jouer, selon le rang (Ex: Eternus VI) et faire un classement selon un tableau de tout les personnage (liste).
- Il y a donc les filtre par region et "search players".



---

Pages: Rank Distribution

Onglet - Rank Distribution
Il vas y avoir seulement deux zone qui sont présent dans cette unique page, il montre: Deadlock Match Rank Distribution
This chart shows how many matches were played at each Deadlock badge level for the selected period in a graph way.

x: the rank listed from left to right with the same color pallette (it needs to be for each individual rank (exemple: Initiate I, Initiate II, Initiate III, Initiate IV, Initiate V) are all individual lines.
y: Matches (from the period property)

--> Filtre de periode :  24hours, 7 days, 30 days, all

Onglet - Ranks and Subranks
--> explora all ranks, their subranks, and match distribution

Ex: "Logo of the Initiate" - Matches: 6.196 (2.76%)
 Initiate II - 1,416 matches (0.63%).

```

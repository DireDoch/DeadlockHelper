# Workflow Git - DeadlockHelper

## Structure des branches

### Branches principales

- **`main`** : Branche de production
  - Contient uniquement du code stable et des versions majeures fonctionnelles
  - Ne doit jamais être modifiée directement
  - Protégée contre les push directs

- **`develop`** : Branche d'intégration principale
  - Utilisée pour le développement quotidien
  - Point d'intégration pour toutes les fonctionnalités
  - Fusion des branches `feature/` et `bugfix/`

### Branches temporaires

- **`feature/nom-de-la-feature`** : Branches de fonctionnalités
  - Créées à partir de `develop`
  - Une branche par nouvelle fonctionnalité
  - Exemples :
    - `feature/refonte-sidebar-navigation`
    - `feature/integration-api-deadlock`
    - `feature/calcul-behavior-tags`

- **`bugfix/description`** : Branches de corrections
  - Créées à partir de `develop` ou `main` (selon la criticité)
  - Pour corriger des bugs spécifiques
  - Exemples :
    - `bugfix/correction-chemin-python`
    - `bugfix/fix-memory-leak-sidebar`

## Cycle de travail

### 1. Démarrage d'une nouvelle tâche

```bash
# S'assurer d'être sur develop et à jour
git checkout develop
git pull origin develop

# Créer une nouvelle branche feature
git checkout -b feature/nom-de-la-feature

# Ou pour un bugfix
git checkout -b bugfix/description-du-bug
```

### 2. Développement

- Faire des commits réguliers avec des messages clairs
- Une fonctionnalité/correction par commit
- Messages en français

### 3. Finalisation d'une feature

```bash
# S'assurer que tout est commité
git status

# Retourner sur develop
git checkout develop

# Mettre à jour develop
git pull origin develop

# Fusionner la feature
git merge feature/nom-de-la-feature

# Pousser develop
git push origin develop

# Supprimer la branche feature (locale)
git branch -d feature/nom-de-la-feature
```

### 4. Passage vers main (Production)

- Ne se fait que lorsque plusieurs fonctionnalités majeures forment un **jalon stable** du PMV
- Processus de release :
  1. Tester toutes les fonctionnalités sur `develop`
  2. Créer une branche `release/vX.X.X` si nécessaire
  3. Fusionner dans `main` uniquement après validation complète
  4. Taguer la version : `git tag -a v1.0.0 -m "Version 1.0.0"`

## Conventions de commit

### Format des messages

Chaque commit doit couvrir **une seule fonctionnalité ou correction précise**.

**Format recommandé :**
```
type: description courte en français

Description détaillée (optionnelle)
```

### Types de commits

- **`feat:`** - Nouvelle fonctionnalité
  - Exemple : `feat: ajout du moteur de traitement des tags Python`
  - Exemple : `feat: implémentation de la navigation hiérarchique dans le Sidebar`

- **`fix:`** - Correction de bug
  - Exemple : `fix: correction du chemin vers le script Python dans main.ts`
  - Exemple : `fix: résolution du problème d'affichage des images`

- **`refactor:`** - Refactorisation de code
  - Exemple : `refactor: uniformisation des couleurs dans toutes les pages`

- **`docs:`** - Documentation
  - Exemple : `docs: ajout de la documentation API Deadlock`

- **`style:`** - Formatage, style (pas de changement de logique)
  - Exemple : `style: correction des indentations dans Sidebar.ts`

- **`test:`** - Ajout ou modification de tests
  - Exemple : `test: ajout de tests unitaires pour data_processor.py`

- **`chore:`** - Tâches de maintenance
  - Exemple : `chore: mise à jour des dépendances npm`

### Exemples de messages de commit

✅ **Bons exemples :**
```
feat: ajout de la communication Main ↔ Python via IPC
fix: correction de l'animation fadeOutUp pour les sous-menus
refactor: refonte complète du Sidebar avec navigation hiérarchique
docs: création du fichier GIT_WORKFLOW.md
```

❌ **Mauvais exemples :**
```
update
fix bug
changes
WIP
```

## Règles d'or

### ⚠️ Interdictions strictes

1. **NE JAMAIS faire de push direct sur `main`**
   - `main` est protégée et ne doit contenir que du code stable
   - Tous les changements passent par `develop` puis `feature/` ou `bugfix/`

2. **NE JAMAIS travailler directement sur `main` ou `develop`**
   - Toujours créer une branche `feature/` ou `bugfix/` pour le travail

3. **NE JAMAIS fusionner `main` dans `develop`**
   - Le flux va toujours de `develop` vers `main`, jamais l'inverse

### ✅ Bonnes pratiques

1. **Vérifier la branche avant chaque commit**
   ```bash
   git branch --show-current
   ```

2. **Faire des commits fréquents et atomiques**
   - Un commit = une fonctionnalité/correction précise
   - Ne pas accumuler trop de changements dans un seul commit

3. **Tester avant de fusionner**
   - Tester localement avant de merger dans `develop`
   - S'assurer que le code compile et fonctionne

4. **Respecter les conventions de nommage**
   - Branches : `feature/nom-descriptif` ou `bugfix/description-courte`
   - Messages : en français, clairs et descriptifs

## Workflow visuel

```
main (production)
  ↑
  | (release)
  |
develop (intégration)
  ↑
  | (merge)
  |
feature/nom-de-la-feature (développement)
```

## Commandes utiles

### Vérifier la branche actuelle
```bash
git branch --show-current
```

### Voir toutes les branches
```bash
git branch -a
```

### Créer et basculer sur une nouvelle branche
```bash
git checkout -b feature/nom-de-la-feature
```

### Voir l'état des modifications
```bash
git status
```

### Voir l'historique des commits
```bash
git log --oneline --graph --all
```

## Checklist avant un merge dans develop

- [ ] Tous les fichiers sont commités
- [ ] Le code compile sans erreurs
- [ ] Les tests passent (si applicable)
- [ ] La branche est à jour avec `develop`
- [ ] Les messages de commit sont clairs et en français
- [ ] Le code respecte les conventions du projet

## En cas de conflit

1. Mettre à jour `develop` : `git checkout develop && git pull`
2. Retourner sur la feature : `git checkout feature/nom-de-la-feature`
3. Fusionner `develop` dans la feature : `git merge develop`
4. Résoudre les conflits manuellement
5. Commit : `git commit -m "fix: résolution des conflits avec develop"`
6. Continuer le développement normalement

# Authentification Steam – Vue d’ensemble

Ce document décrit le flux d’authentification Steam (OpenID) utilisé par l’application, les données manipulées et les points de sécurité.

---

## 1. Flux d’authentification

1. **Déclenchement**  
   L’utilisateur clique sur « Se connecter avec Steam » (Paramètres > Configuration ou sidebar). Le renderer appelle `api.steamStartAuth()` (IPC).

2. **Main process**  
   - Démarre un serveur HTTP **uniquement sur `127.0.0.1:30765`** (port fixe pour que l’URL de retour soit stable).
   - Construit l’URL de login Steam OpenID avec :
     - `openid.return_to` = `http://localhost:30765/callback`
     - `openid.realm` = `http://localhost:30765/`
     - `openid.identity` et `openid.claimed_id` = `http://specs.openid.net/auth/2.0/identifier_select` (Steam exige `claimed_id`).
   - Ouvre cette URL dans le **navigateur système** (`shell.openExternal`), pas dans une fenêtre Electron (évite les problèmes de protocole et de parsing).

3. **Callback**  
   Après connexion, Steam redirige le navigateur vers `http://localhost:30765/callback` en **GET** ou **POST** avec des paramètres OpenID.

4. **Traitement du callback**  
   - **Erreur Steam** : si `openid.mode=error` et `openid.error` sont présents → l’app renvoie `{ success: false, error: "Steam: …" }`.
   - **Succès** : extraction de `openid.claimed_id` (ou `openid.identity`) → URL du type `https://steamcommunity.com/openid/id/76561198002516729`.
   - Le **SteamID64** est extrait par regex (format Steam uniquement). Aucune autre URL n’est acceptée.
   - Le SteamID64 est enregistré dans le store `steam-profile` (electron-store).
   - Un appel à l’API Steam **GetPlayerSummaries** (avec la clé API) récupère l’avatar et le pseudo ; ils sont aussi stockés dans le store.
   - La page « Connexion réussie » est renvoyée au navigateur, le serveur local est fermé et la Promise est résolue avec `{ success: true, steamId64 }`.

5. **Affichage**  
   Le composant `UserProfile` (sidebar) appelle `api.steamGetProfile()` qui lit le store et affiche avatar, pseudo et statut.

6. **Déconnexion (bouton « Se déconnecter »)**  
   - L’utilisateur clique sur « Se déconnecter » (Paramètres > Configuration, à droite de la carte Compte Steam, ou depuis tout endroit qui appelle `api.steamLogout()`).
   - Le renderer envoie une requête IPC `steam:logout` (sans paramètre).
   - **Main (steam-logic.ts)** : le handler `steam:logout` est le seul endroit qui effectue la déconnexion :
     1. Il remplace le contenu du store par `{ steamId64: null }` (assignation directe à `steamStore.store` pour éviter les erreurs electron-store sur `set(undefined)`).
     2. Il envoie l’événement **`steam:profile-updated`** au renderer (même événement qu’après un login réussi).
   - **Renderer** : l’app est abonnée à `steam:profile-updated` (dans `app.ts`). À la réception, elle appelle `UserProfile.refresh()` et, si la page courante est Configuration, `configurationPage.refresh()`. Ainsi, la sidebar et la page Configuration se mettent à jour sans que le code du bouton n’ait à gérer `this.steamProfile`, `this.render()` ou `UserProfile.refresh()`.
   - **Résumé** : la logique de déconnexion est centralisée dans le main (store + notification). L’UI se rafraîchit via le même canal que pour le login, ce qui simplifie les évolutions futures.

---

## 2. Données et rôles des fichiers

| Élément | Rôle |
|--------|------|
| **steam-logic.ts** | Serveur HTTP callback, construction URL OpenID, extraction SteamID64, appel GetPlayerSummaries, lecture/écriture du store, handlers IPC. |
| **Store `steam-profile`** | Stocke `steamId64`, `avatarUrl`, `personaname` (données non sensibles, stockage local electron-store). |
| **Preload** | Expose uniquement `steamStartAuth`, `steamGetProfile`, `steamLogout`, `steamCheckInstallation` ; pas d’accès direct au store ni à la clé API. |
| **Renderer** | UserProfile, Configuration : appels IPC uniquement, pas de logique Steam côté front. |

Aucune transformation d’objet superflue : le main renvoie des objets simples (steamId64, avatarUrl, personaname) et le store garde la même forme.

---

## 3. Sécurité et atténuations (phase de développement)

| Risque | Atténuation |
|--------|-------------|
| **Clé API Steam** | Gardée dans `.env` (`STEAM_API_KEY`), chargée via `dotenv` dans le main. Ne jamais la mettre dans le code ni la committer. `.env` est dans `.gitignore`. |
| **Exposition au réseau** | Le serveur callback écoute uniquement sur `127.0.0.1`, pas sur toutes les interfaces. |
| **Validation OpenID** | Seul le format de `claimed_id` est vérifié (URL Steam + regex). En production, on peut ajouter la vérification OpenID complète (renvoyer les paramètres à Steam pour `openid.mode=check_authentication`). |
| **IPC** | Le preload n’expose que des handlers nécessaires ; pas d’accès au store ou à l’environnement. La clé API reste dans le main. |
| **Données stockées** | Le store ne contient que des données publiques (SteamID64, avatar, pseudo). Aucun secret. |

Recommandations pour la suite : ne pas logger la clé API ni les tokens ; utiliser un `.env.example` sans vraie clé pour le dépôt ; en production, envisager la vérification complète de la réponse OpenID côté serveur.

---

## 4. Vérification de l’installation Steam (Windows)

La fonction `checkSteamInstallation()` (exposée via `steamCheckInstallation`) :

- Lit le registre Windows (HKLM puis HKCU) pour le chemin d’installation Steam.
- Si absent, teste le chemin par défaut `C:\Program Files (x86)\Steam\steam.exe`.
- Vérifie que `steam.exe` existe. Retourne `{ installed, path, error? }`. Aucune donnée utilisateur n’est passée aux commandes système (pas de risque d’injection dans ce flux).

---

*Référence code : `src/main/steam-logic.ts`, preload Steam dans `src/preload/preload.ts`, UI dans `src/renderer/componentsUI/UserProfile.ts` et `src/renderer/pages/Parametres/Configuration.ts`.*

# Espace candidat — Hamine Happy

Portail de suivi des dossiers d’études à l’étranger. Le site public [haminehappy.fr](https://haminehappy.fr) reste sur WordPress. Ce portail est une application à part, à relier par un bouton **Espace candidat**.

## Ce que fait la V1

- Connexion par identifiant + mot de passe (pas d’inscription publique)
- Espace candidat : frise d’avancement en lecture seule
- Back-office pour les 2 conseillers : créer un dossier, mettre à jour les étapes, laisser un commentaire visible

Étapes suivies :

1. Orientation académique
2. Choix du programme
3. Préparation du dossier
4. Candidatures & demande admissions
5. Admission (En cours / Obtenue)
6. Visa étudiant
7. Préparation au départ

## Lancer en local

```bash
npm install
npm run seed
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

### Comptes de démo

Conseillers :

- `hamine` / `Hamine2026!`
- `conseiller` / `Conseil2026!`

Candidats :

- `aissata.sawadogo` / `Demo2026!`
- `ibrahim.kabore` / `Demo2026!`
- `fatou.traore` / `Demo2026!`

Changez ces mots de passe avant toute mise en ligne.

## Où sont les données ?

- **En local, sans Supabase** : fichier `data/portail.json` (ignoré par Git). Ça ne convient pas à Vercel.
- **En ligne (Vercel / plus tard Hostinger)** : **Supabase** (PostgreSQL). C’est la vraie base.

Crée un projet gratuit sur [supabase.com](https://supabase.com) → SQL Editor → colle et exécute `supabase/schema.sql`.

Variables à copier (Settings → API) :

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (secret, jamais dans le code public)

## Mettre en ligne sur Vercel (pour commencer)

1. Pousse ce code sur GitHub.
2. Va sur [vercel.com](https://vercel.com) → **Add New** → **Project** → importe le dépôt.
3. Framework : **Next.js** (détecté tout seul).
4. Dans **Environment Variables**, ajoute :
   - `SESSION_SECRET`
   - `ADMIN_PASSWORD`
   - `CONSEILLER_PASSWORD`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. **Deploy**. Tu obtiens une URL du type `https://xxx.vercel.app`.
6. Plus tard, tu pourras pointer `espace.haminehappy.fr` vers Vercel, ou migrer vers Hostinger en gardant **la même** base Supabase.

## Mettre en ligne plus tard (GitHub + Hostinger)

Le site WordPress `haminehappy.fr` reste tel quel. Le portail se publie à part, idéalement sur `espace.haminehappy.fr`. Même base Supabase.

### 1. Envoyer le code sur GitHub

Dans le dossier du portail :

```bash
git init
git add .
git commit -m "Portail candidat Hamine Happy"
```

Sur GitHub : **New repository** → nom `portail-hamine-happy` → **Private**. Puis :

```bash
git remote add origin https://github.com/TON-COMPTE/portail-hamine-happy.git
git branch -M main
git push -u origin main
```

Ne commite pas `.env.local` ni `data/portail.json` (déjà ignorés).

### 2. Créer le sous-domaine chez Hostinger

Dans hPanel : **Domaines** → **Sous-domaines** → créer `espace.haminehappy.fr`.

### 3. Déployer en Node.js (pas en WordPress)

Dans hPanel : **Sites web** → **Ajouter un site** → **Node.js / Web app** → **Importer un dépôt GitHub**.

Connecte GitHub, choisis le dépôt `portail-hamine-happy`, puis :

- Framework : Next.js
- Node.js : 20 ou 22
- Install : `npm ci` (ou `npm install`)
- Build : `npm run build`
- Start : `npm run start -- -p $PORT`
- Domaine : `espace.haminehappy.fr`

Variables d’environnement à ajouter :

- `SESSION_SECRET` = une longue phrase secrète (pas celle du PC)
- `ADMIN_PASSWORD` = mot de passe des 2 comptes conseillers (optionnel)
- `NODE_ENV` = `production`

Puis **Deploy**.

Si tu ne vois pas « Node.js Apps », ton offre actuelle est seulement WordPress. Il faut l’option **Node.js Web Apps** (ou un VPS Hostinger). N’uploade pas ce projet dans le dossier WordPress : ça ne démarrera pas.

### 4. Premier accès

Comptes conseillers : `hamine` et `conseiller`.  
Mot de passe : celui de `ADMIN_PASSWORD`, sinon `Hamine2026!` / `Conseil2026!`. Change-les tout de suite.

### 5. Bouton sur WordPress

Dans le menu du site, ajoute un lien **Espace candidat** vers `https://espace.haminehappy.fr`.

## Bouton sur le site WordPress

Dans le menu ou le header, ajoutez un lien vers l’URL du portail, par exemple `https://espace.haminehappy.fr`.

Exemple de bouton HTML à coller dans une page custom :

```html
<a href="https://espace.haminehappy.fr" class="btn-espace-candidat">
  Espace candidat
</a>
```
............
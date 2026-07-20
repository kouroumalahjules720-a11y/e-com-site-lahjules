# LOYAL FRIENDS STORE — E-commerce statique Next.js 14

Boutique en ligne statique **LOYAL FRIENDS STORE** (Conakry, Guinée) avec commande WhatsApp et dashboard admin local. Devise : **Franc Guinéen (GNF)**. Design premium bleu/orange/vert, responsive, déployable gratuitement sur Netlify ou Cloudflare Pages.

## Fonctionnalités

### Vitrine publique
- Page d'accueil (hero, produits phares, catégories)
- Catalogue avec recherche, filtres et tri
- Fiche produit détaillée avec galerie d'images
- Avis clients (ajout côté client, stocké en localStorage)
- Panier avec localStorage
- Commande via WhatsApp (message pré-rempli)
- Suivi de commande par code (`CMD-XXXXXX`)
- Codes promo (pourcentage ou montant fixe)

### Dashboard Admin (`/admin/login/`)
- Authentification par mot de passe simple
- **Upload logo** (zone cliquable dans la sidebar admin)
- CRUD produits avec upload d'images (base64)
- Gestion des commandes et statuts
- Codes promo (création, activation, expiration)
- Moyens de paiement (Orange Money, MTN MoMo, livraison)
- Générateur de liens Facebook Ads avec UTM
- Export JSON pour sauvegarde / redéploiement

## Palette de couleurs

| Rôle | Couleur | Usage |
|------|---------|-------|
| Primary (bleu) | `#2563EB` | Header, footer, liens, boutons principaux |
| Secondary (orange) | `#F97316` | CTA Commander, badges promo |
| Accent (vert) | `#16A34A` | En stock, prix promo, succès |
| Surface | `#EFF6FF` | Sections alternées |

Le nom **LOYAL FRIENDS STORE** dans le header est en blanc uni (`#FFFFFF`). Les couleurs de marque s'appliquent aux boutons, badges et accents uniquement.

## Stack technique

- **Next.js 14** (App Router) avec `output: 'export'`
- **React 18** + **TypeScript**
- **Tailwind CSS**
- **Données JSON** dans `/public/data/`
- **localStorage** pour persistance côté client (panier, admin, avis, logo)
- Aucune base de données, aucun backend

## Démarrage local

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

### Accès admin
- URL : [http://localhost:3000/admin/login/](http://localhost:3000/admin/login/)
- Mot de passe par défaut : `admin123`
- Modifiable dans `public/data/config.json` → `adminPassword`

## Upload du logo (admin)

1. Connectez-vous à `/admin/login/`
2. Dans la sidebar, cliquez sur la zone **Upload Logo** (ou l'image actuelle)
3. Choisissez une image (carré recommandé, max affiché 120×120 px, coins arrondis 12 px)
4. Le logo est stocké en **base64** dans `config.logoBase64` (localStorage)
5. Il s'affiche immédiatement dans le header public et l'admin
6. Pour le rendre permanent au déploiement : **Exporter JSON** → remplacez `public/data/config.json`

## Ajouter un produit (admin)

1. Allez dans **Produits** → **Ajouter produit**
2. Remplissez :
   - Nom du produit
   - Description longue
   - Prix en GNF (nombre positif)
   - Catégorie
   - Upload image produit (base64)
3. Cliquez **Enregistrer**
4. Le produit apparaît **immédiatement** dans le catalogue (pas besoin de rebuild)
5. Pour le rendre permanent : **Exporter JSON** → remplacez `public/data/products.json`

## Configuration

Éditez `public/data/config.json` :

```json
{
  "storeName": "LOYAL FRIENDS STORE",
  "siteTitle": "LOYAL FRIENDS STORE - Boutique Premium en Ligne",
  "currency": "GNF",
  "currencySymbol": "GNF",
  "whatsappNumber": "224627081650",
  "phone": "+224 627 08 16 50",
  "email": "loyalfriends0718@gmail.com",
  "city": "Conakry, Guinée",
  "logoBase64": "",
  "adminPassword": "admin123"
}
```

Format des prix affichés : `50 000 GNF` (espace tous les 3 chiffres).

## Contact

- Téléphone : +224 627 08 16 50
- Email : loyalfriends0718@gmail.com
- Ville : Conakry, Guinée

## Persistance des données

> **Important** : ce site est 100 % statique. Les modifications admin (logo, produits, etc.) sont sauvegardées dans le **localStorage** du navigateur.

Pour rendre les changements permanents sur le site déployé :

1. Connectez-vous à l'admin
2. Cliquez **Exporter JSON** dans la sidebar
3. Remplacez les fichiers dans `public/data/` par ceux exportés
4. Recommittez et redéployez

## Build & export statique

```bash
npm run build
```

Le dossier `out/` contient le site statique prêt à déployer.

## Déploiement sur Netlify

### Option A — Depuis GitHub

1. Poussez le projet sur GitHub
2. Connectez le repo sur [netlify.com](https://netlify.com)
3. Build command : `npm run build` / Publish directory : `out`

### Option B — Drag & drop

```bash
npm run build
```

Glissez le dossier `out/` sur [app.netlify.com/drop](https://app.netlify.com/drop).

## Déploiement sur Cloudflare Pages

- Build command : `npm run build`
- Build output directory : `out`

## Personnalisation WhatsApp

Format international sans `+` :
- Guinée : `224627081650`

## Codes promo par défaut

| Code        | Type         | Valeur |
|-------------|--------------|--------|
| WELCOME10   | Pourcentage  | 10%    |
| REDUC5000   | Montant fixe | 5 000 GNF |

## Licence

MIT — Libre d'utilisation et de modification.

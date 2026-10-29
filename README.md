# Trame · link-to-qr-code

Plateforme qui transforme un lien en QR code entièrement personnalisable.

- **Studio** : 12 modèles, 7 formes de modules, formes des coins, couleurs et dégradés, fond transparent, logo (icône, initiales ou image importée), cadre avec texte, zone de silence, et un score de lisibilité.
- **Export** : PNG jusqu'à 4 096 px et SVG, directement dans le navigateur.
- **QR statiques** : sans compte. Le lien est inscrit dans le motif.
- **QR dynamiques** (avec un compte) : le QR encode `/r/{code}`. La destination reste modifiable après impression et chaque scan est compté par jour, appareil et ville.

## Stack

Next.js 16 (App Router), React 19, Tailwind CSS 4, PostgreSQL et Prisma, sessions signées (JWT en cookie). Le rendu des QR codes (`src/lib/qr-style.ts`) est le même côté serveur et navigateur.

## Démarrage

Prérequis : Node.js 20+ et une base PostgreSQL.

```bash
cp .env.example .env   # renseignez DATABASE_URL, AUTH_SECRET et NEXT_PUBLIC_APP_URL
npm install
npm run db:migrate
npm run db:seed        # démo : demo@trame.app / demo12345 · régie : admin@trame.app / admin12345
npm run dev            # http://localhost:3000
```

`NEXT_PUBLIC_APP_URL` doit être l'adresse publique du site : c'est elle qui est encodée dans les QR dynamiques. Fixez-la avant d'imprimer, car un QR dynamique imprimé pointe toujours vers ce domaine.

## Routes

| Route | Rôle |
|-------|------|
| `/` | Accueil |
| `/modeles` | Galerie des modèles |
| `/studio` | Studio de création (utilisable sans compte) |
| `/connexion`, `/inscription` | Authentification |
| `/mes-qr` | Mes QR codes : liste, statistiques, destination |
| `/mes-qr/[id]` | Modifier un QR code |
| `/admin` | Régie : tableau, comptes, abonnements, visites (administrateur) |
| `/r/[code]` | Redirection des QR dynamiques (compte le scan) |
| `/api/qr-codes`, `/api/qr-codes/[id]` | API des QR codes |
| `/api/auth/*` | Inscription, connexion, déconnexion |
| `/api/visits` | Enregistre une vue de page (appelé par le site) |

## Offres

- **Gratuit** : QR statiques illimités et 3 QR dynamiques par compte.
- **Pro** : QR dynamiques illimités. Le paiement n'est pas encore branché : l'offre et l'abonnement se règlent dans la régie.

## Régie

Espace d'administration, réservé au rôle `ADMIN`.

- **Tableau** : visites du jour, inscriptions, revenu mensuel, rythme sur 30 jours, provenance, et la file des décisions (abonnements en retard, comptes Gratuit au plafond).
- **Comptes** : recherche, offre, rôle, désactivation, mot de passe, QR codes et adresses IP vues pour ce compte.
- **Abonnements** : état, prix mensuel, fin de période, résiliation prévue. Le revenu mensuel additionne les abonnements actifs.
- **Visites** : chaque page publique, avec l'adresse IP, le lieu (quand l'hébergeur l'envoie), l'appareil, le compte s'il est connecté, et la provenance. Une adresse ouvre tout son historique. Les visites de plus de 90 jours peuvent être effacées.

Le seed crée l'administrateur `admin@trame.app` / `admin12345`. En production, changez ce mot de passe depuis la fiche du compte, ou promouvez un compte existant :

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'vous@exemple.com';
```

Les adresses IP sont des données personnelles. Elles ne sont visibles que dans la régie.

La ville des scans et des visites provient des en-têtes de géolocalisation de l'hébergeur (Vercel ou Cloudflare). Ailleurs, seuls le jour, l'appareil et l'adresse IP sont enregistrés.

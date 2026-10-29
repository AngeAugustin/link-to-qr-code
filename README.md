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
npm run db:seed        # compte de démo : demo@trame.app / demo12345
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
| `/r/[code]` | Redirection des QR dynamiques (compte le scan) |
| `/api/qr-codes`, `/api/qr-codes/[id]` | API des QR codes |
| `/api/auth/*` | Inscription, connexion, déconnexion |

## Offres

- **Gratuit** : QR statiques illimités et 3 QR dynamiques par compte.
- **Pro** : QR dynamiques illimités. Le paiement n'est pas encore branché : pour passer un compte en Pro, modifiez le champ `plan` de l'utilisateur en base.

La ville des scans provient des en-têtes de géolocalisation de l'hébergeur (Vercel ou Cloudflare). Ailleurs, seuls le jour et le type d'appareil sont enregistrés.

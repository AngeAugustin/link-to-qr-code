/** Interface copy (French). Keys mirror the structure used by the QR components. */
export const COPY = {
  "common": {
    "loading": "Chargement…",
    "networkError": "Erreur réseau. Réessayez.",
    "serverError": "Erreur serveur.",
    "cancel": "Annuler",
    "continue": "Continuer",
    "close": "Fermer"
  },
  "app": {
    "qrStudio": {
      "tabs": {
        "content": "Contenu",
        "pattern": "Motif",
        "corners": "Coins",
        "colors": "Couleurs",
        "logo": "Logo",
        "frame": "Cadre"
      },
      "content": {
        "title": "Contenu",
        "name": "Nom du QR code",
        "namePh": "Ex. Menu du restaurant",
        "destination": "Lien de destination",
        "destinationPh": "https://votre-lien.com",
        "invalidUrl": "Saisissez une adresse complète qui commence par https://",
        "dynamic": "QR dynamique",
        "dynamicHint": "Modifiez la destination après impression et suivez les scans.",
        "dynamicPro": "Le plan Gratuit inclut 3 QR dynamiques.",
        "dynamicPublic": "Créez un compte gratuit pour rendre vos QR codes dynamiques.",
        "encoded": "Lien encodé",
        "encodedPending": "Le lien court est attribué à l'enregistrement.",
        "ecl": "Correction d'erreur",
        "eclHint": "Plus le niveau est haut, plus le code résiste aux logos et aux rayures, et plus il compte de modules."
      },
      "pattern": {
        "title": "Motif des modules",
        "hint": "La forme de chaque petit carré du code. Les trois coins se règlent dans « Coins ».",
        "shapes": {
          "square": "Carré",
          "rounded": "Fluide",
          "dots": "Points",
          "classy": "Élégant",
          "soft": "Doux",
          "diamond": "Losange",
          "bars": "Barres"
        }
      },
      "corners": {
        "title": "Coins",
        "frame": "Cadre des coins",
        "center": "Centre des coins",
        "custom": "Couleur distincte pour les coins",
        "shapes": {
          "square": "Carré",
          "rounded": "Arrondi",
          "circle": "Rond",
          "diamond": "Losange",
          "leaf": "Feuille"
        }
      },
      "colors": {
        "title": "Couleurs",
        "fg": "Premier plan",
        "gradient": "Dégradé",
        "second": "Seconde couleur",
        "linear": "Linéaire",
        "radial": "Radial",
        "bg": "Arrière-plan",
        "transparent": "Fond transparent",
        "cornerColor": "Couleur des coins"
      },
      "logo": {
        "title": "Logo central",
        "kinds": {
          "none": "Aucun",
          "link": "Lien",
          "fork": "Restaurant",
          "pin": "Adresse",
          "camera": "Photo",
          "mono": "Initiales",
          "image": "Image"
        },
        "initials": "Initiales",
        "upload": "Importer un logo",
        "uploadHint": "PNG, JPG, WebP ou SVG, 200 Ko maximum.",
        "replace": "Remplacer l'image",
        "tooLarge": "Image trop lourde : 200 Ko maximum.",
        "badType": "Format non pris en charge. Utilisez PNG, JPG, WebP ou SVG.",
        "size": "Taille du logo · {value} %",
        "eclRaised": "Logo importé. Correction réglée sur H pour rester lisible."
      },
      "frame": {
        "title": "Cadre et marges",
        "kinds": {
          "none": "Aucun",
          "label": "Étiquette",
          "bubble": "Bulle",
          "ticket": "Ticket"
        },
        "text": "Texte du cadre",
        "margin": "Zone de silence · {value} modules",
        "marginHint": "La marge vide autour du code. La norme recommande 4 modules."
      },
      "specs": {
        "version": "Version",
        "modules": "Modules",
        "ecl": "Correction",
        "minSize": "Taille min."
      },
      "scan": {
        "title": "Lisibilité",
        "grades": {
          "excellent": "Excellent",
          "fair": "Correct",
          "risky": "Risqué"
        },
        "outOf": "score sur 100",
        "contrastLow": "Contraste trop faible ({ratio}:1). Visez au moins 4:1.",
        "contrastFair": "Contraste juste ({ratio}:1). Foncez le motif ou éclaircissez le fond.",
        "contrastGood": "Contraste {ratio}:1, très bon.",
        "inverted": "Couleurs inversées : certains lecteurs anciens ne lisent que du foncé sur clair.",
        "logoEcl": "Le logo masque des modules. Passez la correction en Q ou H.",
        "logoLarge": "Logo large : testez le scan avant d'imprimer.",
        "logoOk": "Logo compatible avec le niveau de correction.",
        "marginLow": "Zone de silence trop étroite. Gardez au moins 2 modules.",
        "marginFair": "Zone de silence réduite. 4 modules est l'idéal.",
        "marginGood": "Zone de silence conforme à la norme."
      },
      "templates": {
        "title": "Modèles",
        "quick": "Modèles rapides",
        "apply": "Appliquer le modèle {name}",
        "applied": "Modèle « {name} » appliqué.",
        "use": "Utiliser ce modèle"
      },
      "categories": {
        "all": "Tous",
        "minimal": "Minimal",
        "gradient": "Dégradé",
        "color": "Coloré",
        "dark": "Sombre",
        "framed": "Avec cadre"
      },
      "export": {
        "title": "Exporter",
        "format": "Format",
        "size": "Taille",
        "sizes": {
          "1024": "1 024 px · web",
          "2048": "2 048 px · flyer",
          "4096": "4 096 px · affiche"
        },
        "download": "Télécharger",
        "copySvg": "Copier le code SVG",
        "copied": "Code SVG copié.",
        "copyFailed": "Copie impossible. Téléchargez le fichier SVG.",
        "downloaded": "Fichier {format} téléchargé.",
        "failed": "Export impossible. Réessayez avec un autre format."
      },
      "reset": "Réinitialiser",
      "resetDone": "Style réinitialisé.",
      "save": "Enregistrer",
      "saving": "Enregistrement…",
      "saved": "QR code enregistré.",
      "create": "Créer le QR code",
      "previewAlt": "Aperçu du QR code",
      "publicSaveTitle": "Enregistrez ce QR code",
      "publicSaveBody": "Avec un compte gratuit, gardez vos QR codes, rendez-les dynamiques et suivez chaque scan.",
      "publicSaveCta": "Créer un compte",
      "publicLogin": "J'ai déjà un compte"
    },
    "qrCodes": {
      "title": "Mes QR codes",
      "subtitle": "Transformez n'importe quel lien en QR code à votre image et suivez ses scans.",
      "create": "Nouveau QR code",
      "loading": "Chargement de vos QR codes…",
      "errorLoad": "Impossible de charger vos QR codes.",
      "emptyTitle": "Aucun QR code pour l'instant",
      "emptyBody": "Collez un lien, choisissez un modèle et personnalisez chaque détail.",
      "emptyCta": "Créer mon premier QR code",
      "kpiScans": "Scans · 30 jours",
      "kpiCodes": "QR codes",
      "kpiCodesDetail": "{dynamic} dynamiques · {static} statiques",
      "kpiTop": "Le plus scanné",
      "kpiTopNone": "Aucun scan pour l'instant",
      "colName": "Nom et destination",
      "colType": "Type",
      "colScans": "Scans · 14 j",
      "dynamic": "Dynamique",
      "static": "Statique",
      "destination": "Destination",
      "update": "Mettre à jour",
      "updated": "Destination mise à jour. Le QR imprimé redirige maintenant vers {url}",
      "dynamicNote": "Le QR imprimé ne change pas. Seule la redirection est modifiée.",
      "staticNote": "QR statique : la destination est inscrite dans le motif. Recréez-le en dynamique pour pouvoir la changer.",
      "daily": "Scans par jour",
      "last30": "sur 30 jours",
      "lastWeek": "7 derniers jours en couleur pleine",
      "devices": "Appareils",
      "cities": "Villes",
      "noData": "Pas encore de scans.",
      "staticNoStats": "Les QR statiques mènent directement à la destination : leurs scans ne peuvent pas être comptés.",
      "deviceNames": {
        "ios": "iPhone",
        "android": "Android",
        "desktop": "Ordinateur",
        "other": "Autre"
      },
      "editStyle": "Modifier le style",
      "delete": "Supprimer",
      "deleteTitle": "Supprimer ce QR code ?",
      "deleteBody": "Un QR dynamique déjà imprimé cessera de rediriger vers sa destination.",
      "deleted": "QR code supprimé.",
      "modified": "modifié le {date}",
      "copyShort": "Copier le lien court",
      "copiedShort": "Lien court copié.",
      "newTitle": "Nouveau QR code",
      "editTitle": "Modifier le QR code",
      "back": "Retour aux QR codes",
      "notFound": "Ce QR code est introuvable."
    }
  }
} as const;

type Vars = Record<string, string | number>;

export function t(path: string, vars?: Vars): string {
  let cur: unknown = COPY;
  for (const part of path.split(".")) {
    if (cur && typeof cur === "object" && part in cur) cur = (cur as Record<string, unknown>)[part];
    else return path;
  }
  if (typeof cur !== "string") return path;
  return vars ? cur.replace(/\{(\w+)\}/g, (_, k: string) => (vars[k] !== undefined ? String(vars[k]) : `{${k}}`)) : cur;
}

/** Hook form, so components read like the rest of the codebase. */
export function useT() {
  return t;
}

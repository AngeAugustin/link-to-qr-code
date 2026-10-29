import { NextResponse } from "next/server";

export const API_ERRORS = {
  unauthorized: "Connectez-vous pour continuer.",
  notFound: "QR code introuvable.",
  invalid: "Données invalides.",
  server: "Erreur serveur. Réessayez dans un instant.",
  badCredentials: "E-mail ou mot de passe incorrect.",
  emailTaken: "Un compte existe déjà avec cet e-mail.",
  dynamicLimit: "Le plan Gratuit inclut 3 QR dynamiques. Supprimez-en un ou passez en Pro.",
} as const;

export function jsonError(key: keyof typeof API_ERRORS, status: number) {
  return NextResponse.json({ error: API_ERRORS[key], code: key }, { status });
}

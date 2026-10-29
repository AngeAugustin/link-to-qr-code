import { normalizeStyle, type QrStyle } from "./qr-style";

/** A studio draft carried in the URL so visitors keep their work through sign-up. */
export type Draft = { name: string; destination: string; dynamic: boolean; style: QrStyle };

function toBase64Url(text: string) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string) {
  const binary = atob(value.replace(/-/g, "+").replace(/_/g, "/"));
  return new TextDecoder().decode(Uint8Array.from(binary, (c) => c.charCodeAt(0)));
}

export function encodeDraft(draft: Draft) {
  // Uploaded images are too large for a URL; the logo falls back to none.
  const style = draft.style.logo === "image" ? { ...draft.style, logo: "none" as const, logoData: null } : { ...draft.style, logoData: null };
  return toBase64Url(JSON.stringify({ ...draft, style }));
}

export function decodeDraft(value: string | undefined): Draft | null {
  if (!value || value.length > 4000) return null;
  try {
    const raw = JSON.parse(fromBase64Url(value));
    return {
      name: typeof raw.name === "string" ? raw.name.slice(0, 80) : "",
      destination: typeof raw.destination === "string" ? raw.destination.slice(0, 2048) : "",
      dynamic: raw.dynamic === true,
      style: normalizeStyle(raw.style),
    };
  } catch {
    return null;
  }
}

/** Only same-site paths are accepted as a post-login destination (no open redirect). */
export function safeNext(next: string | undefined) {
  return next && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\") ? next : "/mes-qr";
}

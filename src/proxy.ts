import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session-token";

/** Signed-in area: send visitors without a valid session to the login page. */
export async function proxy(request: NextRequest) {
  const userId = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);
  if (userId) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/connexion";
  url.search = `?next=${encodeURIComponent(request.nextUrl.pathname)}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/mes-qr/:path*"],
};

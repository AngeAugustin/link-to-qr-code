import { NextResponse } from "next/server";
import { z } from "zod";
import { recordPageView } from "@/lib/visits";

const schema = z.object({
  path: z.string().min(1).max(200),
  referrer: z.string().max(500).optional(),
});

function sameOrigin(request: Request) {
  const host = request.headers.get("host");
  if (!host) return false;
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      return new URL(origin).host === host;
    } catch {
      return false;
    }
  }
  const site = request.headers.get("sec-fetch-site");
  return site === "same-origin" || site === "none";
}

/** Beacon from the public site. Always answers 204 so the browser does not retry. */
export async function POST(request: Request) {
  const quiet = new NextResponse(null, { status: 204 });
  if (!sameOrigin(request)) return quiet;
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > 2_000) return quiet;

  try {
    const data = schema.parse(await request.json());
    await recordPageView(request, data.path, data.referrer);
  } catch (error) {
    if (!(error instanceof z.ZodError)) console.error(error);
  }
  return quiet;
}

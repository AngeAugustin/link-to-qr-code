import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { startSession, verifyPassword } from "@/lib/auth";
import { jsonError } from "@/lib/api";

const schema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1).max(200),
});

export async function POST(request: Request) {
  try {
    const data = schema.parse(await request.json());
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user || !(await verifyPassword(data.password, user.passwordHash))) {
      return jsonError("badCredentials", 401);
    }
    await startSession(user.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return jsonError("invalid", 400);
    }
    console.error(error);
    return jsonError("server", 500);
  }
}

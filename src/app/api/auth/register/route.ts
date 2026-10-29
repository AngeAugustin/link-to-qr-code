import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { hashPassword, startSession } from "@/lib/auth";
import { jsonError } from "@/lib/api";

const schema = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().toLowerCase().email().max(200),
  password: z.string().min(8).max(200),
});

export async function POST(request: Request) {
  try {
    const data = schema.parse(await request.json());
    const taken = await prisma.user.findUnique({ where: { email: data.email }, select: { id: true } });
    if (taken) {
      return jsonError("emailTaken", 409);
    }
    const user = await prisma.user.create({
      data: { name: data.name, email: data.email, passwordHash: await hashPassword(data.password) },
      select: { id: true },
    });
    await startSession(user.id);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return jsonError("invalid", 400);
    }
    console.error(error);
    return jsonError("server", 500);
  }
}

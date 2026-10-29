import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { FREE_DYNAMIC_LIMIT, generateQrCode, qrScanStats, serializeQr } from "@/lib/qr-codes";
import { jsonError } from "@/lib/api";
import { createQrSchema } from "./schema";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return jsonError("unauthorized", 401);
  }

  const rows = await prisma.qrCode.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });
  const stats = await qrScanStats(rows.map((r) => r.id));

  return NextResponse.json({
    qrCodes: rows.map((r) => ({ ...serializeQr(r), daily: stats.daily[r.id] ?? [] })),
    stats: { since: stats.since, total: stats.total, devices: stats.devices, cities: stats.cities },
    plan: user.plan,
    dynamicLimit: user.plan === "FREE" ? FREE_DYNAMIC_LIMIT : null,
  });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return jsonError("unauthorized", 401);
  }

  try {
    const data = createQrSchema.parse(await request.json());

    if (data.dynamic && user.plan === "FREE") {
      const dynamicCount = await prisma.qrCode.count({ where: { userId: user.id, dynamic: true } });
      if (dynamicCount >= FREE_DYNAMIC_LIMIT) {
        return jsonError("dynamicLimit", 403);
      }
    }

    const qr = await prisma.qrCode.create({
      data: {
        userId: user.id,
        name: data.name,
        destination: data.destination,
        dynamic: data.dynamic,
        style: data.style,
        code: await generateQrCode(),
      },
    });

    return NextResponse.json({ qrCode: serializeQr(qr) }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return jsonError("invalid", 400);
    }
    console.error(error);
    return jsonError("server", 500);
  }
}

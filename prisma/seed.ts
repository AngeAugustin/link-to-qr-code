import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { templateStyle } from "../src/lib/qr-style";

/** Demo account with a few QR codes and 30 days of scans. */
const prisma = new PrismaClient();

const CODES = [
  { name: "Menu · Atelier Noma", destination: "https://atelier-noma.fr/menu", dynamic: true, template: "fluide", code: "demoMenu", perDay: 150 },
  { name: "Affiche concert 14 nov.", destination: "https://salle-lumen.fr/billets/14-nov", dynamic: true, template: "corail", code: "demoGig", perDay: 70 },
  { name: "Packaging thé Oolong", destination: "https://maison-kiri.com/oolong", dynamic: true, template: "kraft", code: "demoTea", perDay: 25 },
  { name: "Portfolio · Inès Haddad", destination: "https://ineshaddad.design", dynamic: false, template: "graphite", code: "demoFolio", perDay: 0 },
];

const DEVICES = ["ios", "ios", "ios", "android", "android", "desktop"];
const CITIES = ["Paris", "Paris", "Paris", "Lyon", "Bruxelles", "Montréal", "Bordeaux"];

// Deterministic pseudo-random numbers so the demo looks the same on every seed.
let state = 42;
const rand = () => ((state = (state * 9301 + 49297) % 233280) / 233280);

async function main() {
  await prisma.user.deleteMany({ where: { email: "demo@trame.app" } });
  const user = await prisma.user.create({
    data: { email: "demo@trame.app", name: "Inès Haddad", passwordHash: await hash("demo12345", 12), plan: "PRO" },
  });

  for (const c of CODES) {
    const qr = await prisma.qrCode.create({
      data: {
        userId: user.id,
        name: c.name,
        destination: c.destination,
        dynamic: c.dynamic,
        code: c.code,
        style: templateStyle(c.template),
      },
    });
    if (!c.dynamic) continue;

    const scans = [];
    for (let day = 29; day >= 0; day--) {
      const date = new Date(Date.now() - day * 86_400_000);
      const weekend = date.getDay() === 0 || date.getDay() === 6 ? 1.45 : 1;
      const count = Math.round(c.perDay * (0.25 + rand() * 0.5) * weekend * 0.3);
      for (let i = 0; i < count; i++) {
        const at = new Date(date);
        at.setHours(8 + Math.floor(rand() * 14), Math.floor(rand() * 60));
        scans.push({
          qrCodeId: qr.id,
          device: DEVICES[Math.floor(rand() * DEVICES.length)],
          city: CITIES[Math.floor(rand() * CITIES.length)],
          country: "FR",
          createdAt: at > new Date() ? new Date() : at,
        });
      }
    }
    await prisma.qrScan.createMany({ data: scans });
    await prisma.qrCode.update({ where: { id: qr.id }, data: { scans: scans.length } });
  }

  console.log("Compte de démo : demo@trame.app / demo12345");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

import { Prisma, PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { templateStyle } from "../src/lib/qr-style";

/** Demo accounts, QR codes, scans, and site visits for the back office. */
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
const daysAgo = (days: number) => new Date(Date.now() - days * 86_400_000);

const DEMO = "demo@trame.app";
const ADMIN = "admin@trame.app";
const LATE = "retard@trame.app";
const FREE = "plafond@trame.app";

async function main() {
  await prisma.pageView.deleteMany({
    where: { OR: [{ ip: { startsWith: "203.0.113." } }, { ip: { startsWith: "198.51.100." } }] },
  });
  await prisma.user.deleteMany({ where: { email: { in: [DEMO, ADMIN, LATE, FREE] } } });
  const passwordHash = await hash("demo12345", 12);
  const user = await prisma.user.create({
    data: {
      email: DEMO,
      name: "Inès Haddad",
      passwordHash,
      plan: "PRO",
      createdAt: daysAgo(20),
      subscription: {
        create: {
          status: "ACTIVE",
          priceCents: 900,
          currentPeriodStart: daysAgo(12),
          currentPeriodEnd: daysAgo(-18),
        },
      },
    },
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

  const admin = await prisma.user.create({
    data: {
      email: ADMIN,
      name: "Administrateur",
      passwordHash: await hash("admin12345", 12),
      role: "ADMIN",
      createdAt: daysAgo(60),
    },
  });
  const late = await prisma.user.create({
    data: {
      email: LATE,
      name: "Atelier Noma",
      passwordHash,
      plan: "PRO",
      createdAt: daysAgo(12),
      subscription: {
        create: {
          status: "PAST_DUE",
          priceCents: 900,
          currentPeriodStart: daysAgo(40),
          currentPeriodEnd: daysAgo(2),
        },
      },
      qrCodes: {
        create: {
          name: "Carte Atelier Noma",
          destination: "https://example.com/noma",
          dynamic: true,
          code: "seedLate",
          style: templateStyle("corail"),
        },
      },
    },
  });
  const capped = await prisma.user.create({
    data: {
      email: FREE,
      name: "Compte plafond",
      passwordHash,
      plan: "FREE",
      createdAt: daysAgo(3),
      qrCodes: {
        create: ["Menu", "Carte", "Équipe"].map((name, index) => ({
          name,
          destination: `https://example.com/plafond-${index + 1}`,
          dynamic: true,
          code: `seedFree${index + 1}`,
          style: templateStyle(index === 0 ? "fluide" : index === 1 ? "kraft" : "graphite"),
        })),
      },
    },
  });

  const pages = ["/", "/modeles", "/studio", "/connexion", "/inscription", "/mes-qr"];
  const refs = [null, null, "https://www.google.com/", "https://www.instagram.com/", "https://news.ycombinator.com/"];
  const ips = ["203.0.113.10", "203.0.113.11", "203.0.113.24", "198.51.100.8", "198.51.100.20"];
  const places = [
    { country: "FR", city: "Paris" },
    { country: "FR", city: "Lyon" },
    { country: "BE", city: "Bruxelles" },
    { country: "CA", city: "Montréal" },
  ];
  const owners = [user.id, null, null, capped.id, late.id, admin.id];
  const views: Prisma.PageViewCreateManyInput[] = [];
  for (let day = 13; day >= 0; day--) {
    const count = 4 + Math.floor(rand() * 6);
    for (let i = 0; i < count; i++) {
      const at = daysAgo(day);
      at.setUTCHours(8 + Math.floor(rand() * 12), Math.floor(rand() * 60), 0, 0);
      const place = places[Math.floor(rand() * places.length)] ?? places[0];
      views.push({
        path: pages[Math.floor(rand() * pages.length)] ?? "/",
        locale: rand() > 0.25 ? "fr" : "en",
        referrer: refs[Math.floor(rand() * refs.length)],
        ip: ips[Math.floor(rand() * ips.length)],
        device: DEVICES[Math.floor(rand() * DEVICES.length)],
        country: place.country,
        city: place.city,
        userId: owners[Math.floor(rand() * owners.length)],
        createdAt: at > new Date() ? new Date() : at,
      });
    }
  }
  views.push({
    path: "/",
    locale: "fr",
    referrer: null,
    ip: "203.0.113.10",
    userAgent: "Mozilla/5.0 (compatible; Googlebot/2.1)",
    device: "other",
    bot: true,
    country: null,
    city: null,
    userId: null,
    createdAt: daysAgo(1),
  });
  await prisma.pageView.createMany({ data: views });

  console.log("Compte de démo : demo@trame.app / demo12345");
  console.log("Régie : admin@trame.app / admin12345");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

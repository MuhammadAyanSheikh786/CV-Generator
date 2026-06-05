import { PrismaClient } from "../src/generated/prisma/index.js";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

const prisma = new PrismaClient({});

const DATA_DIR = resolve("data");

function readJSON(file) {
  try {
    const p = resolve(DATA_DIR, file);
    if (existsSync(p)) return JSON.parse(readFileSync(p, "utf-8"));
  } catch (e) {
    console.error("Error reading", file, e.message);
  }
  return null;
}

async function migrate() {
  console.log("Migrating users...");
  const users = readJSON("users.json") || [];
  for (const u of users) {
    const existing = await prisma.user.findUnique({ where: { email: u.email } });
    if (!existing) {
      await prisma.user.upsert({
        where: { email: u.email },
        update: {},
        create: {
          id: u.id,
          name: u.name || "",
          email: u.email,
          password: u.password || null,
          createdAt: u.createdAt ? new Date(u.createdAt) : new Date(),
        },
      });
    }
    const hasToken = await prisma.token.findUnique({ where: { userId: u.id } });
    if (!hasToken) {
      await prisma.token.upsert({
        where: { userId: u.id },
        update: {},
        create: {
          userId: u.id,
          balance: u.tokens?.balance ?? 50,
          expiresAt: u.tokens?.expiresAt
            ? new Date(u.tokens.expiresAt)
            : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });
    }
  }

  console.log("Migrating scans...");
  const scans = readJSON("cv-scans.json") || [];
  for (const s of scans) {
    const existing = await prisma.scan.findUnique({ where: { id: s.id } });
    if (!existing) {
      await prisma.scan.create({
        data: {
          id: s.id,
          userId: s.userId,
          fileName: s.fileName || "unknown.pdf",
          score: s.score ?? s.result?.score ?? 50,
          breakdown: JSON.stringify(s.result?.breakdown || {}),
          goodImpressions: JSON.stringify(s.result?.goodImpressions || []),
          badImpressions: JSON.stringify(s.result?.badImpressions || []),
          actionItems: JSON.stringify(s.result?.actionItems || []),
          weaknesses: JSON.stringify(s.result?.weaknesses || []),
          tipsToFix: JSON.stringify(s.result?.tipsToFix || []),
          detailedOverview: s.result?.detailedOverview || null,
          imageKitUrl: s.imageKitUrl || null,
          textSnippet: s.textSnippet || null,
          createdAt: s.createdAt ? new Date(s.createdAt) : new Date(),
        },
      });
    }
  }

  console.log("Migration complete!");
  await prisma.$disconnect();
}

migrate().catch((e) => {
  console.error("Migration failed:", e);
  process.exit(1);
});

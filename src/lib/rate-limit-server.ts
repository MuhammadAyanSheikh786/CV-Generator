import { prisma } from "@/lib/prisma";

const LIMITS = {
  generation: 5,
  check: 10,
} as const;

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function getEndOfDayTimestamp(): number {
  const now = new Date();
  const eod = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999)
  );
  return eod.getTime();
}

async function getUserId(email: string): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  return user?.id ?? null;
}

export async function checkRateLimit(
  email: string,
  type: "generation" | "check" = "check"
): Promise<{ allowed: boolean; remaining: number; resetTimestamp: number }> {
  const userId = await getUserId(email);
  if (!userId) {
    return { allowed: false, remaining: 0, resetTimestamp: getEndOfDayTimestamp() };
  }

  const date = todayKey();
  const limit = LIMITS[type];

  const usage = await prisma.dailyUsage.findUnique({
    where: { userId_date: { userId, date } },
  });

  if (!usage) {
    return { allowed: true, remaining: limit, resetTimestamp: getEndOfDayTimestamp() };
  }

  const currentCount = type === "generation" ? usage.generationsCount : usage.checksCount;
  const allowed = currentCount < limit;
  const remaining = Math.max(0, limit - currentCount);

  return { allowed, remaining, resetTimestamp: getEndOfDayTimestamp() };
}

export async function incrementRateLimit(
  email: string,
  type: "generation" | "check" = "check"
): Promise<void> {
  const userId = await getUserId(email);
  if (!userId) return;

  const date = todayKey();

  const existing = await prisma.dailyUsage.findUnique({
    where: { userId_date: { userId, date } },
  });

  if (existing) {
    const field = type === "generation" ? "generationsCount" : "checksCount";
    await prisma.dailyUsage.update({
      where: { id: existing.id },
      data: { [field]: { increment: 1 } },
    });
  } else {
    await prisma.dailyUsage.create({
      data: {
        userId,
        date,
        ...(type === "generation" ? { generationsCount: 1 } : { checksCount: 1 }),
      },
    });
  }
}

export async function getRemainingChecks(email: string): Promise<number> {
  const { remaining } = await checkRateLimit(email, "check");
  return remaining;
}

export async function canCheckCV(email: string): Promise<boolean> {
  const { allowed } = await checkRateLimit(email, "check");
  return allowed;
}

export async function incrementCheckCount(email: string): Promise<void> {
  return incrementRateLimit(email, "check");
}

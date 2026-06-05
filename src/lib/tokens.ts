import { prisma } from "@/lib/prisma";
import { GRANT_TOKENS_ON_SIGNUP, TOKEN_EXPIRY_DAYS } from "@/lib/constants";

export async function getTokenInfo(userId: string) {
  const token = await prisma.token.findUnique({ where: { userId } });
  if (!token) return null;

  const now = new Date();
  let balance = token.balance;
  let expiresAt = token.expiresAt;

  if (expiresAt <= now) {
    balance = GRANT_TOKENS_ON_SIGNUP;
    expiresAt = new Date(now.getTime() + TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
    await prisma.token.update({
      where: { userId },
      data: { balance, expiresAt },
    });
  }

  const msPerDay = 24 * 60 * 60 * 1000;
  const expiresInDays = Math.max(1, TOKEN_EXPIRY_DAYS - Math.floor((now.getTime() - expiresAt.getTime()) / msPerDay));

  return {
    balance,
    expiresAt: expiresAt.toISOString(),
    expiresInDays,
  };
}

export async function deductToken(userId: string): Promise<boolean> {
  const token = await prisma.token.findUnique({ where: { userId } });
  if (!token || token.balance <= 0) return false;

  await prisma.token.update({
    where: { userId },
    data: { balance: { decrement: 1 } },
  });

  return true;
}

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getFirebaseAuth } from "@/lib/firebase-admin";

export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  const cookie = request.cookies.get("token");
  return cookie?.value || null;
}

export async function getAuthUser(request: NextRequest) {
  const token = getTokenFromRequest(request);
  if (!token) return null;

  let decoded: Record<string, any>;
  try {
    decoded = await getFirebaseAuth().verifyIdToken(token);
  } catch {
    try {
      const jwt = await import("jsonwebtoken");
      const payload = jwt.default.verify(
        token,
        process.env.JWT_SECRET || "cv-forge-dev-secret-key-change-in-production"
      ) as { userId: string; email: string };
      decoded = { uid: payload.userId, email: payload.email };
    } catch {
      return null;
    }
  }

  const uid = decoded.uid;
  const email = decoded.email || "";

  const photoURL = decoded.picture || null;

  let user = await prisma.user.findUnique({ where: { id: uid } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        id: uid,
        name: decoded.name || email.split("@")[0] || "User",
        email,
        photoURL,
      },
    });
    const existingToken = await prisma.token.findUnique({ where: { userId: uid } });
    if (!existingToken) {
      await prisma.token.create({
        data: {
          userId: uid,
          balance: 50,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });
    }
  }

  // Sync email or photoURL if changed in Firebase
  const updates: Record<string, any> = {};
  if (user.email !== email) updates.email = email;
  if (photoURL && user.photoURL !== photoURL) updates.photoURL = photoURL;
  if (Object.keys(updates).length > 0) {
    user = await prisma.user.update({ where: { id: uid }, data: updates });
  }

  const tokenRecord = await prisma.token.findUnique({ where: { userId: uid } });
  return {
    id: uid,
    email: user.email,
    name: user.name,
    photoURL: user.photoURL || undefined,
    createdAt: user.createdAt,
    tokens: { balance: tokenRecord?.balance ?? 0 },
  };
}

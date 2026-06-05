import { prisma } from "@/lib/prisma";
import { AICheckResult } from "@/lib/schemas";

export interface CVScan {
  id: string;
  userId: string;
  fileName: string;
  imageKitUrl?: string;
  textSnippet: string;
  result: AICheckResult;
  createdAt: string;
  score: number;
}

function fromPrisma(scan: {
  id: string;
  userId: string;
  fileName: string;
  score: number;
  breakdown: string;
  goodImpressions: string;
  badImpressions: string;
  actionItems: string;
  weaknesses: string;
  tipsToFix: string;
  detailedOverview: string | null;
  imageKitUrl: string | null;
  textSnippet: string | null;
  createdAt: Date;
}): CVScan {
  const result: AICheckResult & {
    detailedOverview?: string;
    weaknesses?: string[];
    tipsToFix?: string[];
  } = {
    score: scan.score,
    breakdown: JSON.parse(scan.breakdown ?? "{}"),
    goodImpressions: JSON.parse(scan.goodImpressions ?? "[]"),
    badImpressions: JSON.parse(scan.badImpressions ?? "[]"),
    actionItems: JSON.parse(scan.actionItems ?? "[]"),
  };

  const parsedWeaknesses = JSON.parse(scan.weaknesses ?? "[]");
  const parsedTipsToFix = JSON.parse(scan.tipsToFix ?? "[]");

  if (scan.detailedOverview) result.detailedOverview = scan.detailedOverview;
  if (parsedWeaknesses.length) result.weaknesses = parsedWeaknesses;
  if (parsedTipsToFix.length) result.tipsToFix = parsedTipsToFix;

  return {
    id: scan.id,
    userId: scan.userId,
    fileName: scan.fileName,
    imageKitUrl: scan.imageKitUrl ?? undefined,
    textSnippet: scan.textSnippet ?? "",
    result: result as AICheckResult,
    score: scan.score,
    createdAt: scan.createdAt.toISOString(),
  };
}

export async function saveScan(
  data: Omit<CVScan, "id" | "createdAt">
): Promise<CVScan> {
  const { result, ...rest } = data;

  const created = await prisma.scan.create({
    data: {
      userId: rest.userId,
      fileName: rest.fileName,
      imageKitUrl: rest.imageKitUrl ?? null,
      textSnippet: rest.textSnippet ?? null,
      score: result.score,
      breakdown: JSON.stringify(result.breakdown),
      goodImpressions: JSON.stringify(result.goodImpressions),
      badImpressions: JSON.stringify(result.badImpressions),
      actionItems: JSON.stringify(result.actionItems),
      weaknesses: JSON.stringify((result as any).weaknesses ?? []),
      tipsToFix: JSON.stringify((result as any).tipsToFix ?? []),
      detailedOverview: (result as any).detailedOverview ?? null,
    },
  });

  return fromPrisma(created);
}

export async function getScansByUser(userId: string): Promise<CVScan[]> {
  const scans = await prisma.scan.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return scans.map(fromPrisma);
}

export async function getScanById(id: string): Promise<CVScan | null> {
  const scan = await prisma.scan.findUnique({
    where: { id },
  });

  return scan ? fromPrisma(scan) : null;
}

import { prisma } from "@/lib/prisma";
import { PDFAnalysisResult } from "@/lib/schemas";

export interface CVScan {
  id: string;
  userId: string;
  fileName: string;
  imageKitUrl?: string;
  textSnippet: string;
  result: PDFAnalysisResult;
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
  const parsedWeaknesses = JSON.parse(scan.weaknesses ?? "[]");
  const parsedTipsToFix = JSON.parse(scan.tipsToFix ?? "[]");

  const result: PDFAnalysisResult = {
    score: scan.score,
    breakdown: JSON.parse(scan.breakdown ?? "{}"),
    goodImpressions: JSON.parse(scan.goodImpressions ?? "[]"),
    badImpressions: JSON.parse(scan.badImpressions ?? "[]"),
    actionItems: JSON.parse(scan.actionItems ?? "[]"),
    weaknesses: parsedWeaknesses.length ? parsedWeaknesses : [],
    tipsToFix: parsedTipsToFix.length ? parsedTipsToFix : [],
    detailedOverview: scan.detailedOverview ?? "",
  };

  return {
    id: scan.id,
    userId: scan.userId,
    fileName: scan.fileName,
    imageKitUrl: scan.imageKitUrl ?? undefined,
    textSnippet: scan.textSnippet ?? "",
    result,
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
      weaknesses: JSON.stringify(result.weaknesses ?? []),
      tipsToFix: JSON.stringify(result.tipsToFix ?? []),
      detailedOverview: result.detailedOverview ?? null,
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

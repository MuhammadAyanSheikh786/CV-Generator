import { NextRequest, NextResponse } from "next/server";
import { getAllTemplates, incrementTemplateDownloads } from "@/lib/community-templates";

export async function GET() {
  try {
    const templates = getAllTemplates();
    return NextResponse.json({ templates });
  } catch (error: any) {
    console.error("/api/templates/community GET error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id } = (await request.json()) as { id: string };
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }
    const ok = incrementTemplateDownloads(id);
    if (!ok) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("/api/templates/community PUT error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

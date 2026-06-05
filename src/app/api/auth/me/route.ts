import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { getTokenInfo } from "@/lib/tokens";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const tokenInfo = await getTokenInfo(user.id);

    return NextResponse.json({
      user: {
        ...user,
        tokens: tokenInfo ?? user.tokens,
      },
    });
  } catch (error: any) {
    console.error("/api/auth/me error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

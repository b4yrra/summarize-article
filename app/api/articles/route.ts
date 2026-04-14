import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await (prisma as any).user.findUnique({
      where: { clerkId: userId },
    });
    if (!user) {
      return NextResponse.json([], { status: 200 });
    }

    const articles = await prisma.article.findMany({
      where: { userId: user.id },
      include: { quizzes: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(articles, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[GET /api/articles]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

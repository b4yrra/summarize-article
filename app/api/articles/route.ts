import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

// GET /api/articles
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const articles = await prisma.article.findMany({
      where: userId ? { userId: Number(userId) } : undefined,
      include: { quizzes: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(articles, { status: 200 });
  } catch (error) {
    console.error("[GET /api/articles]", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 },
    );
  }
}

// POST /api/articles
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, content, summary, userId } = body;

    if (!title || !content || !summary || !userId) {
      return NextResponse.json(
        { error: "title, content, summary, and userId are required" },
        { status: 400 },
      );
    }

    const article = await prisma.article.create({
      data: { title, content, summary, userId: Number(userId) },
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error("[POST /api/articles]", error);
    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 },
    );
  }
}

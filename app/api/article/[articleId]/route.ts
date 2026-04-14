import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

type Params = { params: { articleId: string } };

// GET /api/article/[articleId]
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const id = Number(params.articleId);

    const article = await prisma.article.findUnique({
      where: { id },
      include: { quizzes: true },
    });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json(article, { status: 200 });
  } catch (error) {
    console.error("[GET /api/article/:id]", error);
    return NextResponse.json(
      { error: "Failed to fetch article" },
      { status: 500 },
    );
  }
}

// POST /api/article/[articleId]  – update article
export async function POST(req: NextRequest, { params }: Params) {
  try {
    const id = Number(params.articleId);
    const body = await req.json();
    const { title, content, summary } = body;

    const existing = await prisma.article.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    const updated = await prisma.article.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(summary !== undefined && { summary }),
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("[POST /api/article/:id]", error);
    return NextResponse.json(
      { error: "Failed to update article" },
      { status: 500 },
    );
  }
}

// DELETE /api/article/[articleId]
export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const id = Number(params.articleId);

    const existing = await prisma.article.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Cascade-delete quizzes first
    await prisma.quiz.deleteMany({ where: { articleId: id } });
    await prisma.article.delete({ where: { id } });

    return NextResponse.json({ message: "Article deleted" }, { status: 200 });
  } catch (error) {
    console.error("[DELETE /api/article/:id]", error);
    return NextResponse.json(
      { error: "Failed to delete article" },
      { status: 500 },
    );
  }
}

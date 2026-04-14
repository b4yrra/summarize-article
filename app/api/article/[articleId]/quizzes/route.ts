import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

type Params = { params: { articleId: string } };

// GET /api/article/[articleId]/quizzes
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const articleId = Number(params.articleId);

    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });
    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    const quizzes = await prisma.quiz.findMany({
      where: { articleId },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(quizzes, { status: 200 });
  } catch (error) {
    console.error("[GET /api/article/:id/quizzes]", error);
    return NextResponse.json(
      { error: "Failed to fetch quizzes" },
      { status: 500 },
    );
  }
}

// POST /api/article/[articleId]/quizzes  – create one or many quizzes
export async function POST(req: NextRequest, { params }: Params) {
  try {
    const articleId = Number(params.articleId);
    const body = await req.json();

    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });
    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Accept either a single quiz object or an array
    const items: Array<{
      question: string;
      options: string[];
      answer: string;
    }> = Array.isArray(body) ? body : [body];

    for (const item of items) {
      if (!item.question || !item.options || !item.answer) {
        return NextResponse.json(
          { error: "Each quiz needs question, options, and answer" },
          { status: 400 },
        );
      }
      if (!Array.isArray(item.options) || item.options.length < 2) {
        return NextResponse.json(
          { error: "options must be an array with at least 2 items" },
          { status: 400 },
        );
      }
    }

    const quizzes = await prisma.$transaction(
      items.map((item) =>
        prisma.quiz.create({
          data: {
            question: item.question,
            options: item.options,
            answer: item.answer,
            articleId,
          },
        }),
      ),
    );

    return NextResponse.json(quizzes, { status: 201 });
  } catch (error) {
    console.error("[POST /api/article/:id/quizzes]", error);
    return NextResponse.json(
      { error: "Failed to create quizzes" },
      { status: 500 },
    );
  }
}

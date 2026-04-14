import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { prisma } from "@/lib/prisma";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

interface GeneratedQuiz {
  question: string;
  options: string[];
  answer: string;
}

interface GeneratedArticle {
  title: string;
  content: string;
  summary: string;
  quizzes: GeneratedQuiz[];
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, content } = body;

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 },
      );
    }

    // Upsert user by Clerk ID
    const clerkUser = await currentUser();
    const email =
      clerkUser?.emailAddresses?.[0]?.emailAddress ?? `${userId}@clerk.user`;

    const user = await prisma.user.upsert({
      where: { clerkId: userId },
      update: { email },
      create: { clerkId: userId, email },
    });

    // Generate article + quizzes via Groq
    const message = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 2048,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are an educational content generator. Always respond with valid JSON only — no markdown, no extra text.",
        },
        {
          role: "user",
          content: `Generate an article and 5 multiple-choice quiz questions about the topic: "${title}".

Respond ONLY with a valid JSON object that matches this exact shape:
{
  "title": "string",
  "content": "string (3-5 paragraphs)",
  "summary": "string (1-2 sentences)",
  "quizzes": [
    {
      "question": "string",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "answer": "string (must exactly match one of the options)"
    }
  ]
}`,
        },
      ],
    });

    const raw = message.choices[0]?.message?.content ?? "";

    let parsed: GeneratedArticle;
    try {
      parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
    } catch {
      console.error("Groq returned invalid JSON:", raw);
      return NextResponse.json(
        { error: "AI returned malformed JSON", raw },
        { status: 502 },
      );
    }

    // Persist article
    const article = await prisma.article.create({
      data: {
        title: parsed.title,
        content: parsed.content,
        summary: parsed.summary,
        userId: user.id,
      },
    });

    // Persist quizzes
    const quizzes = await prisma.$transaction(
      parsed.quizzes.map((q) =>
        prisma.quiz.create({
          data: {
            question: q.question,
            options: q.options,
            answer: q.answer,
            articleId: article.id,
          },
        }),
      ),
    );

    return NextResponse.json({ article, quizzes }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[POST /api/generate]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

"use client";

import { useState, useEffect } from "react";
import { Article, AppView } from "@/app/types";
import { Topbar } from "@/app/components/layout/Topbar";
import { Sidebar } from "@/app/components/sidebar/Sidebar";
import { GenerateForm } from "@/app/components/generate/GenerateForm";
import { ArticleView } from "@/app/components/article/ArticleView";
import { QuizModal } from "@/app/components/quiz/QuizModal";
import { CancelConfirm } from "@/app/components/quiz/CancelConfirm";
import { QuizResult } from "@/app/components/quiz/QuizResult";

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [view, setView] = useState<AppView>("form");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [quizIndex, setQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const activeArticle = articles.find((a) => a.id === activeId) ?? null;

  useEffect(() => {
    fetch("/api/articles")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setArticles(data))
      .catch(() => {});
  }, []);

  function handleCreated(article: Article) {
    setArticles((prev) => [article, ...prev]);
    setActiveId(article.id);
    setView("article");
  }

  function handleSelectArticle(id: number) {
    setActiveId(id);
    setView("article");
  }

  function handleStartQuiz() {
    setQuizIndex(0);
    setScore(0);
    setAnswered(false);
    setSelected(null);
    setView("quiz");
  }

  function handleSelectOption(opt: string) {
    if (answered || !activeArticle) return;
    setSelected(opt);
    setAnswered(true);
    if (opt === activeArticle.quizzes[quizIndex].answer) setScore((s) => s + 1);
  }

  function handleNext() {
    const total = activeArticle?.quizzes.length ?? 0;
    if (quizIndex + 1 >= total) {
      setView("result");
    } else {
      setQuizIndex((i) => i + 1);
      setAnswered(false);
      setSelected(null);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background font-mono">
      <Topbar />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar
          articles={articles}
          activeId={activeId}
          open={sidebarOpen}
          onToggle={() => setSidebarOpen((o) => !o)}
          onSelect={handleSelectArticle}
        />
        <main className="flex-1 overflow-y-auto flex items-start justify-center p-8">
          {view === "form" && <GenerateForm onCreated={handleCreated} />}
          {view === "article" && activeArticle && (
            <ArticleView
              article={activeArticle}
              onTakeQuiz={handleStartQuiz}
              onNewArticle={() => setView("form")}
            />
          )}
          {view === "quiz" && activeArticle && (
            <div className="w-full max-w-xl">
              <QuizModal
                quizzes={activeArticle.quizzes}
                index={quizIndex}
                answered={answered}
                selected={selected}
                onSelect={handleSelectOption}
                onNext={handleNext}
                onClose={() => setView("confirm")}
              />
            </div>
          )}
          {view === "confirm" && (
            <div className="w-full max-w-xl">
              <CancelConfirm
                onGoBack={() => setView("quiz")}
                onCancel={() => setView("article")}
              />
            </div>
          )}
          {view === "result" && activeArticle && (
            <div className="w-full max-w-xl">
              <QuizResult
                score={score}
                total={activeArticle.quizzes.length}
                onRetry={handleStartQuiz}
                onBack={() => setView("article")}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

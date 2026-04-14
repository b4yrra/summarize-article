"use client";

import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface QuizResultProps {
  score: number;
  total: number;
  onRetry: () => void;
  onBack: () => void;
}

export function QuizResult({ score, total, onRetry, onBack }: QuizResultProps) {
  const pct = Math.round((score / total) * 100);
  const emoji = pct >= 80 ? "🎉" : pct >= 50 ? "👍" : "📖";
  const label =
    pct >= 80 ? "Excellent!" : pct >= 50 ? "Good effort!" : "Keep reading!";

  return (
    <div className="min-h-[400px] bg-black/30 flex items-center justify-center rounded-xl p-6">
      <div className="bg-card rounded-xl p-6 w-full max-w-lg">
        <div className="flex items-center gap-2 text-base font-medium mb-6">
          <Sparkles className="h-4 w-4" /> Results
        </div>
        <div className="text-center py-4">
          <div className="text-4xl mb-3">{emoji}</div>
          <div className="text-4xl font-medium mb-1.5">
            {score} / {total}
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            {pct}% correct — {label}
          </p>
          <div className="flex gap-2.5 justify-center">
            <Button variant="outline" onClick={onRetry}>
              Try again
            </Button>
            <Button onClick={onBack}>Back to article</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

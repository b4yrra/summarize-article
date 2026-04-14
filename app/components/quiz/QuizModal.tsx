"use client";

import { Quiz } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizModalProps {
  quizzes: Quiz[];
  index: number;
  answered: boolean;
  selected: string | null;
  onSelect: (opt: string) => void;
  onNext: () => void;
  onClose: () => void;
}

export function QuizModal({
  quizzes,
  index,
  answered,
  selected,
  onSelect,
  onNext,
  onClose,
}: QuizModalProps) {
  const q = quizzes[index];
  if (!q) return null;

  return (
    <div className="min-h-[500px] bg-black/30 flex items-center justify-center rounded-xl p-6">
      <div className="bg-card rounded-xl p-6 w-full max-w-lg">
        <div className="flex items-start justify-between mb-1">
          <div className="flex items-center gap-2 text-base font-medium">
            <Sparkles className="h-4 w-4" /> Quick test
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={onClose}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mb-5">
          Take a quick test about your knowledge from your content
        </p>

        <div className="border border-border rounded-lg p-4">
          <div className="flex items-start justify-between gap-3 mb-4">
            <p className="text-sm leading-relaxed">{q.question}</p>
            <span className="text-sm shrink-0">
              <strong>{index + 1}</strong>
              <span className="text-muted-foreground"> / {quizzes.length}</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {q.options.map((opt) => (
              <button
                key={opt}
                disabled={answered}
                onClick={() => onSelect(opt)}
                className={cn(
                  "px-3 py-3 border rounded-lg text-sm text-center transition-colors disabled:cursor-not-allowed",
                  !answered && "hover:bg-accent border-border",
                  answered &&
                    opt === q.answer &&
                    "bg-green-50 border-green-500 text-green-900 dark:bg-green-950 dark:text-green-100",
                  answered &&
                    opt === selected &&
                    opt !== q.answer &&
                    "bg-red-50 border-red-400 text-red-900 dark:bg-red-950 dark:text-red-100",
                  answered &&
                    opt !== q.answer &&
                    opt !== selected &&
                    "border-border opacity-50",
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {answered && (
          <div className="flex justify-end mt-4">
            <Button onClick={onNext}>
              {index + 1 < quizzes.length ? "Next" : "See results"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

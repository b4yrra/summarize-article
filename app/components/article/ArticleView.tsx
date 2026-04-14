"use client";

import { useState } from "react";
import { Article } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileText, AlignLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArticleViewProps {
  article: Article;
  onTakeQuiz: () => void;
  onNewArticle: () => void;
}

export function ArticleView({
  article,
  onTakeQuiz,
  onNewArticle,
}: ArticleViewProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-card border border-border rounded-xl p-7 w-full max-w-xl">
      <div className="mb-5">
        <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-3">
          <FileText className="h-3.5 w-3.5" /> Summarized content
        </p>
        <h2 className="text-xl font-medium mb-2">{article.title}</h2>
        <p className="text-sm leading-relaxed">{article.summary}</p>
      </div>

      <Separator className="my-4" />

      <div>
        <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
          <AlignLeft className="h-3.5 w-3.5" /> Article Content
        </p>
        <p
          className={cn(
            "text-sm leading-relaxed text-muted-foreground",
            !expanded && "line-clamp-3",
          )}
        >
          {article.content}
        </p>
        <button
          onClick={() => setExpanded((e) => !e)}
          className="text-sm text-blue-600 dark:text-blue-400 mt-1 hover:underline"
        >
          {expanded ? "See less" : "See more"}
        </button>
      </div>

      <Separator className="my-4" />

      <div className="flex items-center justify-between">
        <button
          onClick={onNewArticle}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          + New article
        </button>
        <Button onClick={onTakeQuiz}>Take a quiz</Button>
      </div>
    </div>
  );
}

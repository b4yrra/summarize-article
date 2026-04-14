"use client";

import { useState } from "react";
import { Article } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, FileText, AlignLeft, Loader2 } from "lucide-react";

interface GenerateFormProps {
  onCreated: (article: Article) => void;
}

export function GenerateForm({ onCreated }: GenerateFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    setError("");
    if (!title.trim() || !content.trim()) {
      setError("Please fill in both the title and content.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      onCreated({ ...data.article, quizzes: data.quizzes });
    } catch (e: unknown) {
      setError(
        e instanceof Error ? e.message : "Generation failed. Try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-card border border-border rounded-xl p-7 w-full max-w-xl">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="h-5 w-5" />
        <h1 className="text-lg font-medium">Article Quiz Generator</h1>
      </div>
      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
        Paste your article below to generate a summarize and quiz question. Your
        articles will saved in the sidebar for future reference.
      </p>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-sm">
            <FileText className="h-3.5 w-3.5 opacity-50" /> Article Title
          </Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title for your article..."
          />
        </div>

        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-sm">
            <AlignLeft className="h-3.5 w-3.5 opacity-50" /> Article Content
          </Label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your article content here..."
            className="h-32 resize-none"
          />
        </div>

        {error && (
          <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Generating..." : "Generate summary"}
          </Button>
        </div>
      </div>
    </div>
  );
}

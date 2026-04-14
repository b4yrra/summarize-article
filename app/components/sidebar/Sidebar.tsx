"use client";

import { Article } from "@/app/types";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  articles: Article[];
  activeId: number | null;
  open: boolean;
  onToggle: () => void;
  onSelect: (id: number) => void;
}

export function Sidebar({
  articles,
  activeId,
  open,
  onToggle,
  onSelect,
}: SidebarProps) {
  return (
    <>
      {open ? (
        <aside className="w-60 shrink-0 border-r border-border bg-background flex flex-col">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-xs font-medium text-muted-foreground">
              History
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={onToggle}
            >
              <PanelLeftClose className="h-4 w-4" />
            </Button>
          </div>
          <ScrollArea className="flex-1 px-2 pb-4">
            {articles.map((a) => (
              <button
                key={a.id}
                onClick={() => onSelect(a.id)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-md text-sm truncate transition-colors hover:bg-accent",
                  a.id === activeId && "bg-accent font-medium",
                )}
              >
                {a.title}
              </button>
            ))}
          </ScrollArea>
        </aside>
      ) : (
        <Button
          variant="outline"
          size="icon"
          className="absolute left-2 top-2 z-10 h-7 w-7"
          onClick={onToggle}
        >
          <PanelLeftOpen className="h-4 w-4" />
        </Button>
      )}
    </>
  );
}

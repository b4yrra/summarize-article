"use client";

import { Button } from "@/components/ui/button";

interface CancelConfirmProps {
  onGoBack: () => void;
  onCancel: () => void;
}

export function CancelConfirm({ onGoBack, onCancel }: CancelConfirmProps) {
  return (
    <div className="min-h-[300px] bg-black/30 flex items-center justify-center rounded-xl p-6">
      <div className="bg-card rounded-xl p-6 w-full max-w-sm">
        <h2 className="text-base font-medium mb-2">Are you sure?</h2>
        <p className="text-sm text-destructive mb-5 leading-relaxed">
          If you press &apos;Cancel&apos;, this quiz will restart from the
          beginning.
        </p>
        <div className="flex gap-2.5">
          <Button onClick={onGoBack}>Go back</Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel quiz
          </Button>
        </div>
      </div>
    </div>
  );
}

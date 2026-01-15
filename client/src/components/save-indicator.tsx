import { type SaveStatus } from "@/hooks/use-grades";
import { Cloud, CloudOff, Check, Loader2 } from "lucide-react";

interface SaveIndicatorProps {
  status: SaveStatus;
}

export function SaveIndicator({ status }: SaveIndicatorProps) {
  return (
    <div 
      className="flex items-center gap-1.5 text-xs font-medium"
      data-testid="save-indicator"
    >
      {status === "idle" && (
        <>
          <Cloud className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">Auto-save</span>
        </>
      )}
      {status === "saving" && (
        <>
          <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
          <span className="text-primary">Saving...</span>
        </>
      )}
      {status === "saved" && (
        <>
          <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
          <span className="text-green-600 dark:text-green-400">Saved</span>
        </>
      )}
      {status === "error" && (
        <>
          <CloudOff className="w-3.5 h-3.5 text-destructive" />
          <span className="text-destructive">Error</span>
        </>
      )}
    </div>
  );
}

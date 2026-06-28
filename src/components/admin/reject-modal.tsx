import { useEffect, useState } from "react";
import { X } from "lucide-react";

export function RejectModal({
  open,
  title,
  confirmLabel,
  variant,
  onClose,
  onConfirm,
}: {
  open: boolean;
  title: string;
  confirmLabel: string;
  variant: "destructive" | "warning";
  onClose: () => void;
  onConfirm: (note: string) => void;
}) {
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!open) setNote("");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const confirmStyle =
    variant === "destructive"
      ? "bg-[var(--destructive)] text-white hover:opacity-90"
      : "bg-[var(--warning)] text-[var(--warning-foreground)] hover:opacity-90";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md overflow-hidden rounded-xl border border-border bg-surface shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h3 className="text-sm font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-5 py-4">
          <label className="text-xs font-medium text-muted-foreground">
            Reason / note
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
            autoFocus
            placeholder="Share a clear reason so the submitter knows what to fix…"
            className="mt-2 w-full resize-none rounded-md border border-border bg-background/60 p-3 text-sm placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-border bg-background/30 px-5 py-3">
          <button
            onClick={onClose}
            className="inline-flex h-8 items-center rounded-md border border-border px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-white/[0.05] hover:text-white"
          >
            Cancel
          </button>
          <button
            disabled={!note.trim()}
            onClick={() => onConfirm(note.trim())}
            className={`inline-flex h-8 items-center rounded-md px-3 text-xs font-semibold transition-opacity disabled:cursor-not-allowed disabled:opacity-40 ${confirmStyle}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Eye,
  ExternalLink,
  RefreshCw,
  XCircle,
} from "lucide-react";
import {
  formatRelative,
  typeLabel,
  useModeration,
  type StatusEvent,
} from "@/lib/moderation-store";
import { RejectModal } from "@/components/admin/reject-modal";
import { StatusBadge } from "./_admin.approvals.index";

export const Route = createFileRoute("/_admin/approvals/$id")({
  component: ReviewItem,
});

function ReviewItem() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { items, approve, reject, requestChanges } = useModeration();
  const item = items.find((i) => i.id === id);
  const [modal, setModal] = useState<{ open: boolean; mode: "reject" | "changes" }>({
    open: false,
    mode: "reject",
  });

  if (!item) {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="surface-card p-8 text-center">
          <h2 className="text-sm font-semibold">Item not found</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            It may have been removed from the queue.
          </p>
          <Link
            to="/approvals"
            className="mt-4 inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
          >
            <ArrowLeft className="h-3 w-3" /> Back to queue
          </Link>
        </div>
      </div>
    );
  }

  const handleApprove = () => {
    approve(item.id);
    toast.success(`Approved ${item.name}`);
    navigate({ to: "/approvals" });
  };

  const handleModalConfirm = (note: string) => {
    if (modal.mode === "reject") {
      reject(item.id, note);
      toast.error(`Rejected ${item.name}`);
    } else {
      requestChanges(item.id, note);
      toast(`Changes requested on ${item.name}`, { style: { color: "var(--warning)" } });
    }
    setModal({ open: false, mode: "reject" });
    navigate({ to: "/approvals" });
  };

  const isPending = item.status === "pending";

  return (
    <div className="mx-auto max-w-7xl space-y-4">
      <Link
        to="/approvals"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-white"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to queue
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        {/* Left: details */}
        <div className="space-y-4">
          <div className="surface-card overflow-hidden">
            <div className="relative border-b border-border p-6">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-40 opacity-50"
                style={{ background: "var(--gradient-glow)" }}
              />
              <div className="relative flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-[var(--primary-glow)] text-2xl font-bold text-white shadow-[0_8px_24px_-8px_rgba(124,58,237,0.6)]">
                  {item.type === "content" && item.thumbnail
                    ? item.thumbnail
                    : item.name
                        .split(" ")
                        .map((s) => s[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-bold tracking-tight">{item.name}</h2>
                    <StatusBadge status={item.status} />
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="rounded-full bg-white/[0.05] px-2 py-0.5 ring-1 ring-white/10">
                      {typeLabel(item.type)}
                    </span>
                    <span>·</span>
                    <span>Submitted by {item.submittedBy}</span>
                    <span>·</span>
                    <span>{formatRelative(item.submittedAt)}</span>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Type-specific details */}
            <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2">
              {item.type === "creator" && (
                <>
                  <DetailCell label="Niche" value={item.niche ?? "—"} />
                  <DetailCell label="Followers" value={item.followers ?? "—"} />
                  <DetailCell
                    label="Social Profiles"
                    full
                    value={
                      <div className="mt-1 space-y-1.5">
                        {item.socials?.map((s) => (
                          <a
                            key={s.handle}
                            href="#"
                            className="flex items-center justify-between rounded-md border border-border bg-background/40 px-3 py-2 text-sm transition-colors hover:border-primary/40 hover:bg-primary/[0.05]"
                          >
                            <span className="text-muted-foreground">{s.platform}</span>
                            <span className="font-medium text-white">{s.handle}</span>
                            <ExternalLink className="h-3 w-3 text-muted-foreground" />
                          </a>
                        ))}
                      </div>
                    }
                  />
                </>
              )}
              {item.type === "campaign" && (
                <>
                  <DetailCell label="Brand" value={item.brand ?? "—"} />
                  <DetailCell label="Budget" value={item.budget ?? "—"} />
                </>
              )}
              {item.type === "content" && (
                <DetailCell
                  label="Media Preview"
                  full
                  value={
                    <div className="mt-2 flex aspect-video items-center justify-center rounded-lg border border-dashed border-border bg-background/40 text-5xl">
                      {item.thumbnail ?? "🎬"}
                    </div>
                  }
                />
              )}
            </div>
          </div>
        </div>

        {/* Right: actions + history */}
        <div className="space-y-4">
          <div className="surface-card p-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Moderator Actions
            </h3>
            <div className="mt-4 space-y-2">
              <button
                disabled={!isPending}
                onClick={handleApprove}
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[var(--success)] text-sm font-semibold text-[var(--success-foreground)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <CheckCircle2 className="h-4 w-4" /> Approve
              </button>
              <button
                disabled={!isPending}
                onClick={() => setModal({ open: true, mode: "reject" })}
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[var(--destructive)] text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <XCircle className="h-4 w-4" /> Reject
              </button>
              <button
                disabled={!isPending}
                onClick={() => setModal({ open: true, mode: "changes" })}
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[var(--warning)]/40 text-sm font-semibold text-[var(--warning)] transition-colors hover:bg-[var(--warning)]/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <RefreshCw className="h-4 w-4" /> Request Changes
              </button>
            </div>
            {!isPending && (
              <p className="mt-3 text-center text-xs text-muted-foreground">
                This item has already been {item.status.replace("_", " ")}.
              </p>
            )}
          </div>

          <div className="surface-card p-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Status History
            </h3>
            <ol className="mt-4 space-y-0">
              {item.history.map((evt, idx) => (
                <TimelineEvent
                  key={`${evt.status}-${evt.at}-${idx}`}
                  event={evt}
                  last={idx === item.history.length - 1}
                />
              ))}
            </ol>
          </div>
        </div>
      </div>

      <RejectModal
        open={modal.open}
        title={modal.mode === "reject" ? "Reject item" : "Request changes"}
        confirmLabel={modal.mode === "reject" ? "Confirm rejection" : "Send request"}
        variant={modal.mode === "reject" ? "destructive" : "warning"}
        onClose={() => setModal({ open: false, mode: "reject" })}
        onConfirm={handleModalConfirm}
      />
    </div>
  );
}

function DetailCell({
  label,
  value,
  full,
}: {
  label: string;
  value: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={`bg-surface p-5 ${full ? "sm:col-span-2" : ""}`}>
      <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      {typeof value === "string" ? (
        <div className="mt-1 text-sm font-medium text-white">{value}</div>
      ) : (
        value
      )}
    </div>
  );
}

function TimelineEvent({ event, last }: { event: StatusEvent; last: boolean }) {
  const meta = {
    submitted: { icon: Clock, color: "var(--muted-foreground)", label: "Submitted" },
    under_review: { icon: Eye, color: "var(--primary)", label: "Under Review" },
    pending: { icon: Clock, color: "var(--warning)", label: "Pending" },
    approved: { icon: CheckCircle2, color: "var(--success)", label: "Approved" },
    rejected: { icon: XCircle, color: "var(--destructive)", label: "Rejected" },
    changes_requested: {
      icon: RefreshCw,
      color: "var(--warning)",
      label: "Changes Requested",
    },
  }[event.status];
  const Icon = meta.icon;

  return (
    <li className="relative flex gap-3 pb-4 last:pb-0">
      {!last && (
        <div
          aria-hidden
          className="absolute left-[11px] top-6 bottom-0 w-px bg-border"
        />
      )}
      <div
        className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
        style={{
          backgroundColor: `color-mix(in oklab, ${meta.color} 20%, transparent)`,
          color: meta.color,
        }}
      >
        <Icon className="h-3 w-3" />
      </div>
      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex items-center justify-between gap-2 text-sm">
          <span className="font-medium text-white">{meta.label}</span>
          <span className="text-xs text-muted-foreground">{formatRelative(event.at)}</span>
        </div>
        {event.by && (
          <div className="text-xs text-muted-foreground">by {event.by}</div>
        )}
        {event.note && (
          <div className="mt-1 rounded-md border border-border bg-background/40 p-2 text-xs text-muted-foreground">
            {event.note}
          </div>
        )}
      </div>
    </li>
  );
}

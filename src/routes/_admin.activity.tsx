import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CheckCircle2, RefreshCw, XCircle } from "lucide-react";
import { formatRelative, useModeration, type ItemType } from "@/lib/moderation-store";

export const Route = createFileRoute("/_admin/activity")({
  component: ActivityLog,
});

function ActivityLog() {
  const { activity } = useModeration();
  const [admin, setAdmin] = useState<string>("all");
  const [kind, setKind] = useState<string>("all");
  const [itype, setItype] = useState<string>("all");

  const admins = useMemo(
    () => Array.from(new Set(activity.map((a) => a.admin))),
    [activity],
  );

  const filtered = useMemo(
    () =>
      activity.filter((a) => {
        if (admin !== "all" && a.admin !== admin) return false;
        if (kind !== "all" && a.kind !== kind) return false;
        if (itype !== "all" && a.itemType !== itype) return false;
        return true;
      }),
    [activity, admin, kind, itype],
  );

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <div className="surface-card flex flex-wrap items-center gap-3 p-3">
        <Filter value={admin} onChange={setAdmin} label="Admin">
          <option value="all">All admins</option>
          {admins.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </Filter>
        <Filter value={kind} onChange={setKind} label="Action">
          <option value="all">All actions</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="changes_requested">Changes requested</option>
        </Filter>
        <Filter value={itype} onChange={setItype} label="Type">
          <option value="all">All types</option>
          <option value="creator">Creators</option>
          <option value="campaign">Campaigns</option>
          <option value="content">Content</option>
        </Filter>
        <div className="ml-auto text-xs text-muted-foreground">
          {filtered.length} entr{filtered.length === 1 ? "y" : "ies"}
        </div>
      </div>

      <div className="surface-card">
        <ul className="divide-y divide-border">
          {filtered.length === 0 && (
            <li className="px-6 py-12 text-center text-sm text-muted-foreground">
              No activity matches these filters.
            </li>
          )}
          {filtered.map((a) => {
            const Icon =
              a.kind === "approved"
                ? CheckCircle2
                : a.kind === "rejected"
                  ? XCircle
                  : RefreshCw;
            const color =
              a.kind === "approved"
                ? "var(--success)"
                : a.kind === "rejected"
                  ? "var(--destructive)"
                  : "var(--warning)";
            const initials = a.admin
              .split(" ")
              .map((s) => s[0])
              .join("")
              .slice(0, 2);
            return (
              <li
                key={a.id}
                className="flex items-start gap-4 px-6 py-4 transition-colors hover:bg-primary/[0.04]"
              >
                <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/40 to-[var(--primary-glow)]/40 text-xs font-bold text-white ring-1 ring-white/10">
                  {initials}
                  <span
                    className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full ring-2 ring-surface"
                    style={{ backgroundColor: color }}
                  >
                    <Icon className="h-2.5 w-2.5 text-black" />
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm">
                    <span className="font-medium text-white">{a.admin}</span>{" "}
                    <span className="text-muted-foreground">{a.action.toLowerCase()}:</span>{" "}
                    <span className="font-medium text-white">{a.itemName}</span>
                  </div>
                  {a.note && (
                    <div className="mt-1 text-xs italic text-muted-foreground">
                      "{a.note}"
                    </div>
                  )}
                </div>
                <div className="shrink-0 whitespace-nowrap text-xs text-muted-foreground">
                  {formatRelative(a.at)}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function Filter({
  value,
  onChange,
  label,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex items-center gap-2 text-xs text-muted-foreground">
      <span className="font-medium uppercase tracking-wider">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 rounded-md border border-border bg-background/60 px-2 text-xs text-white focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
      >
        {children}
      </select>
    </label>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Timer,
  XCircle,
} from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatRelative, typeLabel, useModeration } from "@/lib/moderation-store";

export const Route = createFileRoute("/_admin/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { items, activity } = useModeration();

  const stats = useMemo(() => {
    const today = new Date();
    const sameDay = (iso: string) => {
      const d = new Date(iso);
      return (
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
      );
    };
    return {
      pending: items.filter((i) => i.status === "pending").length,
      approvedToday: activity.filter((a) => a.kind === "approved" && sameDay(a.at)).length,
      rejectedToday: activity.filter((a) => a.kind === "rejected" && sameDay(a.at)).length,
      avgReview: "1h 24m",
    };
  }, [items, activity]);

  const breakdown = useMemo(() => {
    const counts = { creator: 0, campaign: 0, content: 0 };
    items.filter((i) => i.status === "pending").forEach((i) => counts[i.type]++);
    return [
      { name: "Creators", value: counts.creator, color: "#7C3AED" },
      { name: "Campaigns", value: counts.campaign, color: "#4F2D8A" },
      { name: "Content", value: counts.content, color: "#A78BFA" },
    ];
  }, [items]);

  const totalPending = breakdown.reduce((s, b) => s + b.value, 0);
  const recent = activity.slice(0, 5);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          accent="purple"
          icon={<Clock className="h-4 w-4" />}
          label="Total Pending"
          value={stats.pending}
          sub="Awaiting review"
        />
        <StatCard
          accent="green"
          icon={<CheckCircle2 className="h-4 w-4" />}
          label="Approved Today"
          value={stats.approvedToday}
          sub="Across all types"
        />
        <StatCard
          accent="red"
          icon={<XCircle className="h-4 w-4" />}
          label="Rejected Today"
          value={stats.rejectedToday}
          sub="With reasons"
        />
        <StatCard
          accent="amber"
          icon={<Timer className="h-4 w-4" />}
          label="Avg. Review Time"
          value={stats.avgReview}
          sub="Last 7 days"
          rawValue
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Recent activity */}
        <div className="surface-card lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="text-sm font-semibold">Recent Activity</h2>
            <Link
              to="/activity"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-primary"
            >
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {recent.map((a) => (
              <li
                key={a.id}
                className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-primary/[0.04]"
              >
                <div
                  className={[
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white",
                    a.kind === "approved"
                      ? "bg-[color-mix(in_oklab,var(--success)_30%,transparent)] ring-1 ring-[var(--success)]/40"
                      : a.kind === "rejected"
                        ? "bg-[color-mix(in_oklab,var(--destructive)_30%,transparent)] ring-1 ring-[var(--destructive)]/40"
                        : "bg-[color-mix(in_oklab,var(--warning)_30%,transparent)] ring-1 ring-[var(--warning)]/40",
                  ].join(" ")}
                >
                  {a.admin
                    .split(" ")
                    .map((s) => s[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm">
                    <span className="font-medium text-white">{a.admin}</span>{" "}
                    <span className="text-muted-foreground">{a.action.toLowerCase()}:</span>{" "}
                    <span className="font-medium">{a.itemName}</span>
                  </div>
                  {a.note && (
                    <div className="mt-0.5 truncate text-xs text-muted-foreground">{a.note}</div>
                  )}
                </div>
                <div className="shrink-0 text-xs text-muted-foreground">
                  {formatRelative(a.at)}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Breakdown chart */}
        <div className="surface-card">
          <div className="border-b border-border px-6 py-4">
            <h2 className="text-sm font-semibold">Pending by Type</h2>
            <p className="mt-1 text-xs text-muted-foreground">Current queue breakdown</p>
          </div>
          <div className="px-6 py-5">
            <div className="relative mx-auto h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <Pie
                    data={breakdown}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius={64}
                    outerRadius={92}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {breakdown.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      fontSize: 12,
                      color: "#fff",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                    }}
                    itemStyle={{ color: "#fff" }}
                    labelStyle={{ color: "#fff" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold leading-none">{totalPending}</div>
                <div className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Pending
                </div>
              </div>
            </div>
            <ul className="mt-4 space-y-2">
              {breakdown.map((b) => (
                <li key={b.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: b.color }}
                    />
                    {b.name}
                  </span>
                  <span className="font-medium text-white">{b.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  accent,
  icon,
  label,
  value,
  sub,
  rawValue,
}: {
  accent: "purple" | "green" | "red" | "amber";
  icon: React.ReactNode;
  label: string;
  value: number | string;
  sub: string;
  rawValue?: boolean;
}) {
  const accentColor = {
    purple: "var(--primary)",
    green: "var(--success)",
    red: "var(--destructive)",
    amber: "var(--warning)",
  }[accent];

  return (
    <div
      className="surface-card relative overflow-hidden p-5"
      style={{ borderLeft: `3px solid ${accentColor}` }}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-20 blur-2xl"
        style={{ backgroundColor: accentColor }}
      />
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-medium uppercase tracking-wider">{label}</span>
        <span style={{ color: accentColor }}>{icon}</span>
      </div>
      <div className="mt-3 text-3xl font-bold tracking-tight">
        {rawValue ? value : value}
      </div>
      <div className="mt-1 text-xs text-muted-foreground">{sub}</div>
    </div>
  );
}

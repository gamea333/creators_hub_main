import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Check,
  ChevronDown,
  Inbox,
  Search,
  X,
} from "lucide-react";
import {
  formatRelative,
  typeLabel,
  useModeration,
  type ItemStatus,
  type ItemType,
} from "@/lib/moderation-store";
import { RejectModal } from "@/components/admin/reject-modal";

export const Route = createFileRoute("/_admin/approvals/")({
  component: ApprovalsQueue,
});

const TYPE_FILTERS: { label: string; value: "all" | ItemType }[] = [
  { label: "All Types", value: "all" },
  { label: "Creators", value: "creator" },
  { label: "Campaigns", value: "campaign" },
  { label: "Content", value: "content" },
];

const STATUS_FILTERS: { label: string; value: "all" | ItemStatus }[] = [
  { label: "All Statuses", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

function ApprovalsQueue() {
  const { items, approve, reject, requestChanges, bulk } = useModeration();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [type, setType] = useState<"all" | ItemType>("all");
  const [status, setStatus] = useState<"all" | ItemStatus>("pending");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [modal, setModal] = useState<{
    open: boolean;
    mode: "reject" | "changes" | "bulk-reject";
    ids: string[];
  }>({ open: false, mode: "reject", ids: [] });

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter((i) => {
      if (type !== "all" && i.type !== type) return false;
      if (status !== "all" && i.status !== status) return false;
      if (needle && !`${i.name} ${i.submittedBy}`.toLowerCase().includes(needle)) return false;
      return true;
    });
  }, [items, q, type, status]);

  const allChecked = filtered.length > 0 && filtered.every((i) => selected.has(i.id));
  const toggleAll = () => {
    if (allChecked) setSelected(new Set());
    else setSelected(new Set(filtered.map((i) => i.id)));
  };
  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleApprove = (id: string, name: string) => {
    approve(id);
    setSelected((p) => {
      const n = new Set(p);
      n.delete(id);
      return n;
    });
    toast.success(`Approved ${name}`);
  };

  const handleRejectConfirm = (note: string) => {
    if (modal.mode === "bulk-reject") {
      bulk(modal.ids, "reject", note);
      toast.error(`Rejected ${modal.ids.length} items`);
      setSelected(new Set());
    } else if (modal.mode === "reject") {
      modal.ids.forEach((id) => reject(id, note));
      toast.error(`Rejected ${modal.ids.length} item${modal.ids.length > 1 ? "s" : ""}`);
    } else {
      modal.ids.forEach((id) => requestChanges(id, note));
      toast(`Changes requested on ${modal.ids.length} item${modal.ids.length > 1 ? "s" : ""}`, {
        style: { color: "var(--warning)" },
      });
    }
    setSelected(new Set());
    setModal({ open: false, mode: "reject", ids: [] });
  };

  const bulkApprove = () => {
    const ids = Array.from(selected);
    bulk(ids, "approve");
    toast.success(`Approved ${ids.length} items`);
    setSelected(new Set());
  };

  return (
    <div className="mx-auto max-w-7xl space-y-4">
      {/* Filter bar */}
      <div className="surface-card flex flex-wrap items-center gap-3 p-3">
        <div className="relative min-w-[240px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name or submitter…"
            className="h-9 w-full rounded-md border border-border bg-background/60 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <FilterSelect
          value={type}
          onChange={(v) => setType(v as typeof type)}
          options={TYPE_FILTERS}
        />
        <FilterSelect
          value={status}
          onChange={(v) => setStatus(v as typeof status)}
          options={STATUS_FILTERS}
        />
      </div>

      {/* Table */}
      <div className="surface-card overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-white/[0.02] text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="w-10 px-4 py-3">
                    <Checkbox checked={allChecked} onChange={toggleAll} />
                  </th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Submitted By</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => navigate({ to: "/approvals/$id", params: { id: item.id } })}
                    className="cursor-pointer border-b border-border last:border-0 transition-colors hover:bg-primary/[0.05]"
                  >
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selected.has(item.id)}
                        onChange={() => toggleOne(item.id)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-white">{item.name}</div>
                      <div className="mt-0.5 line-clamp-1 max-w-md text-xs text-muted-foreground">
                        {item.description}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <TypeBadge type={item.type} />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{item.submittedBy}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatRelative(item.submittedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <IconBtn
                          variant="approve"
                          disabled={item.status !== "pending"}
                          onClick={() => handleApprove(item.id, item.name)}
                          label="Approve"
                        >
                          <Check className="h-4 w-4" />
                        </IconBtn>
                        <IconBtn
                          variant="reject"
                          disabled={item.status !== "pending"}
                          onClick={() =>
                            setModal({ open: true, mode: "reject", ids: [item.id] })
                          }
                          label="Reject"
                        >
                          <X className="h-4 w-4" />
                        </IconBtn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="fixed inset-x-0 bottom-6 z-30 mx-auto flex max-w-2xl items-center justify-between rounded-xl border border-border bg-surface/95 px-4 py-3 shadow-[0_20px_60px_-20px_rgba(124,58,237,0.5)] backdrop-blur-md md:left-[240px] md:right-0">
          <div className="text-sm">
            <span className="font-semibold text-white">{selected.size}</span>{" "}
            <span className="text-muted-foreground">
              item{selected.size > 1 ? "s" : ""} selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={bulkApprove}
              className="inline-flex h-8 items-center gap-1.5 rounded-md bg-[var(--success)] px-3 text-xs font-semibold text-[var(--success-foreground)] transition-opacity hover:opacity-90"
            >
              <Check className="h-3.5 w-3.5" /> Approve All
            </button>
            <button
              onClick={() =>
                setModal({ open: true, mode: "bulk-reject", ids: Array.from(selected) })
              }
              className="inline-flex h-8 items-center gap-1.5 rounded-md bg-[var(--destructive)] px-3 text-xs font-semibold text-white transition-opacity hover:opacity-90"
            >
              <X className="h-3.5 w-3.5" /> Reject All
            </button>
            <button
              onClick={() =>
                setModal({ open: true, mode: "changes", ids: Array.from(selected) })
              }
              className="inline-flex h-8 items-center rounded-md border border-[var(--warning)]/40 px-3 text-xs font-semibold text-[var(--warning)] transition-colors hover:bg-[var(--warning)]/10"
            >
              Request Changes
            </button>
            <button
              onClick={() => setSelected(new Set())}
              className="inline-flex h-8 items-center rounded-md px-2 text-xs text-muted-foreground transition-colors hover:text-white"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      <RejectModal
        open={modal.open}
        title={
          modal.mode === "changes"
            ? "Request changes"
            : modal.mode === "bulk-reject"
              ? `Reject ${modal.ids.length} items`
              : "Reject item"
        }
        confirmLabel={modal.mode === "changes" ? "Send request" : "Confirm rejection"}
        variant={modal.mode === "changes" ? "warning" : "destructive"}
        onClose={() => setModal({ open: false, mode: "reject", ids: [] })}
        onConfirm={handleRejectConfirm}
      />
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 appearance-none rounded-md border border-border bg-background/60 pl-3 pr-8 text-sm text-white focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-surface">
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

function Checkbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className={[
        "flex h-4 w-4 items-center justify-center rounded border transition-colors",
        checked
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background/60 hover:border-primary/50",
      ].join(" ")}
      aria-checked={checked}
      role="checkbox"
    >
      {checked && <Check className="h-3 w-3" />}
    </button>
  );
}

function TypeBadge({ type }: { type: ItemType }) {
  const map = {
    creator: "bg-[#7C3AED]/15 text-[#A78BFA] ring-1 ring-[#7C3AED]/30",
    campaign: "bg-[#4F2D8A]/20 text-[#C4B5FD] ring-1 ring-[#4F2D8A]/40",
    content: "bg-white/[0.05] text-muted-foreground ring-1 ring-white/10",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${map[type]}`}
    >
      {typeLabel(type)}
    </span>
  );
}

export function StatusBadge({ status }: { status: ItemStatus }) {
  const map: Record<ItemStatus, string> = {
    pending:
      "bg-[color-mix(in_oklab,var(--warning)_18%,transparent)] text-[var(--warning)] ring-1 ring-[var(--warning)]/30",
    approved:
      "bg-[color-mix(in_oklab,var(--success)_18%,transparent)] text-[var(--success)] ring-1 ring-[var(--success)]/30",
    rejected:
      "bg-[color-mix(in_oklab,var(--destructive)_18%,transparent)] text-[var(--destructive)] ring-1 ring-[var(--destructive)]/30",
    changes_requested:
      "bg-[color-mix(in_oklab,var(--warning)_18%,transparent)] text-[var(--warning)] ring-1 ring-[var(--warning)]/30",
  };
  const label =
    status === "changes_requested"
      ? "Changes Req."
      : status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${map[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

function IconBtn({
  children,
  variant,
  disabled,
  onClick,
  label,
}: {
  children: React.ReactNode;
  variant: "approve" | "reject";
  disabled?: boolean;
  onClick: () => void;
  label: string;
}) {
  const styles =
    variant === "approve"
      ? "text-[var(--success)] hover:bg-[var(--success)]/10"
      : "text-[var(--destructive)] hover:bg-[var(--destructive)]/10";
  return (
    <button
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-md border border-transparent transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${styles}`}
    >
      {children}
    </button>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-background/60">
        <Inbox className="h-7 w-7 text-muted-foreground" />
        <div className="absolute inset-0 rounded-2xl opacity-40 blur-2xl bg-primary" />
      </div>
      <h3 className="text-sm font-semibold">No items match your filters</h3>
      <p className="mt-1 max-w-xs text-xs text-muted-foreground">
        Try adjusting type, status, or search terms to find what you're looking for.
      </p>
    </div>
  );
}

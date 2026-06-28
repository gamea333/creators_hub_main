import { Link, Outlet, createFileRoute, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import {
  Bell,
  CheckCircle2,
  LayoutDashboard,
  ListChecks,
  LogOut,
  ScrollText,
  Settings,
  User,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ModerationProvider } from "@/lib/moderation-store";

export const Route = createFileRoute("/_admin")({
  component: AdminLayout,
});

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/approvals", label: "Approvals Queue", icon: ListChecks, exact: false },
  { to: "/activity", label: "Activity Log", icon: ScrollText, exact: true },
] as const;

function pageTitle(pathname: string): string {
  if (pathname.startsWith("/dashboard")) return "Dashboard";
  if (pathname.startsWith("/approvals/")) return "Review Item";
  if (pathname.startsWith("/approvals")) return "Approvals Queue";
  if (pathname.startsWith("/activity")) return "Activity Log";
  return "CreatorsMela Admin";
}

type Notification = {
  id: string;
  title: string;
  body: string;
  time: string;
  kind: "approval" | "rejection" | "system";
  unread: boolean;
};

const initialNotifications: Notification[] = [
  {
    id: "n1",
    title: "New creator submission",
    body: "Ananya Reddy submitted profile for review",
    time: "2m ago",
    kind: "approval",
    unread: true,
  },
  {
    id: "n2",
    title: "Campaign awaiting approval",
    body: "Mamaearth × Diwali Glow campaign needs review",
    time: "18m ago",
    kind: "approval",
    unread: true,
  },
  {
    id: "n3",
    title: "Content rejected",
    body: "Rohan Mehta's reel was flagged by auto-moderation",
    time: "1h ago",
    kind: "rejection",
    unread: true,
  },
  {
    id: "n4",
    title: "Weekly digest ready",
    body: "Your moderation report for this week is available",
    time: "Yesterday",
    kind: "system",
    unread: false,
  },
];

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleLogout = () => {
    toast.success("Signed out successfully");
    setProfileOpen(false);
    navigate({ to: "/" });
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    toast.success("All notifications marked as read");
  };

  return (
    <ModerationProvider>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="fixed inset-y-0 left-0 z-20 hidden w-[240px] flex-col border-r border-sidebar-border bg-sidebar md:flex">
          <Link to="/dashboard" className="flex h-16 items-center px-5 leading-none">
            <div>
              <div className="text-[1.5rem] font-extrabold tracking-tight text-white">
                Creators
              </div>
              <div className="mt-1 pl-0.5 text-[10px] font-medium uppercase tracking-[0.4em] text-muted-foreground">
                Mela <span className="ml-1 text-primary">· Admin</span>
              </div>
            </div>
          </Link>

          <nav className="flex-1 px-3 py-4">
            <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Moderation
            </div>
            <ul className="space-y-1">
              {navItems.map((item) => {
                const active = item.exact
                  ? pathname === item.to
                  : pathname.startsWith(item.to);
                const Icon = item.icon;
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className={[
                        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                        active
                          ? "bg-primary/15 text-white shadow-[inset_0_0_0_1px_rgba(124,58,237,0.35)]"
                          : "text-muted-foreground hover:bg-white/[0.04] hover:text-white",
                      ].join(" ")}
                    >
                      <Icon
                        className={[
                          "h-4 w-4 transition-colors",
                          active ? "text-primary" : "text-muted-foreground group-hover:text-white",
                        ].join(" ")}
                      />
                      <span className="font-medium">{item.label}</span>
                      {active && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="border-t border-sidebar-border p-3 space-y-2">
            <div className="flex items-center gap-3 rounded-lg px-2 py-2 text-xs text-muted-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[var(--primary-glow)] text-xs font-bold text-white">
                SA
              </div>
              <div className="leading-tight">
                <div className="font-medium text-white">Sneha Admin</div>
                <div>moderator</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="flex w-full flex-1 flex-col md:pl-[240px]">
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-background/70 px-6 backdrop-blur-md">
            <h1 className="text-lg font-semibold tracking-tight">{pageTitle(pathname)}</h1>
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <Popover open={notifOpen} onOpenChange={setNotifOpen}>
                <PopoverTrigger asChild>
                  <button
                    className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground transition-colors hover:bg-[var(--surface-hover)] hover:text-white"
                    aria-label="Notifications"
                  >
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-white shadow-[0_0_6px_var(--primary)]">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  sideOffset={8}
                  className="w-[360px] border-border bg-surface p-0"
                >
                  <div className="flex items-center justify-between border-b border-border px-4 py-3">
                    <div>
                      <div className="text-sm font-semibold text-white">Notifications</div>
                      <div className="text-[11px] text-muted-foreground">
                        {unreadCount} unread
                      </div>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-xs font-medium text-primary hover:text-[var(--primary-glow)]"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <ul className="max-h-[360px] divide-y divide-border overflow-y-auto">
                    {notifications.map((n) => (
                      <li
                        key={n.id}
                        className={[
                          "flex gap-3 px-4 py-3 transition-colors hover:bg-primary/[0.04]",
                          n.unread ? "bg-primary/[0.03]" : "",
                        ].join(" ")}
                      >
                        <div
                          className={[
                            "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                            n.kind === "approval"
                              ? "bg-[color-mix(in_oklab,var(--success)_25%,transparent)] text-[var(--success)]"
                              : n.kind === "rejection"
                                ? "bg-[color-mix(in_oklab,var(--destructive)_25%,transparent)] text-[var(--destructive)]"
                                : "bg-primary/20 text-primary",
                          ].join(" ")}
                        >
                          {n.kind === "approval" ? (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          ) : n.kind === "rejection" ? (
                            <XCircle className="h-3.5 w-3.5" />
                          ) : (
                            <Bell className="h-3.5 w-3.5" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <div className="truncate text-sm font-medium text-white">
                              {n.title}
                            </div>
                            {n.unread && (
                              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                            )}
                          </div>
                          <div className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                            {n.body}
                          </div>
                          <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground/70">
                            {n.time}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="border-t border-border px-4 py-2.5">
                    <Link
                      to="/activity"
                      onClick={() => setNotifOpen(false)}
                      className="block text-center text-xs font-medium text-primary hover:text-[var(--primary-glow)]"
                    >
                      View all activity
                    </Link>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Profile */}
              <Popover open={profileOpen} onOpenChange={setProfileOpen}>
                <PopoverTrigger asChild>
                  <button
                    aria-label="Profile menu"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[var(--primary-glow)] text-xs font-bold text-white ring-offset-2 ring-offset-background transition-all hover:ring-2 hover:ring-primary/50"
                  >
                    SA
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  sideOffset={8}
                  className="w-[260px] border-border bg-surface p-0"
                >
                  <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[var(--primary-glow)] text-sm font-bold text-white">
                      SA
                    </div>
                    <div className="min-w-0 leading-tight">
                      <div className="truncate text-sm font-semibold text-white">
                        Sneha Admin
                      </div>
                      <div className="truncate text-xs text-muted-foreground">
                        sneha@creatorsmela.com
                      </div>
                      <div className="mt-1 inline-flex items-center rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                        Moderator
                      </div>
                    </div>
                  </div>
                  <div className="p-1.5">
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        toast.info("Profile settings — coming soon");
                      }}
                      className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-white"
                    >
                      <User className="h-4 w-4" /> My profile
                    </button>
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        toast.info("Settings — coming soon");
                      }}
                      className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-white"
                    >
                      <Settings className="h-4 w-4" /> Account settings
                    </button>
                  </div>
                  <div className="border-t border-border p-1.5">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                    >
                      <LogOut className="h-4 w-4" /> Sign out
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </header>

          <main className="flex-1 px-6 py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </ModerationProvider>
  );
}

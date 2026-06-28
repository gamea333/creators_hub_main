import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type ItemType = "creator" | "campaign" | "content";
export type ItemStatus = "pending" | "approved" | "rejected" | "changes_requested";

export interface StatusEvent {
  status: ItemStatus | "submitted" | "under_review";
  at: string;
  note?: string;
  by?: string;
}

export interface ModerationItem {
  id: string;
  name: string;
  type: ItemType;
  submittedBy: string;
  submittedAt: string;
  status: ItemStatus;
  description: string;
  niche?: string;
  followers?: string;
  socials?: { platform: string; handle: string }[];
  brand?: string;
  budget?: string;
  mediaUrl?: string;
  thumbnail?: string;
  history: StatusEvent[];
}

export interface ActivityEntry {
  id: string;
  admin: string;
  action: string;
  itemId?: string;
  itemName: string;
  itemType: ItemType;
  at: string;
  note?: string;
  kind: "approved" | "rejected" | "changes_requested";
}

const now = Date.now();
const minutesAgo = (m: number) => new Date(now - m * 60_000).toISOString();
const hoursAgo = (h: number) => new Date(now - h * 3_600_000).toISOString();
const daysAgo = (d: number) => new Date(now - d * 86_400_000).toISOString();

const seedItems: ModerationItem[] = [
  {
    id: "i1", name: "Rahul Sharma", type: "creator", submittedBy: "rahul.sharma@gmail.com",
    submittedAt: minutesAgo(15), status: "pending",
    description: "Tech reviewer covering smartphones, laptops & wearables. Based in Bengaluru.",
    niche: "Tech", followers: "428K",
    socials: [{ platform: "Instagram", handle: "@rahul.techreview" }, { platform: "YouTube", handle: "RahulTechReview" }],
    history: [{ status: "submitted", at: minutesAgo(15) }],
  },
  {
    id: "i2", name: "Diet Coke × Priya Kapoor — Monsoon Drop", type: "campaign", submittedBy: "ops@cocacola.in",
    submittedAt: minutesAgo(42), status: "pending",
    description: "3-reel sponsored series promoting the limited monsoon edition. Talent: Priya Kapoor.",
    brand: "Coca-Cola India", budget: "₹8,50,000",
    history: [{ status: "submitted", at: minutesAgo(42) }],
  },
  {
    id: "i3", name: "Street Food Tour — Old Delhi Ep. 4", type: "content", submittedBy: "ananya.foodie@creators.in",
    submittedAt: hoursAgo(2), status: "pending",
    description: "12-minute vlog featuring chaat, kebabs & jalebi at Chandni Chowk.",
    niche: "Food", thumbnail: "🍛",
    history: [{ status: "submitted", at: hoursAgo(2) }],
  },
  {
    id: "i4", name: "Aanya Verma", type: "creator", submittedBy: "aanya.v@gmail.com",
    submittedAt: hoursAgo(4), status: "pending",
    description: "Fashion & sustainable styling. Mumbai-based, 320K Instagram following.",
    niche: "Fashion", followers: "320K",
    socials: [{ platform: "Instagram", handle: "@aanya.styled" }],
    history: [{ status: "submitted", at: hoursAgo(4) }],
  },
  {
    id: "i5", name: "Mamaearth × Skincare Routine Reel", type: "content", submittedBy: "kavya.beauty@creators.in",
    submittedAt: hoursAgo(6), status: "pending",
    description: "30-sec reel: morning skincare with Mamaearth ubtan range.",
    thumbnail: "🧴",
    history: [{ status: "submitted", at: hoursAgo(6) }],
  },
  {
    id: "i6", name: "Vikram Iyer", type: "creator", submittedBy: "vikram.fitness@gmail.com",
    submittedAt: hoursAgo(9), status: "pending",
    description: "Strength & nutrition coach. Tamil + English content.",
    niche: "Fitness", followers: "190K",
    socials: [{ platform: "Instagram", handle: "@vikram.lifts" }, { platform: "YouTube", handle: "VikramFit" }],
    history: [{ status: "submitted", at: hoursAgo(9) }],
  },
  {
    id: "i7", name: "boAt × Tech Unboxing Sprint", type: "campaign", submittedBy: "marketing@boat-lifestyle.com",
    submittedAt: hoursAgo(11), status: "pending",
    description: "8 creators, 1 week, unboxing the new Stone 1500 speaker.",
    brand: "boAt Lifestyle", budget: "₹12,00,000",
    history: [{ status: "submitted", at: hoursAgo(11) }],
  },
  {
    id: "i8", name: "Meera Joshi", type: "creator", submittedBy: "meera.j@gmail.com",
    submittedAt: hoursAgo(20), status: "approved",
    description: "Travel & lifestyle storyteller. Solo female traveler across India.",
    niche: "Travel", followers: "612K",
    socials: [{ platform: "Instagram", handle: "@meera.wanders" }],
    history: [
      { status: "submitted", at: daysAgo(1) },
      { status: "under_review", at: hoursAgo(22) },
      { status: "approved", at: hoursAgo(20), by: "Sneha Admin" },
    ],
  },
  {
    id: "i9", name: "Lakmé × Bridal Glow Campaign", type: "campaign", submittedBy: "campaigns@lakme.in",
    submittedAt: daysAgo(1), status: "approved",
    description: "Bridal season push with 5 beauty creators across Hindi belt.",
    brand: "Lakmé", budget: "₹22,00,000",
    history: [
      { status: "submitted", at: daysAgo(1) },
      { status: "approved", at: hoursAgo(18), by: "Arjun Admin" },
    ],
  },
  {
    id: "i10", name: "Festive Lehenga Haul — Reel", type: "content", submittedBy: "tanvi.style@creators.in",
    submittedAt: daysAgo(1), status: "rejected",
    description: "Reel showcasing 6 lehengas. Music license unclear.",
    thumbnail: "👗",
    history: [
      { status: "submitted", at: daysAgo(1) },
      { status: "rejected", at: hoursAgo(15), by: "Sneha Admin", note: "Background track not cleared. Please re-upload with royalty-free music." },
    ],
  },
  {
    id: "i11", name: "Karan Mehta", type: "creator", submittedBy: "karan.m@gmail.com",
    submittedAt: daysAgo(2), status: "approved",
    description: "Stand-up comedy & sketches in Hinglish.",
    niche: "Comedy", followers: "1.2M",
    socials: [{ platform: "Instagram", handle: "@karanonstage" }, { platform: "YouTube", handle: "KaranMehtaComedy" }],
    history: [
      { status: "submitted", at: daysAgo(2) },
      { status: "approved", at: daysAgo(2), by: "Arjun Admin" },
    ],
  },
  {
    id: "i12", name: "Zomato × Pre-Order Push", type: "campaign", submittedBy: "growth@zomato.com",
    submittedAt: daysAgo(2), status: "approved",
    description: "Food creators promoting weekday pre-order discounts in Tier-1 cities.",
    brand: "Zomato", budget: "₹6,50,000",
    history: [
      { status: "submitted", at: daysAgo(2) },
      { status: "approved", at: daysAgo(2), by: "Sneha Admin" },
    ],
  },
  {
    id: "i13", name: "Ishaan Roy", type: "creator", submittedBy: "ishaan.r@gmail.com",
    submittedAt: daysAgo(3), status: "rejected",
    description: "Crypto trading tips. Account verification incomplete.",
    niche: "Finance", followers: "85K",
    socials: [{ platform: "Instagram", handle: "@ishaan.crypto" }],
    history: [
      { status: "submitted", at: daysAgo(3) },
      { status: "rejected", at: daysAgo(3), by: "Arjun Admin", note: "Financial-advice creators require SEBI compliance proof." },
    ],
  },
  {
    id: "i14", name: "Nykaa Skincare Review Set", type: "content", submittedBy: "kavya.beauty@creators.in",
    submittedAt: hoursAgo(30), status: "approved",
    description: "3-part review series of Nykaa Naturals serums.",
    thumbnail: "💄",
    history: [
      { status: "submitted", at: daysAgo(2) },
      { status: "approved", at: hoursAgo(30), by: "Sneha Admin" },
    ],
  },
  {
    id: "i15", name: "Sanya Bhatia", type: "creator", submittedBy: "sanya.b@gmail.com",
    submittedAt: hoursAgo(28), status: "pending",
    description: "Home decor & DIY on a budget. Pune.",
    niche: "Lifestyle", followers: "240K",
    socials: [{ platform: "Instagram", handle: "@sanya.decor" }, { platform: "Pinterest", handle: "sanyadecor" }],
    history: [{ status: "submitted", at: hoursAgo(28) }],
  },
  {
    id: "i16", name: "Swiggy Instamart × 10-min Recipes", type: "campaign", submittedBy: "brand@swiggy.in",
    submittedAt: hoursAgo(33), status: "pending",
    description: "10 food creators, quick recipes using Instamart-only ingredients.",
    brand: "Swiggy Instamart", budget: "₹15,00,000",
    history: [{ status: "submitted", at: hoursAgo(33) }],
  },
  {
    id: "i17", name: "Mumbai Cafe Hop — Vlog", type: "content", submittedBy: "ananya.foodie@creators.in",
    submittedAt: daysAgo(4), status: "approved",
    description: "Bandra to Andheri, 5 specialty cafes in one day.",
    thumbnail: "☕",
    history: [
      { status: "submitted", at: daysAgo(4) },
      { status: "approved", at: daysAgo(3), by: "Arjun Admin" },
    ],
  },
  {
    id: "i18", name: "Devika Nair", type: "creator", submittedBy: "devika.n@gmail.com",
    submittedAt: hoursAgo(50), status: "pending",
    description: "Malayalam-language parenting & motherhood content.",
    niche: "Parenting", followers: "156K",
    socials: [{ platform: "Instagram", handle: "@devika.mom" }],
    history: [{ status: "submitted", at: hoursAgo(50) }],
  },
];

const seedActivity: ActivityEntry[] = [
  { id: "a1", admin: "Sneha Admin", action: "Approved Creator", itemName: "Meera Joshi", itemType: "creator", at: hoursAgo(20), kind: "approved" },
  { id: "a2", admin: "Arjun Admin", action: "Approved Campaign", itemName: "Lakmé × Bridal Glow Campaign", itemType: "campaign", at: hoursAgo(18), kind: "approved" },
  { id: "a3", admin: "Sneha Admin", action: "Rejected Content", itemName: "Festive Lehenga Haul — Reel", itemType: "content", at: hoursAgo(15), note: "Background track not cleared.", kind: "rejected" },
  { id: "a4", admin: "Arjun Admin", action: "Approved Creator", itemName: "Karan Mehta", itemType: "creator", at: daysAgo(2), kind: "approved" },
  { id: "a5", admin: "Sneha Admin", action: "Approved Campaign", itemName: "Zomato × Pre-Order Push", itemType: "campaign", at: daysAgo(2), kind: "approved" },
  { id: "a6", admin: "Arjun Admin", action: "Rejected Creator", itemName: "Ishaan Roy", itemType: "creator", at: daysAgo(3), note: "SEBI compliance missing.", kind: "rejected" },
  { id: "a7", admin: "Sneha Admin", action: "Approved Content", itemName: "Nykaa Skincare Review Set", itemType: "content", at: hoursAgo(30), kind: "approved" },
  { id: "a8", admin: "Arjun Admin", action: "Approved Content", itemName: "Mumbai Cafe Hop — Vlog", itemType: "content", at: daysAgo(3), kind: "approved" },
];

interface StoreCtx {
  items: ModerationItem[];
  activity: ActivityEntry[];
  approve: (id: string, note?: string) => void;
  reject: (id: string, note: string) => void;
  requestChanges: (id: string, note: string) => void;
  bulk: (ids: string[], action: "approve" | "reject" | "changes", note?: string) => void;
}

const Ctx = createContext<StoreCtx | null>(null);

export function ModerationProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ModerationItem[]>(seedItems);
  const [activity, setActivity] = useState<ActivityEntry[]>(seedActivity);

  const value = useMemo<StoreCtx>(() => {
    const apply = (id: string, status: ItemStatus, kind: ActivityEntry["kind"], actionLabel: string, note?: string) => {
      let snapshot: ModerationItem | undefined;
      setItems((prev) =>
        prev.map((it) => {
          if (it.id !== id) return it;
          snapshot = it;
          return {
            ...it,
            status,
            history: [...it.history, { status, at: new Date().toISOString(), by: "You", note }],
          };
        }),
      );
      if (snapshot) {
        const item = snapshot;
        setActivity((prev) => [
          {
            id: `a-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            admin: "You",
            action: `${actionLabel} ${item.type.charAt(0).toUpperCase() + item.type.slice(1)}`,
            itemId: id,
            itemName: item.name,
            itemType: item.type,
            at: new Date().toISOString(),
            note,
            kind,
          },
          ...prev,
        ]);
      }
    };

    return {
      items,
      activity,
      approve: (id, note) => apply(id, "approved", "approved", "Approved", note),
      reject: (id, note) => apply(id, "rejected", "rejected", "Rejected", note),
      requestChanges: (id, note) => apply(id, "changes_requested", "changes_requested", "Requested changes on", note),
      bulk: (ids, action, note) => {
        ids.forEach((id) => {
          if (action === "approve") apply(id, "approved", "approved", "Approved", note);
          else if (action === "reject") apply(id, "rejected", "rejected", "Rejected", note ?? "Bulk rejection");
          else apply(id, "changes_requested", "changes_requested", "Requested changes on", note ?? "Bulk request");
        });
      },
    };
  }, [items, activity]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useModeration() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useModeration must be used inside ModerationProvider");
  return ctx;
}

export function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export function typeLabel(t: ItemType) {
  return t === "creator" ? "Creator" : t === "campaign" ? "Campaign" : "Content";
}

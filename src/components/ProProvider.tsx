"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

type Plan = "free" | "pro";

interface Bookmark {
  slug: string;
  title: string;
  emoji: string;
  addedAt: string;
}

interface ReadingListItem {
  slug: string;
  title: string;
  emoji: string;
  addedAt: string;
}

interface ProContextType {
  plan: Plan;
  setPlan: (plan: Plan) => void;
  isPro: boolean;
  // Bookmarks (Pro feature)
  bookmarks: Bookmark[];
  addBookmark: (slug: string, title: string, emoji: string) => void;
  removeBookmark: (slug: string) => void;
  isBookmarked: (slug: string) => boolean;
  // Reading list (Pro feature)
  readingList: ReadingListItem[];
  addToReadingList: (slug: string, title: string, emoji: string) => void;
  removeFromReadingList: (slug: string) => void;
  isInReadingList: (slug: string) => boolean;
  // API key (Pro feature)
  apiKey: string | null;
  generateApiKey: () => void;
}

const ProContext = createContext<ProContextType>({
  plan: "free",
  setPlan: () => {},
  isPro: false,
  bookmarks: [],
  addBookmark: () => {},
  removeBookmark: () => {},
  isBookmarked: () => false,
  readingList: [],
  addToReadingList: () => {},
  removeFromReadingList: () => {},
  isInReadingList: () => false,
  apiKey: null,
  generateApiKey: () => {},
});

export function usePro() {
  return useContext(ProContext);
}

function generateRandomKey(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const segments = [8, 4, 4, 12];
  return "moltiki_" + segments
    .map((len) =>
      Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
    )
    .join("-");
}

export function ProProvider({ children }: { children: React.ReactNode }) {
  const [plan, setPlanState] = useState<Plan>("free");
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [readingList, setReadingList] = useState<ReadingListItem[]>([]);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedPlan = localStorage.getItem("molt-plan") as Plan | null;
    if (storedPlan === "pro" || storedPlan === "free") setPlanState(storedPlan);

    const storedBookmarks = localStorage.getItem("molt-bookmarks");
    if (storedBookmarks) {
      try { setBookmarks(JSON.parse(storedBookmarks)); } catch {}
    }

    const storedReadingList = localStorage.getItem("molt-reading-list");
    if (storedReadingList) {
      try { setReadingList(JSON.parse(storedReadingList)); } catch {}
    }

    const storedKey = localStorage.getItem("molt-api-key");
    if (storedKey) setApiKey(storedKey);

    setMounted(true);
  }, []);

  function setPlan(p: Plan) {
    setPlanState(p);
    localStorage.setItem("molt-plan", p);
  }

  const addBookmark = useCallback((slug: string, title: string, emoji: string) => {
    setBookmarks((prev) => {
      if (prev.some((b) => b.slug === slug)) return prev;
      const next = [...prev, { slug, title, emoji, addedAt: new Date().toISOString() }];
      localStorage.setItem("molt-bookmarks", JSON.stringify(next));
      return next;
    });
  }, []);

  const removeBookmark = useCallback((slug: string) => {
    setBookmarks((prev) => {
      const next = prev.filter((b) => b.slug !== slug);
      localStorage.setItem("molt-bookmarks", JSON.stringify(next));
      return next;
    });
  }, []);

  const isBookmarked = useCallback(
    (slug: string) => bookmarks.some((b) => b.slug === slug),
    [bookmarks]
  );

  const addToReadingList = useCallback((slug: string, title: string, emoji: string) => {
    setReadingList((prev) => {
      if (prev.some((r) => r.slug === slug)) return prev;
      const next = [...prev, { slug, title, emoji, addedAt: new Date().toISOString() }];
      localStorage.setItem("molt-reading-list", JSON.stringify(next));
      return next;
    });
  }, []);

  const removeFromReadingList = useCallback((slug: string) => {
    setReadingList((prev) => {
      const next = prev.filter((r) => r.slug !== slug);
      localStorage.setItem("molt-reading-list", JSON.stringify(next));
      return next;
    });
  }, []);

  const isInReadingList = useCallback(
    (slug: string) => readingList.some((r) => r.slug === slug),
    [readingList]
  );

  const generateApiKey = useCallback(() => {
    const key = generateRandomKey();
    setApiKey(key);
    localStorage.setItem("molt-api-key", key);
  }, []);

  if (!mounted) return <>{children}</>;

  return (
    <ProContext.Provider
      value={{
        plan,
        setPlan,
        isPro: plan === "pro",
        bookmarks,
        addBookmark,
        removeBookmark,
        isBookmarked,
        readingList,
        addToReadingList,
        removeFromReadingList,
        isInReadingList,
        apiKey,
        generateApiKey,
      }}
    >
      {children}
    </ProContext.Provider>
  );
}

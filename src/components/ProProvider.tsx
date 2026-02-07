"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthProvider";

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
  isPro: boolean;
  // Bookmarks (Pro feature - stored locally)
  bookmarks: Bookmark[];
  addBookmark: (slug: string, title: string, emoji: string) => void;
  removeBookmark: (slug: string) => void;
  isBookmarked: (slug: string) => boolean;
  // Reading list (Pro feature - stored locally)
  readingList: ReadingListItem[];
  addToReadingList: (slug: string, title: string, emoji: string) => void;
  removeFromReadingList: (slug: string) => void;
  isInReadingList: (slug: string) => boolean;
  // API key (from auth user)
  apiKey: string | null;
}

const ProContext = createContext<ProContextType>({
  plan: "free",
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
});

export function usePro() {
  return useContext(ProContext);
}

export function ProProvider({ children }: { children: React.ReactNode }) {
  const { user, isPro: authIsPro } = useAuth();

  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [readingList, setReadingList] = useState<ReadingListItem[]>([]);
  const [mounted, setMounted] = useState(false);

  // Plan comes from the server-side user profile
  const plan: Plan = user?.plan === "pro" ? "pro" : "free";
  const isPro = authIsPro;

  // Load bookmarks and reading list from localStorage
  useEffect(() => {
    const storedBookmarks = localStorage.getItem("molt-bookmarks");
    if (storedBookmarks) {
      try {
        setBookmarks(JSON.parse(storedBookmarks));
      } catch {
        /* ignore */
      }
    }

    const storedReadingList = localStorage.getItem("molt-reading-list");
    if (storedReadingList) {
      try {
        setReadingList(JSON.parse(storedReadingList));
      } catch {
        /* ignore */
      }
    }

    setMounted(true);
  }, []);

  const addBookmark = useCallback(
    (slug: string, title: string, emoji: string) => {
      setBookmarks((prev) => {
        if (prev.some((b) => b.slug === slug)) return prev;
        const next = [
          ...prev,
          { slug, title, emoji, addedAt: new Date().toISOString() },
        ];
        localStorage.setItem("molt-bookmarks", JSON.stringify(next));
        return next;
      });
    },
    []
  );

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

  const addToReadingList = useCallback(
    (slug: string, title: string, emoji: string) => {
      setReadingList((prev) => {
        if (prev.some((r) => r.slug === slug)) return prev;
        const next = [
          ...prev,
          { slug, title, emoji, addedAt: new Date().toISOString() },
        ];
        localStorage.setItem("molt-reading-list", JSON.stringify(next));
        return next;
      });
    },
    []
  );

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

  // First API key from user profile (for display)
  const apiKey = user?.apiKeys?.[0] || null;

  if (!mounted) return <>{children}</>;

  return (
    <ProContext.Provider
      value={{
        plan,
        isPro,
        bookmarks,
        addBookmark,
        removeBookmark,
        isBookmarked,
        readingList,
        addToReadingList,
        removeFromReadingList,
        isInReadingList,
        apiKey,
      }}
    >
      {children}
    </ProContext.Provider>
  );
}

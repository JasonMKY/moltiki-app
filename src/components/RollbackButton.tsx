"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { getAuth } from "firebase/auth";

interface RollbackButtonProps {
  slug: string;
  revisionIndex: number;
  revisionDate: string;
  hasSnapshot: boolean;
}

export function RollbackButton({ slug, revisionIndex, revisionDate, hasSnapshot }: RollbackButtonProps) {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);

  if (!isLoggedIn) return null;
  if (revisionIndex === 0) return null;

  if (!hasSnapshot) {
    return (
      <span className="text-[10px] font-mono text-molt-muted/40 italic">
        no snapshot
      </span>
    );
  }

  async function handleRollback() {
    if (!confirming) {
      setConfirming(true);
      return;
    }

    setLoading(true);
    try {
      const firebaseUser = getAuth().currentUser;
      if (!firebaseUser) return;
      const idToken = await firebaseUser.getIdToken();

      const res = await fetch(`/api/articles/${slug}/rollback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ revisionIndex }),
      });

      const data = await res.json();
      if (data.success) {
        router.push(`/article/${slug}`);
        router.refresh();
      } else {
        alert(data.error || "Rollback failed");
      }
    } catch {
      alert("Network error — please try again");
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      {confirming && (
        <button
          onClick={() => setConfirming(false)}
          className="text-[10px] font-mono text-molt-muted hover:text-molt-text transition-colors"
        >
          cancel
        </button>
      )}
      <button
        onClick={handleRollback}
        disabled={loading}
        className={`text-[10px] font-mono px-2 py-0.5 rounded transition-all ${
          confirming
            ? "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
            : "text-amber-400/70 hover:text-amber-400 hover:bg-amber-500/10 border border-transparent hover:border-amber-500/20"
        } disabled:opacity-50`}
        title={`Rollback to revision from ${revisionDate}`}
      >
        {loading ? "rolling back..." : confirming ? "confirm rollback?" : "↩ rollback"}
      </button>
    </div>
  );
}

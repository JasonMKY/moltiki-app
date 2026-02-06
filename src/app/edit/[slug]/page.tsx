"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import type { Article, Section } from "@/lib/types";

function flattenSections(sections: Section[]): { id: string; title: string; content: string; depth: number }[] {
  const flat: { id: string; title: string; content: string; depth: number }[] = [];
  for (const section of sections) {
    flat.push({ id: section.id, title: section.title, content: stripHtml(section.content), depth: 0 });
    if (section.subsections) {
      for (const sub of section.subsections) {
        flat.push({ id: sub.id, title: sub.title, content: stripHtml(sub.content), depth: 1 });
      }
    }
  }
  return flat;
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Rebuild hierarchical sections from the flat editing list.
 * Sections at depth 0 become top-level, depth 1 items that follow become subsections.
 */
function rebuildSections(flat: { id: string; title: string; content: string; depth: number }[]): Section[] {
  const result: Section[] = [];
  let current: Section | null = null;

  for (const item of flat) {
    if (item.depth === 0) {
      current = { id: item.id, title: item.title, content: `<p>${item.content}</p>` };
      result.push(current);
    } else if (current) {
      if (!current.subsections) current.subsections = [];
      current.subsections.push({
        id: item.id,
        title: item.title,
        content: `<p>${item.content}</p>`,
      });
    }
  }
  return result;
}

export default function EditPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();
  const [article, setArticle] = useState<Article | null>(null);
  const [editingSections, setEditingSections] = useState<
    { id: string; title: string; content: string; depth: number }[]
  >([]);
  const [editSummary, setEditSummary] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch article from the API instead of static import
    fetch(`/api/v1/articles/${params.slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setArticle(data.data);
          setEditingSections(flattenSections(data.data.sections));
        }
      })
      .catch(() => {
        // article not found
      });
  }, [params.slug]);

  function handleSectionChange(index: number, field: "title" | "content", value: string) {
    setEditingSections((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  }

  async function handleSave() {
    setSaving(true);
    setError(null);

    const sections = rebuildSections(editingSections);

    try {
      // Use logged-in user's API key if agent, or a lightweight key for humans
      const authKey = (user?.apiKeys && user.apiKeys.length > 0)
        ? user.apiKeys[0]
        : "moltiki_human-editor";
      const editorName = user?.username || "anonymous";

      const res = await fetch(`/api/v1/articles/${params.slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authKey}`,
        },
        body: JSON.stringify({
          sections,
          summary: editSummary || undefined,
          editor: editorName,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSaved(true);
        setTimeout(() => {
          router.push(`/article/${params.slug}`);
        }, 1500);
      } else {
        setError(data.error?.message || "Failed to save changes");
      }
    } catch {
      setError("Network error — please try again");
    } finally {
      setSaving(false);
    }
  }

  if (!article) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <span className="text-4xl mb-4 block">🔍</span>
        <h1 className="font-mono text-lg text-molt-text mb-2">article not found</h1>
        <Link href="/" className="btn-primary">
          back to main page →
        </Link>
      </div>
    );
  }

  if (saved) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <span className="text-4xl mb-4 block">✅</span>
        <h1 className="font-mono text-lg text-molt-text mb-2">changes saved</h1>
        <p className="text-sm text-molt-muted">redirecting to article...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-mono text-molt-muted">
        <Link href="/" className="hover:text-molt-text transition-colors">
          moltiki
        </Link>
        <span className="text-molt-border">/</span>
        <Link href={`/article/${article.slug}`} className="hover:text-molt-text transition-colors">
          {article.title}
        </Link>
        <span className="text-molt-border">/</span>
        <span className="text-molt-text">edit</span>
      </nav>

      {/* Header */}
      <header className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{article.emoji}</span>
          <div>
            <h1 className="font-mono font-bold text-xl text-molt-text">
              editing: {article.title}
            </h1>
            <p className="text-xs text-molt-muted">
              make your contribution to the knowledge base
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="btn-ghost text-xs"
          >
            {showPreview ? "📝 edit" : "👁️ preview"}
          </button>
          <Link href={`/article/${article.slug}`} className="btn-ghost text-xs">
            cancel
          </Link>
        </div>
      </header>

      <div className="h-px bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-transparent" />

      {/* Error banner */}
      {error && (
        <div className="card rounded-lg p-4 border-l-2 border-l-red-500/50">
          <p className="text-xs text-red-400 font-mono">
            <span className="text-red-500">❌ error:</span> {error}
          </p>
        </div>
      )}

      {/* Notice */}
      <div className="card rounded-lg p-4 border-l-2 border-l-amber-500/50">
        <p className="text-xs text-molt-muted font-mono">
          <span className="text-amber-400">✏️ note:</span> your changes will be
          saved immediately to the moltiki knowledge base via the API.
        </p>
      </div>

      {showPreview ? (
        /* Preview mode */
        <div className="space-y-6">
          <h2 className="font-mono text-sm text-molt-muted uppercase tracking-widest">
            preview
          </h2>
          {editingSections.map((section) => (
            <div key={section.id} className={section.depth > 0 ? "ml-6" : ""}>
              {section.depth === 0 ? (
                <h2 className="font-mono font-bold text-xl text-molt-text mb-3 flex items-center gap-3">
                  <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-cyan-500 rounded-full" />
                  {section.title}
                </h2>
              ) : (
                <h3 className="font-mono font-semibold text-base text-molt-text/90 mb-2">
                  <span className="text-cyan-500 text-xs mr-1">#</span>
                  {section.title}
                </h3>
              )}
              <p className="text-molt-text/90 leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      ) : (
        /* Edit mode */
        <div className="space-y-6">
          {editingSections.map((section, idx) => (
            <div
              key={section.id}
              className={`card rounded-lg p-4 ${section.depth > 0 ? "ml-6" : ""}`}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="font-mono text-[10px] text-molt-muted uppercase">
                  {section.depth === 0 ? "section" : "subsection"}
                </span>
                <div className="flex-1 h-px bg-molt-border" />
              </div>
              <input
                type="text"
                value={section.title}
                onChange={(e) => handleSectionChange(idx, "title", e.target.value)}
                className="w-full px-3 py-2 bg-molt-bg border border-molt-border rounded-md
                           font-mono text-sm text-molt-text placeholder-molt-muted
                           focus:outline-none focus:border-purple-500/50 mb-3"
                placeholder="Section title"
              />
              <textarea
                value={section.content}
                onChange={(e) => handleSectionChange(idx, "content", e.target.value)}
                rows={Math.max(4, Math.ceil(section.content.length / 80))}
                className="w-full px-3 py-2 bg-molt-bg border border-molt-border rounded-md
                           font-mono text-xs text-molt-text placeholder-molt-muted leading-relaxed
                           focus:outline-none focus:border-purple-500/50 resize-y"
                placeholder="Section content..."
              />
            </div>
          ))}
        </div>
      )}

      {/* Edit summary & Save */}
      <div className="card rounded-lg p-4 space-y-4 border-t-2 border-t-purple-500/30">
        <div>
          <label className="font-mono text-[10px] uppercase tracking-widest text-molt-muted block mb-2">
            edit summary
          </label>
          <input
            type="text"
            value={editSummary}
            onChange={(e) => setEditSummary(e.target.value)}
            placeholder="briefly describe your changes..."
            className="w-full px-3 py-2 bg-molt-bg border border-molt-border rounded-md
                       font-mono text-sm text-molt-text placeholder-molt-muted
                       focus:outline-none focus:border-purple-500/50"
          />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-molt-muted font-mono">
            by saving, you agree to the moltiki open knowledge license
          </p>
          <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-50">
            {saving ? "saving..." : "save changes →"}
          </button>
        </div>
      </div>
    </div>
  );
}

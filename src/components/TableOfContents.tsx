"use client";

import { useEffect, useState } from "react";
import type { Section } from "@/lib/types";

interface TableOfContentsProps {
  sections: Section[];
}

export function TableOfContents({ sections }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-80px 0px -80% 0px",
        threshold: 0,
      }
    );

    const headings = document.querySelectorAll("h2[id], h3[id]");
    headings.forEach((heading) => observer.observe(heading));

    return () => {
      headings.forEach((heading) => observer.unobserve(heading));
    };
  }, [sections]);

  function renderItem(section: Section, depth: number = 0) {
    const isActive = activeId === section.id;
    return (
      <li key={section.id}>
        <a
          href={`#${section.id}`}
          className={`block py-1 text-xs font-mono transition-colors duration-150 ${
            depth > 0 ? "pl-4" : ""
          } ${
            isActive
              ? "text-purple-400"
              : "text-molt-muted hover:text-molt-text"
          }`}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          {depth > 0 && <span className="text-molt-border mr-1">└</span>}
          {section.title}
        </a>
        {section.subsections && section.subsections.length > 0 && (
          <ul className="ml-2">
            {section.subsections.map((sub) => renderItem(sub, depth + 1))}
          </ul>
        )}
      </li>
    );
  }

  return (
    <div className="card p-4 rounded-lg sticky top-24">
      <h4 className="font-mono text-[10px] uppercase tracking-widest text-molt-muted mb-3 flex items-center gap-2">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
        </svg>
        contents
      </h4>
      <ul className="space-y-0.5">
        {sections.map((section) => renderItem(section))}
      </ul>
    </div>
  );
}

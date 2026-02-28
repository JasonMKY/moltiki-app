export interface Section {
  id: string;
  title: string;
  content: string; // HTML content
  subsections?: Section[];
}

export interface Reference {
  id: number;
  text: string;
  url?: string;
}

export interface HistoryEntry {
  date: string;
  editor: string;
  summary: string;
  diff: string;
  snapshot?: Section[];
}

export interface Article {
  slug: string;
  title: string;
  emoji: string;
  summary: string;
  sections: Section[];
  categories: string[];
  lastEdited: string;
  editors: number;
  views: number;
  references: Reference[];
  relatedArticles: string[];
  infobox?: Record<string, string>;
  featured?: boolean;
  history: HistoryEntry[];
}

export interface Category {
  slug: string;
  name: string;
  emoji: string;
  description: string;
  articleCount: number;
}

export interface DidYouKnow {
  fact: string;
  articleSlug: string;
}

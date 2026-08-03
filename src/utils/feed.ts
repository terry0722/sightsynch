import { createClient } from "./supabase/server";
import { pickArticle } from "./i18n";
import { CATEGORY_MAP } from "./categories";
import { ARTICLES_PER_PAGE } from "../lib/constants";

export interface FeedItem {
  id: string;
  sourceType: "article" | "editorpick";
  href: string;
  title: string;
  summary: string;
  coverImageUrl: string;
  category: string;
  tags: string | string[];
  date: string;
  authorName?: string;
}

export interface GetMergedFeedOptions {
  category?: string;
  page?: number;
  limit?: number;
  locale?: string;
}

export interface MergedFeedResult {
  items: FeedItem[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export async function getMergedFeed(options: GetMergedFeedOptions = {}): Promise<MergedFeedResult> {
  const { category, page = 1, limit = ARTICLES_PER_PAGE, locale = "ko" } = options;
  const currentPage = Math.max(1, Math.floor(Number(page) || 1));
  const perPage = limit > 0 ? limit : ARTICLES_PER_PAGE;
  
  try {
    const supabase = await createClient();
    let articlesQuery = supabase.from("articles").select("*", { count: "exact" });
    let picksQuery = supabase.from("editor_picks").select("*", { count: "exact" }).eq("status", "published");

    if (category) {
      const map = CATEGORY_MAP[category as keyof typeof CATEGORY_MAP];
      const rawCat = category.trim();
      let rawAccepted: string[] = [];
      if (map) {
        rawAccepted = [map.ko, map.en, category, rawCat];
      } else {
        rawAccepted = [category, rawCat];
      }
      const acceptedSet = new Set<string>();
      rawAccepted.forEach((item) => {
        if (!item) return;
        acceptedSet.add(item);
        acceptedSet.add(` ${item}`);
        acceptedSet.add(`${item} `);
        acceptedSet.add(` ${item} `);
      });
      const accepted = Array.from(acceptedSet);
      articlesQuery = articlesQuery.in("category", accepted);
      picksQuery = picksQuery.in("category", accepted);
    }

    const fetchLimit = Math.min(currentPage * perPage, 2000);

    const [articlesRes, picksRes] = await Promise.all([
      articlesQuery
        .order("created_at", { ascending: false })
        .order("id", { ascending: false })
        .range(0, fetchLimit - 1),
      picksQuery
        .order("published_at", { ascending: false })
        .order("id", { ascending: false })
        .range(0, fetchLimit - 1)
    ]);

    const totalArticles = articlesRes.count || 0;
    const totalPicks = picksRes.count || 0;
    const totalCount = totalArticles + totalPicks;
    const totalPages = Math.max(1, Math.ceil(totalCount / perPage));

    const articlesData = articlesRes.data || [];
    const picksData = picksRes.data || [];

    // Normalize articles
    const normArticles: FeedItem[] = articlesData.map((art) => {
      const picked = pickArticle(art, locale) || art;
      return {
        id: picked.id,
        sourceType: "article",
        href: `/article/${picked.id}`,
        title: picked.title,
        summary: picked.summary,
        coverImageUrl: picked.image_url,
        category: picked.category,
        tags: picked.tags,
        date: picked.created_at || new Date().toISOString()
      };
    });

    // Normalize editor picks
    const normPicks: FeedItem[] = picksData.map((pick) => {
      return {
        id: pick.id,
        sourceType: "editorpick",
        href: `/editor/${pick.id}`,
        title: pick.title,
        summary: pick.subtitle || pick.title,
        coverImageUrl: pick.cover_image_url || "/hero_modern_art.jpg",
        category: pick.category || "General",
        tags: pick.tags || [],
        date: pick.published_at || pick.created_at || new Date().toISOString(),
        authorName: pick.author_name
      };
    });

    // Combine and sort deterministically (date DESC, id DESC)
    const combined = [...normArticles, ...normPicks].sort((a, b) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      if (timeB !== timeA) {
        return timeB - timeA;
      }
      return b.id.localeCompare(a.id);
    });

    const offset = (currentPage - 1) * perPage;
    const items = combined.slice(offset, offset + perPage);

    return {
      items,
      totalCount,
      totalPages,
      currentPage
    };
  } catch (err) {
    console.error("Error generating merged feed:", err);
    return {
      items: [],
      totalCount: 0,
      totalPages: 1,
      currentPage: 1
    };
  }
}

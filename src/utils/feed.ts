import { createClient } from "./supabase/server";
import { pickArticle } from "./i18n";
import { CATEGORY_MAP } from "./categories";

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

export async function getMergedFeed(options: {
  category?: string;
  limit?: number;
  locale?: string;
} = {}): Promise<FeedItem[]> {
  const { category, limit = 50, locale = "ko" } = options;
  
  let articlesQuery = null;
  let picksQuery = null;

  try {
    const supabase = await createClient();
    articlesQuery = supabase.from("articles").select("*");
    picksQuery = supabase.from("editor_picks").select("*").eq("status", "published");

    if (category) {
      const map = CATEGORY_MAP[category as keyof typeof CATEGORY_MAP];
      if (map) {
        const accepted = [map.ko, map.en, category];
        articlesQuery = articlesQuery.in("category", accepted);
        picksQuery = picksQuery.in("category", accepted);
      } else {
        articlesQuery = articlesQuery.eq("category", category);
        picksQuery = picksQuery.eq("category", category);
      }
    }

    const [articlesRes, picksRes] = await Promise.all([
      articlesQuery.order("created_at", { ascending: false }).limit(limit),
      picksQuery.order("published_at", { ascending: false }).limit(limit)
    ]);

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

    // Combine and sort
    const combined = [...normArticles, ...normPicks].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return combined.slice(0, limit);
  } catch (err) {
    console.error("Error generating merged feed:", err);
    return [];
  }
}

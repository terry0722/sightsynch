import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "privacy",
    "terms",
    "about",
    "contact",
  ].map((route) => ({
    url: `https://www.sightsynch.com/${route}`,
    lastModified: new Date(),
  }));

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return staticRoutes;
    }

    // Using standard supabase client without next/headers cookies() to prevent static build errors
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Fetch articles
    const { data: articles } = await supabase
      .from("articles")
      .select("id, created_at");

    const articleRoutes = (articles || []).map((article) => ({
      url: `https://www.sightsynch.com/article/${article.id}`,
      lastModified: article.created_at ? new Date(article.created_at) : new Date(),
    }));

    // Fetch editor picks
    const { data: picks } = await supabase
      .from("editor_picks")
      .select("id, published_at, created_at")
      .eq("status", "published");

    const pickRoutes = (picks || []).map((pick) => ({
      url: `https://www.sightsynch.com/editor/${pick.id}`,
      lastModified: new Date(pick.published_at || pick.created_at || new Date()),
    }));

    return [...staticRoutes, ...articleRoutes, ...pickRoutes];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return staticRoutes;
  }
}

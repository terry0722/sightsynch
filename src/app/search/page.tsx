import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import Header from "../../components/Header";
import NewsletterForm from "../../components/NewsletterForm";
import { createClient } from "../../utils/supabase/server";
import { pickArticle, getTranslation, type TranslationKey } from "../../utils/i18n";
import ImageCredit from "../../components/ImageCredit";

export const revalidate = 0;

interface FeedItem {
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

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const rawQ = q || "";
  
  // SQL/Filter safety: clean query of characters that break or filter parser in Postgrest
  const cleanQ = rawQ.replace(/[()%,]/g, " ").trim();

  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value || "ko";
  const t = getTranslation(locale);

  let combinedResults: FeedItem[] = [];

  if (cleanQ) {
    try {
      const supabase = await createClient();
      const term = `%${cleanQ}%`;
      
      const [articlesRes, picksRes] = await Promise.all([
        supabase
          .from("articles")
          .select("*")
          .or([
            `title.ilike.${term}`,
            `title_en.ilike.${term}`,
            `summary.ilike.${term}`,
            `summary_en.ilike.${term}`,
            `body_markdown.ilike.${term}`,
            `body_markdown_en.ilike.${term}`
          ].join(","))
          .order("created_at", { ascending: false })
          .limit(50),
        supabase
          .from("editor_picks")
          .select("*")
          .eq("status", "published")
          .or([
            `title.ilike.${term}`,
            `subtitle.ilike.${term}`,
            `body_markdown.ilike.${term}`
          ].join(","))
          .order("published_at", { ascending: false })
          .limit(50)
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
      combinedResults = [...normArticles, ...normPicks].sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
    } catch (err) {
      console.error("Search fetch failed:", err);
    }
  }

  const renderTags = (tags: string | string[] | null | undefined) => {
    if (!tags) return null;
    let parsed: string[] = [];
    if (Array.isArray(tags)) {
      parsed = tags;
    } else if (typeof tags === "string") {
      try {
        const temp = JSON.parse(tags);
        if (Array.isArray(temp)) parsed = temp;
      } catch {
        parsed = tags.split(/[\s,]+/).filter(Boolean);
      }
    }
    if (parsed.length === 0 && typeof tags === "string") {
      parsed = [tags];
    }
    return parsed.map((tag) => (
      <span key={tag} className="text-xs font-mono tracking-wider text-neutral-500">
        #{tag.replace(/^#/, "")}
      </span>
    ));
  };

  const getTranslatedCategory = (cat: string) => {
    const key = cat.toLowerCase() as TranslationKey;
    return t(key) || cat;
  };

  return (
    <div className="min-h-screen bg-white text-[#111111] font-sans antialiased selection:bg-[#111111] selection:text-white">
      <Header />

      <main className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20">
        
        {/* Editorial Subheader */}
        <div className="flex justify-between items-end border-b border-neutral-200 pb-4 mb-12">
          <Link 
            href="/" 
            className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-500 hover:text-black transition-colors"
          >
            {t("backToHome")}
          </Link>
          <div className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-500">
            SIGHTSYNCH JOURNAL — {t("searchTitle")}
          </div>
        </div>

        {/* Dashboard Header */}
        <header className="mb-16 border-b border-neutral-200 pb-8">
          <span className="text-xs font-black uppercase tracking-[0.25em] text-neutral-400 block mb-3">
            ARCHIVE / SEARCH
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none text-neutral-900 uppercase">
            {cleanQ ? `“${cleanQ}”` : t("searchTitle")}
          </h1>
          {cleanQ && (
            <p className="text-xs text-neutral-500 font-mono mt-3">
              {combinedResults.length} {t("searchResultsCount")}
            </p>
          )}
        </header>

        {/* Result UI Blocks */}
        {!cleanQ ? (
          /* Empty or invalid query state */
          <div className="py-24 max-w-xl mx-auto text-center border-b border-neutral-200 mb-16">
            <p className="text-sm font-mono uppercase text-neutral-400 tracking-wider mb-8">
              {t("searchPrompt")}
            </p>
            <form action="/search" method="GET" className="flex border border-neutral-300 focus-within:border-black transition-colors">
              <input
                type="text"
                name="q"
                required
                placeholder={t("searchBoxPlaceholder")}
                className="w-full px-4 py-3 text-xs bg-white text-black outline-none font-medium placeholder-neutral-400"
              />
              <button type="submit" className="bg-black text-white hover:bg-neutral-800 px-6 py-3 text-xs font-bold uppercase tracking-wider transition-colors shrink-0">
                {t("searchTitle")}
              </button>
            </form>
          </div>
        ) : combinedResults.length > 0 ? (
          /* Found results state */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 border-b border-neutral-200 pb-16 mb-16">
            {combinedResults.map((item) => (
              <article key={item.id} className="flex flex-col justify-between group">
                <div>
                  {/* Image Link */}
                  <div className="mb-6">
                    <Link href={item.href} className="block relative aspect-[3/2] w-full overflow-hidden bg-neutral-100 border border-neutral-200">
                      <Image
                        src={item.coverImageUrl || "/hero_modern_art.jpg"}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 30vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      />
                    </Link>
                    <ImageCredit />
                  </div>

                  {/* Category & Tags */}
                  <div className="flex flex-wrap gap-3 items-center mb-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-900 border border-neutral-900 px-2 py-0.5">
                      {getTranslatedCategory(item.category)}
                    </span>
                    {item.sourceType === "editorpick" && (
                      <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white bg-black px-2 py-0.5 border border-black">
                        {"EDITOR'S PICK"}
                      </span>
                    )}
                    {renderTags(item.tags)}
                  </div>

                  {/* Title Link */}
                  <Link href={item.href} className="block">
                    <h2 className="text-xl font-black tracking-tight leading-[1.2] text-[#111111] mb-3 uppercase group-hover:text-neutral-600 transition-colors">
                      {item.title}
                    </h2>
                  </Link>

                  {/* Summary */}
                  <p className="text-sm leading-relaxed text-neutral-600 font-normal mb-6">
                    {item.summary}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* Empty results state */
          <div className="py-24 text-center border-b border-neutral-200 mb-16">
            <p className="text-sm font-mono uppercase text-neutral-400 tracking-wider mb-6">
              “{cleanQ}” {t("noResults")}
            </p>
            <div className="max-w-md mx-auto">
              <form action="/search" method="GET" className="flex border border-neutral-300 focus-within:border-black transition-colors">
                <input
                  type="text"
                  name="q"
                  required
                  placeholder={t("searchBoxPlaceholder")}
                  className="w-full px-4 py-3 text-xs bg-white text-black outline-none font-medium placeholder-neutral-400"
                />
                <button type="submit" className="bg-black text-white hover:bg-neutral-800 px-6 py-3 text-xs font-bold uppercase tracking-wider transition-colors shrink-0">
                  {t("searchTitle")}
                </button>
              </form>
            </div>
          </div>
        )}

      </main>

      {/* Global Footer */}
      <footer className="bg-white border-t border-neutral-200 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="mb-12">
            <Link href="/" className="text-3xl font-black tracking-[0.15em] lowercase hover:opacity-80 transition-opacity">
              sightsynch
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-12 md:gap-8 mb-16">
            <div className="md:col-span-1">
              <h3 className="text-xs font-bold tracking-widest mb-6 text-neutral-900 uppercase">
                {t("byCategory")}
              </h3>
              <ul className="space-y-3.5 text-xs text-neutral-600 font-medium">
                <li><Link href="/category/fashion" className="hover:text-black transition-colors">{t("fashion")}</Link></li>
                <li><Link href="/category/art" className="hover:text-black transition-colors">{t("art")}</Link></li>
                <li><Link href="/category/tech" className="hover:text-black transition-colors">{t("tech")}</Link></li>
                <li><Link href="/category/beauty" className="hover:text-black transition-colors">{t("beauty")}</Link></li>
                <li><Link href="/category/lifestyle" className="hover:text-black transition-colors">{t("lifestyle")}</Link></li>
              </ul>
            </div>

            <div className="md:col-span-1">
              <h3 className="text-xs font-bold tracking-widest mb-6 text-neutral-900 uppercase">
                {t("follow")}
              </h3>
              <div className="flex gap-4 items-center text-neutral-600">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors" aria-label="Instagram">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
              </div>
            </div>

            <div className="md:col-span-1">
              <h3 className="text-xs font-bold tracking-widest mb-6 text-neutral-900 uppercase">
                {t("company")}
              </h3>
              <ul className="space-y-3.5 text-xs text-neutral-600 font-medium">
                <li><Link href="/about" className="hover:text-black transition-colors">{t("about")}</Link></li>

                <li><Link href="/#partnership" className="hover:text-black transition-colors">{t("partnership")}</Link></li>
                <li><Link href="/contact" className="hover:text-black transition-colors">{t("contact")}</Link></li>
              </ul>
            </div>

            <div className="md:col-span-3 md:pl-12 flex flex-col justify-between">
              <div className="mb-8">
                <h3 className="text-xs font-bold tracking-widest mb-4 text-neutral-900 uppercase">
                  {t("newsletterTitle")}
                </h3>
                <p className="text-xs text-neutral-500 mb-4 leading-relaxed font-medium">
                  {t("newsletterDesc")}
                </p>
                <NewsletterForm locale={locale} />
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] font-mono text-neutral-500 tracking-wider">
              © 2026 Sightsynch Limited. All Rights Reserved.
            </p>
            <div className="flex gap-4 text-[10px] font-medium text-neutral-500 tracking-wider">
              <Link href="/terms" className="hover:text-black transition-colors">{t("terms")}</Link>
              <span>|</span>
              <Link href="/privacy" className="hover:text-black transition-colors">{t("privacy")}</Link>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}

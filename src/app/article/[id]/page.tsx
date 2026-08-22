import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Header from "../../../components/Header";
import ArticleActions from "../../../components/ArticleActions";
import NewsletterForm from "../../../components/NewsletterForm";
import { createClient } from "../../../utils/supabase/server";
import { pickArticle, getTranslation, type TranslationKey } from "../../../utils/i18n";
import ImageCredit from "../../../components/ImageCredit";

export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ArticlePage({ params }: PageProps) {
  const { id } = await params;
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value || "ko";
  const t = getTranslation(locale);
  const supabase = await createClient();

  // Fetch the specific article
  const { data: articleData, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .single();

  // If error or no article is found, trigger notFound
  if (error || !articleData) {
    notFound();
  }

  // Pick translation fields
  const article = pickArticle(articleData, locale);
  if (!article) {
    notFound();
  }

  // Asynchronously increment view count on entry
  await supabase
    .from("articles")
    .update({ view_count: (articleData.view_count || 0) + 1 })
    .eq("id", id);

  // Fetch user authentications
  const { data: { user } } = await supabase.auth.getUser();

  let isBookmarked = false;
  let isLiked = false;

  if (user) {
    // Check bookmark state
    const { data: bookmarkData } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", user.id)
      .eq("article_id", id)
      .maybeSingle();
    isBookmarked = !!bookmarkData;

    // Check like state
    const { data: likeData } = await supabase
      .from("article_likes")
      .select("*")
      .eq("user_id", user.id)
      .eq("article_id", id)
      .maybeSingle();
    isLiked = !!likeData;
  }

  // Count total likes
  const { count: likesCount } = await supabase
    .from("article_likes")
    .select("*", { count: "exact", head: true })
    .eq("article_id", id);

  // Format date elegantly
  const formattedDate = articleData.created_at
    ? new Date(articleData.created_at).toLocaleDateString(locale === "en" ? "en-US" : "ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    : "";

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
      <span key={tag} className="text-xs font-mono tracking-wider text-neutral-500 bg-neutral-50 border border-neutral-200 px-3 py-1.5 hover:bg-neutral-100 hover:text-black transition-colors cursor-pointer">
        #{tag.replace(/^#/, "")}
      </span>
    ));
  };

  // Translate category codes dynamically
  const getTranslatedCategory = (cat: string) => {
    const key = cat.toLowerCase() as TranslationKey;
    return t(key) || cat;
  };

  return (
    <div className="min-h-screen bg-white text-[#111111] font-sans antialiased selection:bg-[#111111] selection:text-white">
      <Header />

      <main className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20">

        {/* Editorial Subheader / Back button */}
        <div className="flex justify-between items-end border-b border-neutral-200 pb-4 mb-12">
          <Link
            href="/"
            className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-500 hover:text-black transition-colors flex items-center gap-1.5"
          >
            {t("backToIssues")}
          </Link>
          <div className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-500 hidden sm:block">
            SIGHTSYNCH JOURNAL — {t("globalArchive")}
          </div>
        </div>

        {/* Inverse L-Shape structure layout */}
        {/* Top Center Layout: Metadata Header */}
        <header className="max-w-4xl mx-auto text-center mb-16 md:mb-24">
          {article.category && (
            <span className="inline-block text-xs font-black uppercase tracking-[0.25em] text-neutral-900 border border-neutral-900 px-3 py-1 mb-8">
              {getTranslatedCategory(article.category)}
            </span>
          )}

          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.08] text-neutral-900 uppercase max-w-4xl mx-auto mb-8">
            {article.title}
          </h1>

          {article.summary && (
            <p className="text-lg md:text-2xl font-normal leading-relaxed text-neutral-500 max-w-2xl mx-auto mb-8">
              {article.summary}
            </p>
          )}

          <div className="flex items-center justify-center gap-6 text-xs font-mono text-neutral-400 uppercase tracking-widest">
            <span>{formattedDate}</span>
            <span>•</span>
            <span>{t("globalArchive")}</span>
          </div>

          {/* Centered Actions Bar */}
          <div className="flex justify-center mt-8">
            <ArticleActions
              articleId={id}
              initialLikesCount={likesCount || 0}
              initialIsLiked={isLiked}
              initialIsBookmarked={isBookmarked}
            />
          </div>
        </header>

        {/* 기사 썸네일 이미지 출력 예시 */}
        {article.image_url && (
          <div className="w-full mb-6 max-w-5xl mx-auto">
            <div className="w-full h-64 md:h-[28rem] relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.image_url}
                alt={article.title}
                className="object-cover w-full h-full rounded-lg"
              />
            </div>
            <ImageCredit className="text-center md:text-left" />
          </div>
        )}

        {/* Body Section Layout (Whitespace generous container) */}
        <section className="max-w-3xl mx-auto pb-16 border-b border-neutral-200">
          <div className="prose prose-neutral max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h2 className="text-2xl md:text-3xl font-black mt-16 mb-8 uppercase tracking-tight text-neutral-900">
                    {children}
                  </h2>
                ),
                h2: ({ children }) => (
                  <h3 className="text-xl md:text-2xl font-black mt-12 mb-6 uppercase tracking-tight text-neutral-900">
                    {children}
                  </h3>
                ),
                h3: ({ children }) => (
                  <h4 className="text-lg font-black mt-8 mb-4 uppercase tracking-wide text-neutral-900 border-l-2 border-neutral-950 pl-3">
                    {children}
                  </h4>
                ),
                p: ({ children }) => (
                  <p className="text-base md:text-lg leading-relaxed text-neutral-700 mb-8 font-normal">
                    {children}
                  </p>
                ),
                strong: ({ children }) => (
                  <strong className="font-bold text-neutral-900">{children}</strong>
                ),
                em: ({ children }) => (
                  <em className="italic text-neutral-800">{children}</em>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-900 underline underline-offset-4 decoration-neutral-300 hover:decoration-neutral-900 transition-colors"
                  >
                    {children}
                  </a>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-neutral-300 pl-6 my-8 italic text-neutral-600 text-lg leading-relaxed">
                    {children}
                  </blockquote>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc pl-6 space-y-3 mb-8 text-neutral-700 font-normal">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal pl-6 space-y-3 mb-8 text-neutral-700 font-normal">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-base md:text-lg leading-relaxed">{children}</li>
                ),
                hr: () => <hr className="my-12 border-neutral-200" />,
                img: ({ src, alt }) => (
                  <figure className="my-8">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={alt} className="max-w-full h-auto mx-auto rounded-lg" />
                    {alt && (
                      <figcaption className="text-center text-xs text-neutral-400 font-mono mt-3 uppercase tracking-wider">
                        {alt}
                      </figcaption>
                    )}
                    <ImageCredit className="text-center" />
                  </figure>
                ),
              }}
            >
              {article.body_markdown}
            </ReactMarkdown>
          </div>
        </section>

        {/* Tags Section Layout */}
        {article.tags && (
          <section className="max-w-3xl mx-auto py-12 border-b border-neutral-200">
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-400 mb-6">
              ARTICLE TAGS
            </h3>
            <div className="flex flex-wrap gap-3">
              {renderTags(article.tags)}
            </div>
          </section>
        )}

        {/* Source link (원문 이동) */}
        {article.source_url && (
          <section className="max-w-3xl mx-auto pt-6">
            <a
              href={article.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-500 hover:text-black transition-colors"
            >
              {t("originalSource")}
            </a>
          </section>
        )}

        {/* Extra Footer block */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-20 mt-20 border-t border-neutral-200 text-neutral-500 font-mono text-xs">
          <div>
            <span className="block font-bold text-neutral-900 mb-2 uppercase">{t("foot1Title")}</span>
            {t("foot1Desc")}
          </div>
          <div>
            <span className="block font-bold text-neutral-900 mb-2 uppercase">{t("foot2Title")}</span>
            {t("foot2Desc")}
          </div>
          <div>
            <span className="block font-bold text-neutral-900 mb-2 uppercase">{t("foot3Title")}</span>
            {t("foot3Desc")}
          </div>
        </div>

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
                
                {/* Dynamic Newsletter Form component */}
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

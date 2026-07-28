import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Header from "../../../components/Header";
import NewsletterForm from "../../../components/NewsletterForm";
import { createClient } from "../../../utils/supabase/server";
import { getTranslation, type TranslationKey } from "../../../utils/i18n";
import { getCurrentProfile, isStaff } from "../../../utils/auth";
import ImageCredit from "../../../components/ImageCredit";

export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditorPickDetailPage({ params }: PageProps) {
  const { id } = await params;
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value || "ko";
  const t = getTranslation(locale);

  const supabase = await createClient();

  // Fetch the specific editor pick
  const { data: pick, error } = await supabase
    .from("editor_picks")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !pick) {
    notFound();
  }

  // Permission check: if status is draft, only staff can view
  if (pick.status !== "published") {
    const profile = await getCurrentProfile();
    if (!isStaff(profile)) {
      notFound();
    }
  }

  const formattedDate = pick.published_at || pick.created_at
    ? new Date(pick.published_at || pick.created_at).toLocaleDateString(locale === "en" ? "en-US" : "ko-KR", {
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

  const getTranslatedCategory = (cat?: string) => {
    if (!cat) return "";
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
            href="/editor"
            className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-500 hover:text-black transition-colors flex items-center gap-1.5"
          >
            {"← BACK TO EDITOR'S PICK"}
          </Link>
          <div className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-500 hidden sm:block">
            SIGHTSYNCH JOURNAL — {t("editorsPick")}
          </div>
        </div>

        {/* Draft Notice for Staff */}
        {pick.status !== "published" && (
          <div className="max-w-4xl mx-auto bg-amber-50 border border-amber-200 text-amber-800 text-xs font-mono uppercase tracking-widest px-4 py-3 rounded-none mb-8 text-center">
            ⚠️ {t("draft")} — STAFF ONLY PREVIEW
          </div>
        )}

        {/* Article Header */}
        <header className="max-w-4xl mx-auto text-center mb-16 md:mb-24">
          {pick.category && (
            <span className="inline-block text-xs font-black uppercase tracking-[0.25em] text-neutral-900 border border-neutral-900 px-3 py-1 mb-8">
              {getTranslatedCategory(pick.category)}
            </span>
          )}

          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.08] text-neutral-900 uppercase max-w-4xl mx-auto mb-8">
            {pick.title}
          </h1>

          {pick.subtitle && (
            <p className="text-lg md:text-2xl font-normal leading-relaxed text-neutral-500 max-w-2xl mx-auto mb-8">
              {pick.subtitle}
            </p>
          )}

          <div className="flex items-center justify-center gap-6 text-xs font-mono text-neutral-400 uppercase tracking-widest">
            <span>{formattedDate}</span>
            {pick.author_name && (
              <>
                <span>•</span>
                <span>BY {pick.author_name}</span>
              </>
            )}
          </div>
        </header>

        {/* Cover Image */}
        {pick.cover_image_url && (
          <div className="w-full mb-12 max-w-5xl mx-auto">
            <div className="w-full h-64 md:h-[28rem] relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={pick.cover_image_url}
                alt={pick.title}
                className="object-cover w-full h-full rounded-lg"
              />
            </div>
            <ImageCredit className="text-center md:text-left" />
          </div>
        )}

        {/* Body Section Layout */}
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
              {pick.body_markdown}
            </ReactMarkdown>
          </div>
        </section>

        {/* Tags Section Layout */}
        {pick.tags && (
          <section className="max-w-3xl mx-auto py-12 border-b border-neutral-200">
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-400 mb-6">
              ARTICLE TAGS
            </h3>
            <div className="flex flex-wrap gap-3">
              {renderTags(pick.tags)}
            </div>
          </section>
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
        </div>
      </footer>
    </div>
  );
}

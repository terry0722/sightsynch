import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import type { Metadata } from "next";
import Header from "../components/Header";
import NewsletterForm from "../components/NewsletterForm";
import Pagination from "../components/Pagination";
import { getTranslation, type TranslationKey, pickArticle } from "../utils/i18n";
import { getMergedFeed, type FeedItem } from "../utils/feed";
import ImageCredit from "../components/ImageCredit";

export const revalidate = 60;

interface Article {
  id: string;
  title: string;
  title_en?: string;
  summary: string;
  summary_en?: string;
  category: string;
  tags: string | string[];
  tags_en?: string | string[];
  image_url: string;
  body_markdown?: string;
  body_markdown_en?: string;
  created_at?: string;
}

const MOCK_ARTICLES: Article[] = [
  {
    id: "mock-1",
    title: "로레알 × 구찌: 럭셔리 뷰티의 새로운 합성",
    title_en: "L’Oréal × Gucci: The New Synthesis of Luxury Beauty",
    summary: "전통 고고학적 패션 하우스와 첨단 화장품 처방의 교차점에 대한 독점적인 에디토리얼 조사, 새로운 세대를 위한 럭셔리 화장품의 재정의.",
    summary_en: "An exclusive editorial investigation into the intersection of heritage high-fashion couture and advanced cosmetic formulation, redefining luxury cosmetics for a new generation.",
    category: "패션",
    tags: ["로레알구찌"],
    tags_en: ["LorealGucci"],
    image_url: "/hero_loreal_gucci.jpg"
  },
  {
    id: "mock-2",
    title: "추상적인 대칭: 디지털 시대의 칸딘스키",
    title_en: "Abstract Symmetry: Kandinsky in the Digital Era",
    summary: "아방가르드 모더니즘의 기하학적 혁명과 몰입형 디지털 아트 경험에서의 대칭의 울림을 돌아봅니다.",
    summary_en: "Revisiting the geometric revolution of avant-garde modernism and its resonance in current immersive digital art experiences.",
    category: "미술",
    tags: ["모던아트"],
    tags_en: ["ModernArt"],
    image_url: "/hero_modern_art.jpg"
  },
  {
    id: "mock-3",
    title: "음향 네크워크: 미니멀리스트 사운드 디자인",
    title_en: "The Acoustic Plexus: Minimalist Sound Design",
    summary: "무선 오디오에서 기계적 정밀함과 극도의 절제된 산업 아키텍처를 통해 순수한 사운드스케이프를 디자인합니다.",
    summary_en: "Crafting pure soundscapes through mechanical precision and understated industrial architecture in wireless audio.",
    category: "테크",
    tags: ["무선헤드폰"],
    tags_en: ["WirelessHeadphones"],
    image_url: "/hero_minimal_headphones.jpg"
  }
];

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const pageRaw = resolvedParams.page;
  const page = Math.max(1, Math.floor(Number(Array.isArray(pageRaw) ? pageRaw[0] : pageRaw) || 1));

  const baseTitle = "SIGHTSYNCH — Fashion, Art & Technology Editorial";
  const title = page > 1 ? `${baseTitle} — 페이지 ${page}` : baseTitle;
  const canonicalUrl = page > 1 ? `/?page=${page}` : "/";

  return {
    title,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function Home({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const pageRaw = resolvedSearchParams.page;
  const pageNumber = Math.max(1, Math.floor(Number(Array.isArray(pageRaw) ? pageRaw[0] : pageRaw) || 1));

  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value || "ko";
  const t = getTranslation(locale);

  let feedItems: FeedItem[] = [];
  let totalCount = 0;
  let totalPages = 1;
  let currentPage = 1;

  try {
    const feedResult = await getMergedFeed({ page: pageNumber, locale });
    feedItems = feedResult.items;
    totalCount = feedResult.totalCount;
    totalPages = feedResult.totalPages;
    currentPage = feedResult.currentPage;
  } catch (err) {
    console.error("Failed to load merged feed:", err);
  }

  const normalizeMock = (art: Article): FeedItem => {
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
      date: new Date().toISOString()
    };
  };

  if ((!feedItems || feedItems.length === 0) && pageNumber === 1 && totalCount === 0) {
    feedItems = MOCK_ARTICLES.map(normalizeMock);
    totalCount = feedItems.length;
    totalPages = 1;
  }

  if (pageNumber > totalPages) {
    notFound();
  }

  const renderTags = (tags: string | string[] | null | undefined) => {
    if (!tags) return null;
    if (Array.isArray(tags)) {
      return tags.map((tag) => (
        <span key={tag} className="text-xs font-mono tracking-wider text-neutral-500">
          #{tag}
        </span>
      ));
    }
    if (typeof tags === "string") {
      let parsed: string[] = [];
      try {
        const temp = JSON.parse(tags);
        if (Array.isArray(temp)) parsed = temp;
      } catch {
        parsed = tags.split(/[\s,]+/).filter(Boolean);
      }
      if (parsed.length > 0) {
        return parsed.map((tag) => (
          <span key={tag} className="text-xs font-mono tracking-wider text-neutral-500">
            #{tag.replace(/^#/, "")}
          </span>
        ));
      }
      return (
        <span className="text-xs font-mono tracking-wider text-neutral-500">
          {tags.startsWith("#") ? tags : `#${tags}`}
        </span>
      );
    }
    return null;
  };

  const heroItem = pageNumber === 1 ? feedItems[0] : null;
  const sideItems = pageNumber === 1 ? feedItems.slice(1, 3) : [];
  const extraItems = pageNumber === 1 ? feedItems.slice(3) : feedItems;

  const getTranslatedCategory = (cat: string) => {
    const key = cat.toLowerCase() as TranslationKey;
    return t(key) || cat;
  };

  return (
    <div className="min-h-screen bg-white text-[#111111] font-sans antialiased selection:bg-[#111111] selection:text-white">
      <Header />

      <main className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20">
        {/* Editorial Subheader / Date */}
        <div className="flex justify-between items-end border-b border-neutral-200 pb-4 mb-12">
          <div className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-500">
            {t("editorialSubheader")} — ISSUE 01 {pageNumber > 1 ? `(PAGE ${pageNumber})` : ""}
          </div>
          <div className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-500">
            SEOUL / GLOBAL
          </div>
        </div>

        {/* 1페이지일 때만 히어로 섹션 렌더링 */}
        {pageNumber === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-b border-neutral-200">
            {/* Left Column: Largest Main Article Card (col-span-7) */}
            {heroItem ? (
              <article className="lg:col-span-7 lg:pr-12 lg:border-r border-neutral-200 pb-12 lg:pb-20 flex flex-col justify-between group">
                <div>
                  <div className="mb-8">
                    <Link href={heroItem.href} className="block relative aspect-[3/4] w-full overflow-hidden bg-neutral-100 border border-neutral-200">
                      <Image
                        src={heroItem.coverImageUrl || "/hero_loreal_gucci.jpg"}
                        alt={heroItem.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 55vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        priority
                      />
                    </Link>
                    <ImageCredit />
                  </div>

                  <div className="flex flex-wrap gap-3 items-center mb-4">
                    {heroItem.category && (
                      <span className="text-xs font-black uppercase tracking-[0.25em] text-neutral-900 border border-neutral-900 px-2 py-0.5">
                        {getTranslatedCategory(heroItem.category)}
                      </span>
                    )}
                    {heroItem.sourceType === "editorpick" && (
                      <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white bg-black px-2 py-0.5 border border-black">
                        {"EDITOR'S PICK"}
                      </span>
                    )}
                    {renderTags(heroItem.tags)}
                  </div>

                  <Link href={heroItem.href} className="block">
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.1] text-[#111111] mb-6 uppercase group-hover:text-neutral-600 transition-colors">
                      {heroItem.title}
                    </h1>
                  </Link>

                  <p className="text-base md:text-lg leading-relaxed text-neutral-600 font-normal max-w-2xl mb-8">
                    {heroItem.summary}
                  </p>
                </div>
              </article>
            ) : (
              <div className="lg:col-span-7 lg:pr-12 lg:border-r border-neutral-200 pb-12 lg:pb-20 flex items-center justify-center text-sm font-mono text-neutral-500 uppercase tracking-widest">
                No Articles Available
              </div>
            )}

            {/* Right Column: 2 Medium Article Cards stacked (col-span-5) */}
            <div className="lg:col-span-5 lg:pl-12 flex flex-col divide-y divide-neutral-200">
              {sideItems.length > 0 ? (
                sideItems.map((item, index) => (
                  <article
                    key={item.id}
                    className={`flex flex-col justify-between group ${index === 0 ? "pb-12 lg:pb-16 pt-12 lg:pt-0" : "pt-12 lg:pt-16 pb-12"
                      }`}
                  >
                    <div>
                      <div className="mb-6">
                        <Link href={item.href} className="block relative aspect-[3/2] w-full overflow-hidden bg-neutral-100 border border-neutral-200">
                          <Image
                            src={item.coverImageUrl || (index === 0 ? "/hero_modern_art.jpg" : "/hero_minimal_headphones.jpg")}
                            alt={item.title}
                            fill
                            sizes="(max-width: 1024px) 100vw, 40vw"
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                          />
                        </Link>
                        <ImageCredit />
                      </div>

                      <div className="flex flex-wrap gap-3 items-center mb-3">
                        {item.category && (
                          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-900 border border-neutral-900 px-2 py-0.5">
                            {getTranslatedCategory(item.category)}
                          </span>
                        )}
                        {item.sourceType === "editorpick" && (
                          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white bg-black px-2 py-0.5 border border-black">
                            {"EDITOR'S PICK"}
                          </span>
                        )}
                        {renderTags(item.tags)}
                      </div>

                      <Link href={item.href} className="block">
                        <h2 className="text-xl md:text-2xl font-black tracking-tight leading-[1.2] text-[#111111] mb-3 uppercase group-hover:text-neutral-600 transition-colors">
                          {item.title}
                        </h2>
                      </Link>

                      <p className="text-sm leading-relaxed text-neutral-600 font-normal mb-6">
                        {item.summary}
                      </p>
                    </div>
                  </article>
                ))
              ) : (
                <div className="py-12 flex items-center justify-center text-sm font-mono text-neutral-500 uppercase tracking-widest">
                  No More Articles
                </div>
              )}
            </div>
          </div>
        )}

        {/* 목록 그리드 */}
        {extraItems.length > 0 ? (
          <div className={pageNumber === 1 ? "border-t border-neutral-200 pt-16 mt-16" : ""}>
            {pageNumber === 1 && (
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-500 mb-12">
                {t("archiveMore")}
              </h3>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {extraItems.map((item) => (
                <article key={item.id} className="flex flex-col justify-between group">
                  <div>
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

                    <div className="flex flex-wrap gap-3 items-center mb-3">
                      {item.category && (
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-900 border border-neutral-900 px-2 py-0.5">
                          {getTranslatedCategory(item.category)}
                        </span>
                      )}
                      {item.sourceType === "editorpick" && (
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white bg-black px-2 py-0.5 border border-black">
                          {"EDITOR'S PICK"}
                        </span>
                      )}
                      {renderTags(item.tags)}
                    </div>

                    <Link href={item.href} className="block">
                      <h3 className="text-xl font-black tracking-tight leading-[1.2] text-[#111111] mb-3 uppercase group-hover:text-neutral-600 transition-colors">
                        {item.title}
                      </h3>
                    </Link>

                    <p className="text-sm leading-relaxed text-neutral-600 font-normal mb-6">
                      {item.summary}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-24 text-center border-b border-neutral-200">
            <p className="text-sm font-mono uppercase text-neutral-400 tracking-wider">
              {locale === "en" ? "No articles available." : "표시할 기사가 없습니다."}
            </p>
          </div>
        )}

        {/* Pagination Controls */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath="/"
          searchParams={resolvedSearchParams}
        />

        {/* 1페이지일 때만 에디토리얼 블록 렌더링 */}
        {pageNumber === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 text-neutral-500 font-mono text-xs">
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
        )}
      </main>

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
                <a href="https://www.instagram.com/byeolfather/" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors" aria-label="Instagram">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a href="https://www.facebook.com/Sightsynch/" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors" aria-label="Facebook">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors" aria-label="Twitter">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                  </svg>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors" aria-label="YouTube">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
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

              <div>
                <h4 className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-3.5">
                  DOWNLOAD APP
                </h4>
                <div className="flex gap-3">
                  <a
                    href="https://apps.apple.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 border border-neutral-300 px-4 py-2 hover:bg-neutral-50 hover:border-black transition-all"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.58 2.95-1.39" />
                    </svg>
                    <div className="text-[10px] font-bold text-left leading-none tracking-wider">
                      App Store
                    </div>
                  </a>

                  <a
                    href="https://play.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 border border-neutral-300 px-4 py-2 hover:bg-neutral-50 hover:border-black transition-all"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M5.25 2.04c-.22.22-.35.56-.35.97v17.98c0 .41.13.75.35.97l.07.07L15.4 11.96v-.12L5.32 1.97l-.07.07zm11.1 7.82l-2.91-2.91L5.6 1.94c.32-.09.73-.05 1.08.15l10.96 6.32c.57.33.87.79.87 1.24s-.3 1.01-.87 1.34l-1.3.75-2.07-2.07v-.12zm-3.03 3.03l3.03 3.03c.57.33.87.79.87 1.24s-.3.91-.87 1.24L6.68 21.91c-.35.2-.76.24-1.08.15l7.84-7.84 2.87-2.87z" />
                    </svg>
                    <div className="text-[10px] font-bold text-left leading-none tracking-wider">
                      Google Play
                    </div>
                  </a>
                </div>
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

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import type { Metadata } from "next";
import Header from "../../../components/Header";
import NewsletterForm from "../../../components/NewsletterForm";
import Pagination from "../../../components/Pagination";
import { pickArticle, getTranslation, type TranslationKey } from "../../../utils/i18n";
import { CATEGORY_MAP, isValidCategorySlug } from "../../../utils/categories";
import { getMergedFeed, type FeedItem } from "../../../utils/feed";
import ImageCredit from "../../../components/ImageCredit";

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
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const lowerSlug = slug.toLowerCase();
  const resolvedParams = await searchParams;
  const pageRaw = resolvedParams.page;
  const page = Math.max(1, Math.floor(Number(Array.isArray(pageRaw) ? pageRaw[0] : pageRaw) || 1));

  if (!isValidCategorySlug(lowerSlug)) {
    return { title: "Category Not Found — SIGHTSYNCH" };
  }

  const map = CATEGORY_MAP[lowerSlug];
  const baseTitle = `${map.ko} (${map.en}) — SIGHTSYNCH JOURNAL`;
  const title = page > 1 ? `${baseTitle} — 페이지 ${page}` : baseTitle;
  const canonicalUrl = page > 1 ? `/category/${lowerSlug}?page=${page}` : `/category/${lowerSlug}`;

  return {
    title,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const lowerSlug = slug.toLowerCase();

  if (!isValidCategorySlug(lowerSlug)) {
    notFound();
  }

  const resolvedSearchParams = await searchParams;
  const pageRaw = resolvedSearchParams.page;
  const pageNumber = Math.max(1, Math.floor(Number(Array.isArray(pageRaw) ? pageRaw[0] : pageRaw) || 1));

  const map = CATEGORY_MAP[lowerSlug];
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value || "ko";
  const t = getTranslation(locale);

  let feedItems: FeedItem[] = [];
  let totalCount = 0;
  let totalPages = 1;
  let currentPage = 1;

  try {
    const feedResult = await getMergedFeed({ category: lowerSlug, page: pageNumber, locale });
    feedItems = feedResult.items;
    totalCount = feedResult.totalCount;
    totalPages = feedResult.totalPages;
    currentPage = feedResult.currentPage;
  } catch (err) {
    console.error("Failed to load merged feed for category:", err);
  }

  if ((!feedItems || feedItems.length === 0) && pageNumber === 1 && totalCount === 0) {
    const mockNorm = MOCK_ARTICLES
      .filter(a => a.category === map.ko || a.category.toLowerCase() === lowerSlug)
      .map((art) => {
        const picked = pickArticle(art, locale) || art;
        return {
          id: picked.id,
          sourceType: "article" as const,
          href: `/article/${picked.id}`,
          title: picked.title,
          summary: picked.summary,
          coverImageUrl: picked.image_url,
          category: picked.category,
          tags: picked.tags,
          date: new Date().toISOString()
        };
      });
    feedItems = mockNorm;
    totalCount = feedItems.length;
    totalPages = 1;
  }

  if (pageNumber > totalPages) {
    notFound();
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

  const categoryHeaderTitle = locale === "en" ? map.en : map.ko;

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
            SIGHTSYNCH JOURNAL — {categoryHeaderTitle} {pageNumber > 1 ? `(PAGE ${pageNumber})` : ""}
          </div>
        </div>

        {/* Dashboard Header */}
        <header className="mb-16 border-b border-neutral-200 pb-8">
          <span className="text-xs font-black uppercase tracking-[0.25em] text-neutral-400 block mb-3">
            ARCHIVE / CATEGORY / {locale === "en" ? map.en.toUpperCase() : map.ko}
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none text-neutral-900 uppercase">
            {categoryHeaderTitle}
          </h1>
        </header>

        {/* Articles Grid */}
        {feedItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 border-b border-neutral-200 pb-16">
            {feedItems.map((item) => (
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

                  <Link href={item.href} className="block">
                    <h2 className="text-xl font-black tracking-tight leading-[1.2] text-[#111111] mb-3 uppercase group-hover:text-neutral-600 transition-colors">
                      {item.title}
                    </h2>
                  </Link>

                  <p className="text-sm leading-relaxed text-neutral-600 font-normal mb-6">
                    {item.summary}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center border-b border-neutral-200">
            <p className="text-sm font-mono uppercase text-neutral-400 tracking-wider mb-4">
              {locale === "en" ? "No articles available in this category." : "이 카테고리에 등록된 기사가 없습니다."}
            </p>
          </div>
        )}

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath={`/category/${lowerSlug}`}
          searchParams={resolvedSearchParams}
        />
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

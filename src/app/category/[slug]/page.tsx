import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../../../components/Header";
import { supabase } from "../../../utils/supabase/client";

export const revalidate = 0;

interface Article {
  id: string;
  title: string;
  summary: string;
  category: string;
  tags: string | string[];
  image_url: string;
  created_at?: string;
}

const CATEGORY_MAP: Record<string, { db: string; displayName: string }> = {
  fashion: { db: "FASHION", displayName: "패션" },
  art: { db: "ART", displayName: "미술" },
  tech: { db: "TECH", displayName: "테크" },
  beauty: { db: "BEAUTY", displayName: "뷰티" },
  lifestyle: { db: "LIFESTYLE", displayName: "라이프스타일" },
};

const MOCK_ARTICLES: Article[] = [
  {
    id: "mock-1",
    title: "L’Oréal × Gucci: The New Synthesis of Luxury Beauty",
    summary: "An exclusive editorial investigation into the intersection of heritage high-fashion couture and advanced cosmetic formulation, redefining luxury cosmetics for a new generation.",
    category: "FASHION",
    tags: ["로레알구찌"],
    image_url: "/hero_loreal_gucci.jpg"
  },
  {
    id: "mock-2",
    title: "Abstract Symmetry: Kandinsky in the Digital Era",
    summary: "Revisiting the geometric revolution of avant-garde modernism and its resonance in current immersive digital art experiences.",
    category: "ART",
    tags: ["모던아트"],
    image_url: "/hero_modern_art.jpg"
  },
  {
    id: "mock-3",
    title: "The Acoustic Plexus: Minimalist Sound Design",
    summary: "Crafting pure soundscapes through mechanical precision and understated industrial architecture in wireless audio.",
    category: "TECH",
    tags: ["무선헤드폰"],
    image_url: "/hero_minimal_headphones.jpg"
  }
];

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const lowerSlug = slug.toLowerCase();

  const categoryInfo = CATEGORY_MAP[lowerSlug];
  if (!categoryInfo) {
    notFound();
  }

  let articles: Article[] = [];

  try {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("category", categoryInfo.db)
      .order("created_at", { ascending: false });

    const hasValidError = error && (
      (error.message && typeof error.message === "string" && error.message.trim() !== "") ||
      (error.code && typeof error.code === "string" && error.code.trim() !== "") ||
      (Object.keys(error).length > 0)
    );

    if (hasValidError) {
      console.error(`Failed to fetch articles for category ${categoryInfo.db}:`, error);
      articles = MOCK_ARTICLES.filter(a => a.category === categoryInfo.db);
    } else if (!data || data.length === 0) {
      console.warn(`No articles returned for category ${categoryInfo.db}. Using fallback if available.`);
      articles = MOCK_ARTICLES.filter(a => a.category === categoryInfo.db);
    } else {
      articles = data;
    }
  } catch (err) {
    console.error("An unexpected error occurred while fetching articles:", err);
    articles = MOCK_ARTICLES.filter(a => a.category === categoryInfo.db);
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
            ← ALL ISSUES
          </Link>
          <div className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-500">
            SIGHTSYNCH JOURNAL — CATEGORY
          </div>
        </div>

        {/* Category Header */}
        <header className="mb-16 border-b border-neutral-200 pb-8">
          <span className="text-xs font-black uppercase tracking-[0.25em] text-neutral-400 block mb-3">
            ARCHIVE BY TOPIC
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none text-neutral-900 uppercase">
            {categoryInfo.displayName} / {categoryInfo.db}
          </h1>
        </header>

        {/* Article Grid */}
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 border-b border-neutral-200 pb-16">
            {articles.map((article) => (
              <article key={article.id} className="flex flex-col justify-between group">
                <div>
                  {/* Image Container */}
                  <Link href={`/article/${article.id}`} className="block relative aspect-[3/2] w-full overflow-hidden bg-neutral-100 mb-6 border border-neutral-200">
                    <Image
                      src={article.image_url || "/hero_modern_art.jpg"}
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 30vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  </Link>

                  {/* Category & Tags */}
                  <div className="flex flex-wrap gap-3 items-center mb-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-950 border border-neutral-950 px-2 py-0.5">
                      {article.category}
                    </span>
                    {renderTags(article.tags)}
                  </div>

                  {/* Title */}
                  <Link href={`/article/${article.id}`} className="block">
                    <h2 className="text-xl font-black tracking-tight leading-[1.2] text-[#111111] mb-3 uppercase group-hover:text-neutral-600 transition-colors">
                      {article.title}
                    </h2>
                  </Link>

                  {/* Summary */}
                  <p className="text-sm leading-relaxed text-neutral-600 font-normal mb-6">
                    {article.summary}
                  </p>
                </div>


              </article>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center border-b border-neutral-200 mb-16">
            <p className="text-sm font-mono uppercase text-neutral-400 tracking-wider mb-4">
              No articles found in this category
            </p>
            <Link 
              href="/" 
              className="inline-block text-xs font-bold tracking-widest uppercase border border-neutral-900 px-6 py-3 hover:bg-neutral-950 hover:text-white transition-colors"
            >
              Go Back Home
            </Link>
          </div>
        )}

        {/* Swiss-inspired Grid blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 text-neutral-500 font-mono text-xs">
          <div>
            <span className="block font-bold text-neutral-900 mb-2 uppercase">01 / BRAND EDITORIAL</span>
            Curated analysis covering the intersections of luxury fashion, modern architecture, sound design, and beauty.
          </div>
          <div>
            <span className="block font-bold text-neutral-900 mb-2 uppercase">02 / ARCHIVE PRINT</span>
            Available quarterly in selected global bookstores and high-end boutiques across Seoul, Tokyo, and Paris.
          </div>
          <div>
            <span className="block font-bold text-neutral-900 mb-2 uppercase">03 / DIGITAL SYNC</span>
            Receive real-time synchronizations of high-fidelity visual culture directly via our dedicated newsletter.
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
                카테고리
              </h3>
              <ul className="space-y-3.5 text-xs text-neutral-600 font-medium">
                <li><Link href="/category/fashion" className="hover:text-black transition-colors">패션</Link></li>
                <li><Link href="/category/art" className="hover:text-black transition-colors">미술</Link></li>
                <li><Link href="/category/tech" className="hover:text-black transition-colors">테크</Link></li>
                <li><Link href="/category/beauty" className="hover:text-black transition-colors">뷰티</Link></li>
                <li><Link href="/category/lifestyle" className="hover:text-black transition-colors">라이프스타일</Link></li>
              </ul>
            </div>

            <div className="md:col-span-1">
              <h3 className="text-xs font-bold tracking-widest mb-6 text-neutral-900 uppercase">
                팔로우
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
                회사소개
              </h3>
              <ul className="space-y-3.5 text-xs text-neutral-600 font-medium">
                <li><Link href="/#newsroom" className="hover:text-black transition-colors">뉴스룸</Link></li>
                <li><Link href="/#careers" className="hover:text-black transition-colors">채용</Link></li>
                <li><Link href="/#partnership" className="hover:text-black transition-colors">광고 및 제휴</Link></li>
                <li><Link href="/#contact" className="hover:text-black transition-colors">연락처</Link></li>
              </ul>
            </div>

            <div className="md:col-span-3 md:pl-12 flex flex-col justify-between">
              <div className="mb-8">
                <h3 className="text-xs font-bold tracking-widest mb-4 text-neutral-900 uppercase">
                  NEWSLETTER
                </h3>
                <p className="text-xs text-neutral-500 mb-4 leading-relaxed font-medium">
                  Sightsynch의 최신 소식을 이메일로 받아보세요.
                </p>
                <form className="flex w-full max-w-md border border-neutral-300 focus-within:border-black transition-colors">
                  <input
                    type="email"
                    placeholder="이메일 주소를 입력하세요"
                    className="w-full px-4 py-3 text-xs bg-white text-black outline-none font-medium placeholder-neutral-400"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-[#0066cc] text-white hover:bg-[#0052a3] px-6 py-3 text-xs font-bold tracking-wider uppercase transition-colors shrink-0"
                  >
                    구독하기
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] font-mono text-neutral-500 tracking-wider">
              © 2026 Sightsynch Limited. All Rights Reserved.
            </p>
            <div className="flex gap-4 text-[10px] font-medium text-neutral-500 tracking-wider">
              <Link href="/#terms" className="hover:text-black transition-colors">이용약관</Link>
              <span>|</span>
              <Link href="/#privacy" className="hover:text-black transition-colors">개인정보처리방침</Link>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}

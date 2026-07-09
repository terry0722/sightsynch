import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header";
import { supabase } from "../utils/supabase/client";

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

export default async function Home() {
  let articles: Article[] = [];

  try {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });

    // Check if error is a valid error object with actual content
    const hasValidError = error && (
      (error.message && typeof error.message === "string" && error.message.trim() !== "") ||
      (error.code && typeof error.code === "string" && error.code.trim() !== "") ||
      (Object.keys(error).length > 0)
    );

    if (hasValidError) {
      console.error("Failed to fetch articles from Supabase:", error);
      articles = MOCK_ARTICLES;
    } else if (!data || data.length === 0) {
      console.warn("No articles returned from Supabase. Falling back to mock data.");
      articles = MOCK_ARTICLES;
    } else {
      articles = data;
    }
  } catch (err) {
    console.error("An unexpected error occurred while fetching articles:", err);
    articles = MOCK_ARTICLES;
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

  const heroArticle = articles[0];
  const sideArticles = articles.slice(1, 3);
  const extraArticles = articles.slice(3);

  return (
    <div className="min-h-screen bg-white text-[#111111] font-sans antialiased selection:bg-[#111111] selection:text-white">
      {/* Interactive Header with Top Utility Bar */}
      <Header />

      {/* Main Content & Hero Section */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20">
        
        {/* Editorial Subheader / Date */}
        <div className="flex justify-between items-end border-b border-neutral-200 pb-4 mb-12">
          <div className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-500">
            SIGHTSYNCH JOURNAL — ISSUE 01
          </div>
          <div className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-500">
            SEOUL / GLOBAL
          </div>
        </div>

        {/* Asymmetric Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-b border-neutral-200">
          
          {/* Left Column: Largest Main Article Card (col-span-7) */}
          {heroArticle ? (
            <article className="lg:col-span-7 lg:pr-12 lg:border-r border-neutral-200 pb-12 lg:pb-20 flex flex-col justify-between group">
              <div>
                {/* Image Container */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100 mb-8 border border-neutral-200">
                  <Image
                    src={heroArticle.image_url || "/hero_loreal_gucci.jpg"}
                    alt={heroArticle.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    priority
                  />
                </div>

                {/* Category & Tags */}
                <div className="flex flex-wrap gap-3 items-center mb-4">
                  {heroArticle.category && (
                    <span className="text-xs font-black uppercase tracking-[0.25em] text-neutral-900 border border-neutral-900 px-2 py-0.5">
                      {heroArticle.category}
                    </span>
                  )}
                  {renderTags(heroArticle.tags)}
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.1] text-[#111111] mb-6 uppercase group-hover:text-neutral-600 transition-colors">
                  {heroArticle.title}
                </h1>

                {/* Summary */}
                <p className="text-base md:text-lg leading-relaxed text-neutral-600 font-normal max-w-2xl mb-8">
                  {heroArticle.summary}
                </p>
              </div>

              {/* Read More Link */}
              <div>
                <Link 
                  href={`/article/${heroArticle.id}`} 
                  className="inline-flex items-center gap-2 text-sm font-bold tracking-widest uppercase border-b border-[#111111] pb-1 hover:text-neutral-500 hover:border-neutral-500 transition-all"
                >
                  READ ARTICLE
                  <span className="text-xs">↗</span>
                </Link>
              </div>
            </article>
          ) : (
            <div className="lg:col-span-7 lg:pr-12 lg:border-r border-neutral-200 pb-12 lg:pb-20 flex items-center justify-center text-sm font-mono text-neutral-500 uppercase tracking-widest">
              No Articles Available
            </div>
          )}

          {/* Right Column: 2 Medium Article Cards stacked (col-span-5) */}
          <div className="lg:col-span-5 lg:pl-12 flex flex-col divide-y divide-neutral-200">
            {sideArticles.length > 0 ? (
              sideArticles.map((article, index) => (
                <article 
                  key={article.id} 
                  className={`flex flex-col justify-between group ${
                    index === 0 ? "pb-12 lg:pb-16 pt-12 lg:pt-0" : "pt-12 lg:pt-16 pb-12"
                  }`}
                >
                  <div>
                    {/* Image Container */}
                    <div className="relative aspect-[3/2] w-full overflow-hidden bg-neutral-100 mb-6 border border-neutral-200">
                      <Image
                        src={article.image_url || (index === 0 ? "/hero_modern_art.jpg" : "/hero_minimal_headphones.jpg")}
                        alt={article.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      />
                    </div>

                    {/* Category & Tags */}
                    <div className="flex flex-wrap gap-3 items-center mb-3">
                      {article.category && (
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-900 border border-neutral-900 px-2 py-0.5">
                          {article.category}
                        </span>
                      )}
                      {renderTags(article.tags)}
                    </div>

                    {/* Title */}
                    <h2 className="text-xl md:text-2xl font-black tracking-tight leading-[1.2] text-[#111111] mb-3 uppercase group-hover:text-neutral-600 transition-colors">
                      {article.title}
                    </h2>

                    {/* Summary */}
                    <p className="text-sm leading-relaxed text-neutral-600 font-normal mb-6">
                      {article.summary}
                    </p>
                  </div>

                  {/* Read More Link */}
                  <div>
                    <Link 
                      href={`/article/${article.id}`} 
                      className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase border-b border-[#111111] pb-1 hover:text-neutral-500 hover:border-neutral-500 transition-all"
                    >
                      READ ARTICLE
                      <span className="text-[10px]">↗</span>
                    </Link>
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

        {/* Remaining Articles Grid */}
        {extraArticles.length > 0 && (
          <div className="border-t border-neutral-200 pt-16 mt-16">
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-500 mb-12">
              ARCHIVE / MORE ARTICLES
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {extraArticles.map((article) => (
                <article key={article.id} className="flex flex-col justify-between group">
                  <div>
                    {/* Image Container */}
                    <div className="relative aspect-[3/2] w-full overflow-hidden bg-neutral-100 mb-6 border border-neutral-200">
                      <Image
                        src={article.image_url || "/hero_modern_art.jpg"}
                        alt={article.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 30vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      />
                    </div>

                    {/* Category & Tags */}
                    <div className="flex flex-wrap gap-3 items-center mb-3">
                      {article.category && (
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-900 border border-neutral-900 px-2 py-0.5">
                          {article.category}
                        </span>
                      )}
                      {renderTags(article.tags)}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-black tracking-tight leading-[1.2] text-[#111111] mb-3 uppercase group-hover:text-neutral-600 transition-colors">
                      {article.title}
                    </h3>

                    {/* Summary */}
                    <p className="text-sm leading-relaxed text-neutral-600 font-normal mb-6">
                      {article.summary}
                    </p>
                  </div>

                  {/* Read More Link */}
                  <div>
                    <Link 
                      href={`/article/${article.id}`} 
                      className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase border-b border-[#111111] pb-1 hover:text-neutral-500 hover:border-neutral-500 transition-all"
                    >
                      READ ARTICLE
                      <span className="text-[10px]">↗</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Footer info/Swiss-inspired Grid blocks */}
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

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          {/* Footer Logo */}
          <div className="mb-12">
            <Link href="/" className="text-3xl font-black tracking-[0.15em] lowercase hover:opacity-80 transition-opacity">
              sightsynch
            </Link>
          </div>

          {/* 6-Column Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-12 md:gap-8 mb-16">
            
            {/* Column 1: 카테고리 (col-span-1) */}
            <div className="md:col-span-1">
              <h3 className="text-xs font-bold tracking-widest mb-6 text-neutral-900 uppercase">
                카테고리
              </h3>
              <ul className="space-y-3.5 text-xs text-neutral-600 font-medium">
                <li><Link href="/#apparel" className="hover:text-black transition-colors">패션</Link></li>
                <li><Link href="/#art" className="hover:text-black transition-colors">미술</Link></li>
                <li><Link href="/#tech" className="hover:text-black transition-colors">테크</Link></li>
                <li><Link href="/#beauty" className="hover:text-black transition-colors">뷰티</Link></li>
                <li><Link href="/#lifestyle" className="hover:text-black transition-colors">라이프스타일</Link></li>
              </ul>
            </div>

            {/* Column 2: 팔로우 (col-span-1) */}
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
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors" aria-label="Facebook">
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

            {/* Column 3: 회사소개 (col-span-1) */}
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

            {/* Columns 4, 5, 6: 뉴스레터 및 앱 다운로드 (col-span-3) */}
            <div className="md:col-span-3 md:pl-12 flex flex-col justify-between">
              {/* Newsletter form */}
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
                    className="bg-[#0066cc] text-white hover:bg-[#0052a3] px-6 py-3 text-xs font-bold tracking-wider uppercase transition-colors shrink-0 whitespace-nowrap"
                  >
                    구독하기
                  </button>
                </form>
              </div>

              {/* App download buttons */}
              <div>
                <h4 className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-3.5">
                  DOWNLOAD APP
                </h4>
                <div className="flex gap-3">
                  {/* App Store */}
                  <a
                    href="https://apps.apple.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 border border-neutral-300 px-4 py-2 hover:bg-neutral-50 hover:border-black transition-all"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.69-1.12 1.84-.98 2.94.12.01.19.02.26.02.92 0 2.01-.58 2.55-1.35" />
                    </svg>
                    <div className="text-[10px] font-bold text-left leading-none tracking-wider">
                      App Store
                    </div>
                  </a>
                  {/* Google Play */}
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

          {/* Bottom Copyright Information */}
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

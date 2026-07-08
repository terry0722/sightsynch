import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../../../components/Header";
import { supabase } from "../../../utils/supabase/client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ArticlePage({ params }: PageProps) {
  const { id } = await params;

  // Fetch the specific article
  const { data: article, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .single();

  // If error or no article is found, trigger notFound
  if (error || !article) {
    notFound();
  }

  // Format date elegantly
  const formattedDate = article.created_at
    ? new Date(article.created_at).toLocaleDateString("ko-KR", {
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

  const renderMarkdown = (text: string) => {
    if (!text) return null;
    return text.split("\n\n").map((paragraph, index) => {
      const trimmed = paragraph.trim();
      if (!trimmed) return null;

      // Handle headers
      if (trimmed.startsWith("### ")) {
        return (
          <h4 key={index} className="text-lg font-black mt-8 mb-4 uppercase tracking-wide text-neutral-900 border-l-2 border-neutral-950 pl-3">
            {trimmed.replace("### ", "")}
          </h4>
        );
      }
      if (trimmed.startsWith("## ")) {
        return (
          <h3 key={index} className="text-xl md:text-2xl font-black mt-12 mb-6 uppercase tracking-tight text-neutral-900">
            {trimmed.replace("## ", "")}
          </h3>
        );
      }
      if (trimmed.startsWith("# ")) {
        return (
          <h2 key={index} className="text-2xl md:text-3xl font-black mt-16 mb-8 uppercase tracking-tight text-neutral-900">
            {trimmed.replace("# ", "")}
          </h2>
        );
      }

      // Handle blockquotes
      if (trimmed.startsWith("> ")) {
        return (
          <blockquote key={index} className="border-l-4 border-neutral-300 pl-6 my-8 italic text-neutral-600 text-lg leading-relaxed max-w-2xl mx-auto">
            {trimmed.replace("> ", "")}
          </blockquote>
        );
      }

      // Handle bullet points
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        const items = trimmed.split(/\n[-*]\s/).map(item => item.replace(/^[-*]\s/, ""));
        return (
          <ul key={index} className="list-disc pl-6 space-y-3 mb-8 text-neutral-700 font-normal">
            {items.map((item, i) => (
              <li key={i} className="text-base md:text-lg leading-relaxed">{item}</li>
            ))}
          </ul>
        );
      }

      // Standard paragraph
      return (
        <p key={index} className="text-base md:text-lg leading-relaxed text-neutral-700 mb-8 font-normal">
          {trimmed}
        </p>
      );
    });
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
            ← BACK TO ISSUES
          </Link>
          <div className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-500 hidden sm:block">
            SIGHTSYNCH JOURNAL — ARTICLE
          </div>
        </div>

        {/* Inverse L-Shape structure layout */}
        {/* Top Center Layout: Metadata Header */}
        <header className="max-w-4xl mx-auto text-center mb-16 md:mb-24">
          {article.category && (
            <span className="inline-block text-xs font-black uppercase tracking-[0.25em] text-neutral-900 border border-neutral-900 px-3 py-1 mb-8">
              {article.category}
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
            <span>GLOBAL ARCHIVE</span>
          </div>
        </header>

        {/* Center Layout: High-resolution Large Image */}
        {article.image_url && (
          <div className="w-full overflow-hidden bg-neutral-100 border border-neutral-200 mb-16 md:mb-24 relative aspect-[16/9] md:aspect-[21/9]">
            <Image
              src={article.image_url}
              alt={article.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </div>
        )}

        {/* Body Section Layout (Whitespace generous container) */}
        <section className="max-w-3xl mx-auto pb-16 border-b border-neutral-200">
          <div className="prose prose-neutral max-w-none">
            {renderMarkdown(article.body_markdown)}
          </div>
        </section>

        {/* Tags Section Layout */}
        {article.tags && (
          <section className="max-w-3xl mx-auto pt-8 flex flex-wrap gap-3 items-center">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 mr-2">Tags:</span>
            {renderTags(article.tags)}
          </section>
        )}

        {/* Extra Footer block */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-20 mt-20 border-t border-neutral-200 text-neutral-500 font-mono text-xs">
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
                <li><Link href="/#apparel" className="hover:text-black transition-colors">패션</Link></li>
                <li><Link href="/#art" className="hover:text-black transition-colors">미술</Link></li>
                <li><Link href="/#audio" className="hover:text-black transition-colors">음향기기</Link></li>
                <li><Link href="/#beauty" className="hover:text-black transition-colors">뷰티</Link></li>
                <li><Link href="/#lifestyle" className="hover:text-black transition-colors">라이프스타일</Link></li>
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

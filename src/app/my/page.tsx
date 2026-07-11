import React from "react";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import Header from "../../components/Header";
import { createClient } from "../../utils/supabase/server";

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

export default async function MyPage() {
  const supabase = await createClient();

  // Redirect to login if user session does not exist
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login?next=/my");
  }

  // Fetch user's bookmarked articles
  const { data: bookmarksData, error } = await supabase
    .from("bookmarks")
    .select(`
      article_id,
      articles:article_id (
        id,
        title,
        summary,
        category,
        tags,
        image_url,
        created_at
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("북마크 조회 실패:", error);
  }

  // Extract nested articles safely
  const bookmarkedArticles: Article[] = (bookmarksData as unknown as Array<{ articles: Article }> || [])
    .map((item) => item.articles)
    .filter(Boolean);

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
            ← BACK TO HOME
          </Link>
          <div className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-500">
            SIGHTSYNCH JOURNAL — MEMBER ARCHIVE
          </div>
        </div>

        {/* Dashboard Header */}
        <header className="mb-16 border-b border-neutral-200 pb-8">
          <span className="text-xs font-black uppercase tracking-[0.25em] text-neutral-400 block mb-3">
            YOUR COLLECTED ISSUES ({bookmarkedArticles.length})
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none text-neutral-900 uppercase">
            내 북마크 목록
          </h1>
          <p className="text-xs text-neutral-500 font-mono mt-2">
            MEMBER: {user.email}
          </p>
        </header>

        {/* Bookmarks Grid */}
        {bookmarkedArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 border-b border-neutral-200 pb-16">
            {bookmarkedArticles.map((article) => (
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
              저장된 북마크가 없습니다.
            </p>
            <Link 
              href="/" 
              className="inline-block text-xs font-bold tracking-widest uppercase border border-neutral-900 px-6 py-3 hover:bg-neutral-950 hover:text-white transition-colors"
            >
              기사 둘러보기
            </Link>
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

import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import Header from "../../components/Header";
import NewsletterForm from "../../components/NewsletterForm";
import { getTranslation } from "../../utils/i18n";

export const metadata: Metadata = {
  title: "회사소개 | SIGHTSYNCH",
  description: "SIGHTSYNCH 에디토리얼 매거진 소개",
};

export default async function AboutPage() {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value || "ko";
  const t = getTranslation(locale);

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black flex flex-col justify-between">
      <div>
        {/* Header */}
        <Header />

        {/* Main Content Container */}
        <main className="max-w-4xl mx-auto px-6 py-12 md:py-16">
          {/* Breadcrumb / Top label */}
          <div className="mb-8 border-b border-neutral-200 dark:border-neutral-800 pb-6">
            <Link
              href="/"
              className="text-xs font-mono tracking-widest text-neutral-400 dark:text-neutral-500 hover:text-black dark:hover:text-white uppercase transition-colors"
            >
              ← {t("backToHome")}
            </Link>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-4 mb-2">
              SIGHTSYNCH 소개
            </h1>
            <p className="text-xs font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
              About SIGHTSYNCH
            </p>
          </div>

          {/* About Body */}
          <article className="prose prose-neutral dark:prose-invert max-w-none text-sm md:text-base leading-relaxed space-y-8">
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium">
              SIGHTSYNCH는 패션, 예술, 테크, 라이프스타일 전반을 다루는 에디토리얼 매거진입니다.<br />
              2026년 6월부터 &quot;매일 아침 관심사 뉴스를 보기 위해 시작, 아침에 뇌를 깨우는 뉴스를 3-5개 읽으며 하루를 시작하자&quot;는 철학을 바탕으로 운영되고 있습니다.
            </p>

            <section className="space-y-4 pt-4 border-t border-neutral-100 dark:border-neutral-900">
              <h2 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                연락처
              </h2>
              <div className="bg-neutral-50 dark:bg-neutral-900/60 p-4 border border-neutral-200 dark:border-neutral-800 text-sm font-mono space-y-2 text-neutral-700 dark:text-neutral-300">
                <p><span className="font-semibold text-neutral-900 dark:text-neutral-100">제휴 및 문의:</span> ps105ps@gmail.com</p>
              </div>
            </section>
          </article>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 pt-16 pb-12 mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <Link
              href="/"
              className="text-2xl font-black tracking-[0.2em] uppercase hover:opacity-70 transition-opacity"
            >
              sightsynch
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-12 md:gap-8 mb-16">
            <div className="md:col-span-1">
              <h3 className="text-xs font-bold tracking-widest mb-6 text-neutral-900 dark:text-neutral-100 uppercase">
                {t("byCategory")}
              </h3>
              <ul className="space-y-3.5 text-xs text-neutral-600 dark:text-neutral-400 font-medium">
                <li><Link href="/category/fashion" className="hover:text-black dark:hover:text-white transition-colors">{t("fashion")}</Link></li>
                <li><Link href="/category/art" className="hover:text-black dark:hover:text-white transition-colors">{t("art")}</Link></li>
                <li><Link href="/category/tech" className="hover:text-black dark:hover:text-white transition-colors">{t("tech")}</Link></li>
                <li><Link href="/category/beauty" className="hover:text-black dark:hover:text-white transition-colors">{t("beauty")}</Link></li>
                <li><Link href="/category/lifestyle" className="hover:text-black dark:hover:text-white transition-colors">{t("lifestyle")}</Link></li>
              </ul>
            </div>

            <div className="md:col-span-1">
              <h3 className="text-xs font-bold tracking-widest mb-6 text-neutral-900 dark:text-neutral-100 uppercase">
                {t("follow")}
              </h3>
              <div className="flex gap-4 items-center text-neutral-600 dark:text-neutral-400">
                <a href="https://www.instagram.com/byeolfather/" target="_blank" rel="noopener noreferrer" className="hover:text-black dark:hover:text-white transition-colors" aria-label="Instagram">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a href="https://www.facebook.com/Sightsynch/" target="_blank" rel="noopener noreferrer" className="hover:text-black dark:hover:text-white transition-colors" aria-label="Facebook">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
              </div>
            </div>

            <div className="md:col-span-1">
              <h3 className="text-xs font-bold tracking-widest mb-6 text-neutral-900 dark:text-neutral-100 uppercase">
                {t("company")}
              </h3>
              <ul className="space-y-3.5 text-xs text-neutral-600 dark:text-neutral-400 font-medium">
                <li><Link href="/about" className="hover:text-black dark:hover:text-white transition-colors">{t("about")}</Link></li>

                <li><Link href="/#partnership" className="hover:text-black dark:hover:text-white transition-colors">{t("partnership")}</Link></li>
                <li><Link href="/contact" className="hover:text-black dark:hover:text-white transition-colors">{t("contact")}</Link></li>
              </ul>
            </div>

            <div className="md:col-span-3 md:pl-12 flex flex-col justify-between">
              <div className="mb-8">
                <h3 className="text-xs font-bold tracking-widest mb-4 text-neutral-900 dark:text-neutral-100 uppercase">
                  {t("newsletterTitle")}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4 leading-relaxed font-medium">
                  {t("newsletterDesc")}
                </p>
                <NewsletterForm locale={locale} />
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 tracking-wider">
              © 2026 Sightsynch Limited. All Rights Reserved.
            </p>
            <div className="flex gap-4 text-[10px] font-medium text-neutral-500 dark:text-neutral-400 tracking-wider">
              <Link href="/terms" className="hover:text-black dark:hover:text-white transition-colors">{t("terms")}</Link>
              <span>|</span>
              <Link href="/privacy" className="hover:text-black dark:hover:text-white transition-colors">{t("privacy")}</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

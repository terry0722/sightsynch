import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import Header from "../../components/Header";
import NewsletterForm from "../../components/NewsletterForm";
import { getTranslation } from "../../utils/i18n";

export const metadata: Metadata = {
  title: "문의하기 | SIGHTSYNCH",
  description: "SIGHTSYNCH 일반 문의, 제휴, 광고 관련 문의",
};

export default async function ContactPage() {
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
              문의하기
            </h1>
            <p className="text-xs font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
              Contact SIGHTSYNCH
            </p>
          </div>

          {/* Contact Body */}
          <article className="prose prose-neutral dark:prose-invert max-w-none text-sm md:text-base leading-relaxed space-y-8">
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium">
              일반 문의, 제휴, 광고 관련 문의는 아래 이메일로 연락해 주시기 바랍니다.
            </p>

            <section className="space-y-4 pt-4 border-t border-neutral-100 dark:border-neutral-900">
              <h2 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                연락처 정보
              </h2>
              <div className="bg-neutral-50 dark:bg-neutral-900/60 p-6 border border-neutral-200 dark:border-neutral-800 text-sm font-mono space-y-4 text-neutral-700 dark:text-neutral-300">
                <div>
                  <p className="font-bold text-neutral-900 dark:text-neutral-100 mb-1">이메일 (E-mail)</p>
                  <a href="mailto:ps105ps@gmail.com" className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors underline underline-offset-4">
                    ps105ps@gmail.com
                  </a>
                </div>
                <div>
                  <p className="font-bold text-neutral-900 dark:text-neutral-100 mb-1">운영 주체 (Operator)</p>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    SIGHTSYNCH · 유정태
                  </p>
                </div>
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
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-black dark:hover:text-white transition-colors" aria-label="Instagram">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
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
                <li><Link href="/#newsroom" className="hover:text-black dark:hover:text-white transition-colors">{t("newsroom")}</Link></li>
                <li><Link href="/#careers" className="hover:text-black dark:hover:text-white transition-colors">{t("careers")}</Link></li>
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

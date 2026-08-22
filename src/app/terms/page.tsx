import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import Header from "../../components/Header";
import NewsletterForm from "../../components/NewsletterForm";
import { getTranslation } from "../../utils/i18n";

export const metadata: Metadata = {
  title: "이용약관 | SIGHTSYNCH",
  description: "SIGHTSYNCH 서비스 이용약관입니다.",
};

export default async function TermsPage() {
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
              이용약관
            </h1>
            <p className="text-xs font-mono text-neutral-400 dark:text-neutral-500">
              SIGHTSYNCH TERMS OF SERVICE
            </p>
          </div>

          {/* Terms Body */}
          <article className="prose prose-neutral dark:prose-invert max-w-none text-sm md:text-base leading-relaxed space-y-8">
            <section className="space-y-3">
              <h2 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100 border-b border-neutral-100 dark:border-neutral-900 pb-2">
                제1조 (목적)
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                본 약관은 SIGHTSYNCH(이하 &quot;sightsynch&quot;)가 운영하는 SIGHTSYNCH(이하 &quot;News&quot;)의 이용조건 및 절차, 이용자와 회사의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100 border-b border-neutral-100 dark:border-neutral-900 pb-2">
                제2조 (서비스의 내용)
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                회사는 패션, 예술, 테크, 뷰티, 라이프스타일 등 분야의 에디토리얼 콘텐츠를 제공합니다.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100 border-b border-neutral-100 dark:border-neutral-900 pb-2">
                제3조 (콘텐츠 저작권 및 인용)
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                서비스 내 게시물 중 외부 매체를 인용·참고한 콘텐츠는 원문 출처를 명시하며, 저작권법에서 허용하는 범위 내에서 인용합니다. 삽입된 이미지는 별도 표기가 없는 한 기사 내용과 직접적인 연관이 없는 편집용 이미지입니다.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100 border-b border-neutral-100 dark:border-neutral-900 pb-2">
                제4조 (이용자의 의무)
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                이용자는 관계 법령, 본 약관의 규정 등을 준수하여야 하며, 서비스의 정상적인 운영을 방해하는 행위를 해서는 안 됩니다.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100 border-b border-neutral-100 dark:border-neutral-900 pb-2">
                제5조 (광고 게재)
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                회사는 서비스 화면에 광고를 게재할 수 있으며, Google AdSense 등 제3자 광고 서비스를 통해 맞춤형 광고가 표시될 수 있습니다.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100 border-b border-neutral-100 dark:border-neutral-900 pb-2">
                제6조 (면책조항)
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우 책임이 면제됩니다.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100 border-b border-neutral-100 dark:border-neutral-900 pb-2">
                제7조 (문의)
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                서비스 이용 관련 문의는 ps105ps@gmail.com으로 접수해 주시기 바랍니다.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100 border-b border-neutral-100 dark:border-neutral-900 pb-2">
                부칙
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                본 약관은 2026-08-01부터 시행됩니다.
              </p>
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

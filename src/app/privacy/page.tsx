import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import Header from "../../components/Header";
import NewsletterForm from "../../components/NewsletterForm";
import { getTranslation } from "../../utils/i18n";

export const metadata: Metadata = {
  title: "개인정보처리방침 | SIGHTSYNCH",
  description: "SIGHTSYNCH 서비스의 개인정보처리방침입니다.",
};

export default async function PrivacyPage() {
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
              개인정보처리방침
            </h1>
            <p className="text-xs font-mono text-neutral-400 dark:text-neutral-500">
              SIGHTSYNCH PRIVACY POLICY
            </p>
          </div>

          {/* Policy Body */}
          <article className="prose prose-neutral dark:prose-invert max-w-none text-sm md:text-base leading-relaxed space-y-8">
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed font-medium">
              SIGHTSYNCH(이하 &quot;회사&quot;)은 이용자의 개인정보를 중요시하며, 「개인정보 보호법」 등 관련 법령을 준수하고 있습니다.
            </p>

            <section className="space-y-3">
              <h2 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100 border-b border-neutral-100 dark:border-neutral-900 pb-2">
                1. 수집하는 개인정보 항목
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                회사는 문의 및 제휴 접수 시 아래 정보를 수집합니다.
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-neutral-600 dark:text-neutral-400">
                <li>필수: 이메일 주소, 문의 내용</li>
                <li>자동 수집: 접속 IP, 쿠키, 브라우저 종류, 방문 일시, 서비스 이용 기록</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100 border-b border-neutral-100 dark:border-neutral-900 pb-2">
                2. 개인정보 수집 및 이용 목적
              </h2>
              <ul className="list-disc pl-5 space-y-1.5 text-neutral-600 dark:text-neutral-400">
                <li>이용자 문의 및 민원 처리</li>
                <li>서비스 개선 및 통계 분석</li>
                <li>맞춤형 광고 제공 (Google AdSense 등)</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100 border-b border-neutral-100 dark:border-neutral-900 pb-2">
                3. 개인정보의 보유 및 이용기간
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                수집일로부터 1년 또는 목적 달성 시까지 보유하며, 관련 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관합니다.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100 border-b border-neutral-100 dark:border-neutral-900 pb-2">
                4. 쿠키(Cookie)의 사용 및 광고 서비스
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                본 사이트는 Google을 포함한 제3자 광고 공급업체가 쿠키를 사용하여 이용자의 이전 방문 기록을 바탕으로 광고를 게재할 수 있습니다.
                Google의 광고 쿠키 사용으로 인해 Google과 광고 파트너는 본 사이트 및/또는 인터넷의 다른 사이트 방문 정보를 기반으로 이용자에게 광고를 게재할 수 있습니다.
              </p>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                이용자는{" "}
                <a
                  href="https://www.google.com/settings/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 hover:text-black dark:hover:text-white transition-colors"
                >
                  Google 광고 설정 페이지
                </a>
                에서 맞춤 광고를 비활성화할 수 있으며,{" "}
                <a
                  href="https://www.aboutads.info"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 hover:text-black dark:hover:text-white transition-colors"
                >
                  www.aboutads.info
                </a>
                를 방문하여 제3자 맞춤 광고 쿠키를 비활성화할 수도 있습니다.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100 border-b border-neutral-100 dark:border-neutral-900 pb-2">
                5. 개인정보의 제3자 제공
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않으며, 다만 아래의 경우는 예외로 합니다.
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-neutral-600 dark:text-neutral-400">
                <li>이용자가 사전에 동의한 경우</li>
                <li>법령의 규정에 의거하거나 수사 목적으로 법령에 정해진 절차와 방법에 따라 요구가 있는 경우</li>
                <li>Google AdSense 등 광고 서비스 제공을 위해 필요한 최소한의 정보(쿠키 기반 비식별 정보)가 제공되는 경우</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100 border-b border-neutral-100 dark:border-neutral-900 pb-2">
                6. 이용자의 권리와 행사 방법
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                이용자는 언제든지 자신의 개인정보를 조회하거나 수정, 삭제, 처리 정지를 요청할 수 있으며, 아래 연락처로 요청하실 수 있습니다.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100 border-b border-neutral-100 dark:border-neutral-900 pb-2">
                7. 개인정보 보호책임자
              </h2>
              <div className="bg-neutral-50 dark:bg-neutral-900/60 p-4 border border-neutral-200 dark:border-neutral-800 text-xs font-mono space-y-1.5 text-neutral-700 dark:text-neutral-300">
                <p>성명: 유정태</p>
                <p>이메일: ps105ps@gmail.com</p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100 border-b border-neutral-100 dark:border-neutral-900 pb-2">
                8. 시행일자
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                본 개인정보처리방침은 2026-08-01부터 시행됩니다.
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

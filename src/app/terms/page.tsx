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
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium">
              본 약관은 SIGHTSYNCH(이하 &quot;회사&quot;)가 제공하는 정보 및 에디토리얼 서비스(이하 &quot;서비스&quot;)의 이용과 관련하여 회사와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
            </p>

            <section className="space-y-3">
              <h2 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100 border-b border-neutral-100 dark:border-neutral-900 pb-2">
                제1조 (서비스의 제공 및 변경)
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                1. 회사는 패션, 예술, 테크, 뷰티, 라이프스타일 등 다양한 분야의 정보 및 에디토리얼 콘텐츠를 제공합니다.<br />
                2. 회사는 필요한 경우 서비스의 내용을 추가, 변경 또는 중단할 수 있으며, 이 경우 사전에 공지합니다. 단, 불가피한 사유가 있는 경우 사후에 공지할 수 있습니다.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100 border-b border-neutral-100 dark:border-neutral-900 pb-2">
                제2조 (저작권 및 지적재산권)
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                1. 회사가 작성하여 제공하는 모든 콘텐츠(기사, 이미지, 영상, 디자인 등)에 대한 저작권 및 지적재산권은 회사에 귀속됩니다.<br />
                2. 서비스 내 게시물 중 외부 매체를 인용하거나 참고한 콘텐츠는 원문 출처를 명시하며, 저작권법에서 허용하는 범위 내에서 합법적으로 인용합니다.<br />
                3. 삽입된 이미지는 별도 표기가 없는 한 기사 내용과 관련하여 참고용으로 사용된 합법적인 소스(무료 이미지 또는 라이선스 획득)입니다.<br />
                4. 이용자는 회사의 사전 승낙 없이 서비스 내의 콘텐츠를 무단으로 복제, 전송, 배포, 기타 상업적 목적으로 사용할 수 없습니다.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100 border-b border-neutral-100 dark:border-neutral-900 pb-2">
                제3조 (이용자의 의무 및 사용자 제작 콘텐츠)
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                1. 이용자는 관계 법령, 본 약관의 규정, 공서양속을 준수하여야 하며, 서비스의 정상적인 운영을 방해하는 행위를 해서는 안 됩니다.<br />
                2. 이용자가 작성한 댓글 등의 콘텐츠로 인해 발생하는 저작권 침해 등 모든 법적 책임은 작성자 본인에게 있습니다.<br />
                3. 회사는 이용자의 게시물이 법령에 위반되거나 타인의 권리를 침해한다고 판단되는 경우, 임의로 삭제 또는 노출을 제한할 수 있습니다.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100 border-b border-neutral-100 dark:border-neutral-900 pb-2">
                제4조 (광고 게재 및 제3자 링크)
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                1. 회사는 서비스 운영 및 정보 제공의 목적으로 화면에 배너, 동영상 등 다양한 형태의 광고를 게재할 수 있습니다. (예: Google AdSense 등)<br />
                2. 서비스 내 포함된 제3자 웹사이트나 링크로 이동할 경우, 해당 사이트의 정책과 약관이 적용되며 회사는 그 내용이나 거래에 대해 어떠한 책임도 지지 않습니다.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100 border-b border-neutral-100 dark:border-neutral-900 pb-2">
                제5조 (면책 및 책임제한)
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                1. 회사는 천재지변, 디도스(DDoS) 공격, 서버 장애 등 불가항력적 사유로 인해 서비스를 제공할 수 없는 경우 책임을 면합니다.<br />
                2. 회사는 제공하는 정보, 자료, 사실의 신뢰도 및 정확성에 대해 보증하지 않으며, 이용자가 이를 활용하여 발생한 손해에 대해 책임을 지지 않습니다.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100 border-b border-neutral-100 dark:border-neutral-900 pb-2">
                제6조 (준거법 및 재판관할)
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                본 약관의 해석 및 회사와 이용자 간의 분쟁에 대해서는 대한민국의 법률을 적용하며, 분쟁 발생 시 관할 법원은 민사소송법에 따릅니다.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100 border-b border-neutral-100 dark:border-neutral-900 pb-2">
                제7조 (문의)
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                이용약관 및 서비스 이용과 관련된 모든 문의사항은 ps105ps@gmail.com 으로 연락해 주시기 바랍니다.
              </p>
            </section>

            <section className="space-y-3 mt-12">
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm">
                부칙<br />
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
                <a href="https://www.instagram.com/sightsynch/" target="_blank" rel="noopener noreferrer" className="hover:text-black dark:hover:text-white transition-colors" aria-label="Instagram">
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
                <li><Link href="/contact" className="hover:text-black dark:hover:text-white transition-colors">{t("partnership")}</Link></li>
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

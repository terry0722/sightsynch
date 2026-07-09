import Header from "../components/Header";

const ArticleSkeleton = ({ isHero = false }: { isHero?: boolean }) => (
  <div className={`animate-pulse flex flex-col justify-between h-full ${isHero ? "lg:pr-12" : ""}`}>
    <div>
      <div className={`relative w-full overflow-hidden bg-neutral-100 mb-8 border border-neutral-200 ${isHero ? "aspect-[3/4]" : "aspect-[3/2]"}`} />
      <div className="flex gap-3 items-center mb-4">
        <div className="h-5 w-16 bg-neutral-200" />
        <div className="h-4 w-20 bg-neutral-100" />
      </div>
      <div className="space-y-3 mb-6">
        <div className="h-8 bg-neutral-200 w-11/12" />
        <div className="h-8 bg-neutral-200 w-3/4" />
      </div>
      <div className="space-y-2 mb-8">
        <div className="h-4 bg-neutral-100 w-full" />
        <div className="h-4 bg-neutral-100 w-5/6" />
      </div>
    </div>
    <div className="h-4 bg-neutral-200 w-24" />
  </div>
);

export default function Loading() {
  return (
    <div className="min-h-screen bg-white text-[#111111] font-sans antialiased selection:bg-[#111111] selection:text-white">
      <Header />

      <main className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20">
        <div className="flex justify-between items-end border-b border-neutral-200 pb-4 mb-12">
          <div className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-500">
            SIGHTSYNCH JOURNAL — ISSUE 01
          </div>
          <div className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-500">
            SEOUL / GLOBAL
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-b border-neutral-200 pb-12 lg:pb-20">
          <div className="lg:col-span-7 lg:border-r border-neutral-200">
            <ArticleSkeleton isHero={true} />
          </div>
          <div className="lg:col-span-5 lg:pl-12 flex flex-col gap-12 divide-y divide-neutral-200">
            <div>
              <ArticleSkeleton isHero={false} />
            </div>
            <div className="pt-12">
              <ArticleSkeleton isHero={false} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

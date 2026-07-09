import Link from "next/link";
import Header from "../components/Header";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white text-[#111111] font-sans antialiased selection:bg-[#111111] selection:text-white flex flex-col justify-between">
      <div>
        {/* Navigation Header */}
        <Header />
        
        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-36 text-center">
          <div className="max-w-md mx-auto">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-400 block mb-6">
              Error Code / 404
            </span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight uppercase mb-8 leading-none">
              PAGE NOT FOUND
            </h1>
            <p className="text-neutral-500 text-sm md:text-base leading-relaxed mb-12 max-w-sm mx-auto font-medium">
              존재하지 않거나 삭제된 페이지입니다. 주소를 다시 한번 확인해 주세요.
            </p>
            <Link 
              href="/"
              className="inline-block bg-neutral-900 text-white text-xs font-bold tracking-widest uppercase px-8 py-4 border border-neutral-900 hover:bg-white hover:text-neutral-950 transition-colors duration-200"
            >
              Back to Home
            </Link>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-neutral-200 py-8 text-center text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
        © 2026 Sightsynch Limited. All Rights Reserved.
      </footer>
    </div>
  );
}

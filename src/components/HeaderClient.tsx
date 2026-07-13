"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type User } from "@supabase/supabase-js";
import { createClient } from "../utils/supabase/client";
import { getTranslation } from "../utils/i18n";
import AccountPopover from "./AccountPopover";

interface Profile {
  display_name?: string;
  avatar_url?: string;
  created_at?: string;
}

interface HeaderClientProps {
  user: User | null;
  profile: Profile | null;
  locale: string;
}

export default function HeaderClient({ user, profile, locale }: HeaderClientProps) {
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const t = getTranslation(locale);

  const accountRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (accountRef.current && !accountRef.current.contains(target)) {
        setIsAccountOpen(false);
      }
      if (langRef.current && !langRef.current.contains(target)) {
        setIsLangOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsAccountOpen(false);
        setIsLangOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const changeLocale = (nextLocale: string) => {
    document.cookie = `locale=${nextLocale}; path=/; max-age=31536000`;
    setIsLangOpen(false);
    router.refresh();
  };

  const handleMobileLangChange = (nextLocale: string) => {
    document.cookie = `locale=${nextLocale}; path=/; max-age=31536000`;
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-neutral-200">
      {/* 1. Top Utility Bar (Desktop) */}
      <div className="hidden md:flex h-12 border-b border-neutral-200 bg-white items-center justify-between max-w-7xl mx-auto px-6 md:px-12">
        {/* Search Bar */}
        <div className="flex items-center w-full max-w-sm">
          <svg 
            className="w-4 h-4 text-neutral-400 mr-2 shrink-0" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            className="w-full bg-transparent text-xs text-neutral-900 placeholder-neutral-400 outline-none border-b border-transparent focus:border-neutral-400 py-1 transition-colors font-medium"
          />
        </div>

        {/* Right Menu (Account & Language) */}
        <div className="flex items-center space-x-6 text-xs font-bold uppercase tracking-wider text-neutral-800">
          {/* Account trigger */}
          <div ref={accountRef} className="relative py-3">
            <button 
              onClick={() => setIsAccountOpen(!isAccountOpen)}
              className="flex items-center gap-1.5 hover:text-neutral-500 transition-colors focus:outline-none font-bold uppercase tracking-wider text-xs"
            >
              <svg 
                className="w-4 h-4 text-neutral-600" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>
                {user ? (profile?.display_name || user.email?.split("@")[0]) : t("account")}
              </span>
            </button>
            
            <AccountPopover 
              isOpen={isAccountOpen} 
              onClose={() => setIsAccountOpen(false)}
              user={user}
              profile={profile}
            />
          </div>

          {/* Language trigger */}
          <div ref={langRef} className="relative py-3">
            <button 
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1.5 hover:text-neutral-500 transition-colors focus:outline-none font-bold uppercase tracking-wider text-xs"
            >
              <svg 
                className="w-4 h-4 text-neutral-600" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 000 20M12 2a14.5 14.5 0 010 20M2 12h20" />
              </svg>
              <span>{locale === "en" ? "English" : "한국어"}</span>
            </button>

            {/* Language Selection Popover */}
            {isLangOpen && (
              <div className="absolute top-full right-0 mt-1 w-28 bg-white border border-neutral-200 shadow-md py-1 z-50 text-left rounded-none">
                <button
                  onClick={() => changeLocale("ko")}
                  className={`block w-full text-left px-4 py-2 hover:bg-neutral-50 text-xs font-bold ${locale === "ko" ? "text-[#F37021]" : "text-neutral-800"}`}
                >
                  한국어
                </button>
                <button
                  onClick={() => changeLocale("en")}
                  className={`block w-full text-left px-4 py-2 hover:bg-neutral-50 text-xs font-bold ${locale === "en" ? "text-[#F37021]" : "text-neutral-800"}`}
                >
                  English
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main GNB Bar */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex h-20 items-center justify-between bg-white">
        {/* Logo */}
        <Link 
          href="/" 
          className="text-2xl font-black tracking-[0.2em] hover:opacity-80 transition-opacity lowercase"
        >
          sightsynch
        </Link>

        {/* Navigation Menu */}
        <nav className="hidden md:flex items-center space-x-10">
          {/* 'Fashion' with Dropdown */}
          <div className="relative group py-6">
            <button className="flex items-center gap-1 text-sm font-bold tracking-wider hover:text-neutral-500 transition-colors uppercase">
              {t("fashion")}
              <svg 
                className="w-3.5 h-3.5 opacity-60 transition-transform group-hover:rotate-180 duration-200" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Sub-menu Dropdown */}
            <div className="absolute top-[calc(100%-8px)] left-0 w-44 bg-white border border-neutral-200 shadow-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out z-50">
              <Link 
                href="/category/fashion" 
                className="block px-5 py-3.5 text-xs font-semibold tracking-wider text-neutral-800 hover:bg-neutral-50 hover:text-black border-b border-neutral-100"
              >
                {t("clothing")}
              </Link>
              <Link 
                href="/category/fashion" 
                className="block px-5 py-3.5 text-xs font-semibold tracking-wider text-neutral-800 hover:bg-neutral-50 hover:text-black"
              >
                {t("shoes")}
              </Link>
            </div>
          </div>

          <Link 
            href="/category/art" 
            className="text-sm font-bold tracking-wider hover:text-neutral-500 transition-colors uppercase py-6"
          >
            {t("art")}
          </Link>
          <Link 
            href="/category/tech" 
            className="text-sm font-bold tracking-wider hover:text-neutral-500 transition-colors uppercase py-6"
          >
            {t("tech")}
          </Link>
          <Link 
            href="/category/beauty" 
            className="text-sm font-bold tracking-wider hover:text-neutral-500 transition-colors uppercase py-6"
          >
            {t("beauty")}
          </Link>
          <Link 
            href="/category/lifestyle" 
            className="text-sm font-bold tracking-wider hover:text-neutral-500 transition-colors uppercase py-6"
          >
            {t("lifestyle")}
          </Link>
        </nav>

        {/* Mobile Hamburger / X Button */}
        <div className="flex md:hidden items-center">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-neutral-900 hover:text-neutral-500 focus:outline-none py-2"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* 3. Mobile Navigation Drawer (Hamburger Menu Integration) */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white w-full px-6 py-8 space-y-8">
          {/* Mobile Search Bar */}
          <div className="flex items-center w-full border border-neutral-300 px-3 py-2.5 bg-neutral-50">
            <svg 
              className="w-4 h-4 text-neutral-400 mr-2 shrink-0" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              className="w-full bg-transparent text-xs text-neutral-900 placeholder-neutral-400 outline-none font-medium"
            />
          </div>

          {/* GNB Navigation Links */}
          <div className="flex flex-col space-y-4 text-sm font-bold tracking-wider uppercase text-neutral-900">
            <div className="space-y-2">
              <span className="block text-neutral-400 text-xs tracking-widest font-black">{t("fashion")}</span>
              <div className="pl-4 flex flex-col space-y-2 text-xs text-neutral-600 font-semibold">
                <Link href="/category/fashion" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-black">{t("clothing")}</Link>
                <Link href="/category/fashion" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-black">{t("shoes")}</Link>
              </div>
            </div>
            <Link href="/category/art" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-neutral-500 py-1 border-b border-neutral-100">{t("art")}</Link>
            <Link href="/category/tech" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-neutral-500 py-1 border-b border-neutral-100">{t("tech")}</Link>
            <Link href="/category/beauty" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-neutral-500 py-1 border-b border-neutral-100">{t("beauty")}</Link>
            <Link href="/category/lifestyle" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-neutral-500 py-1">{t("lifestyle")}</Link>
          </div>

          <hr className="border-neutral-200" />

          {/* Mobile Account Details */}
          <div className="space-y-4">
            <span className="block text-neutral-400 text-xs tracking-widest font-black uppercase">{t("account")}</span>
            <div className="bg-neutral-50 p-5 border border-neutral-200 space-y-3">
              {user ? (
                <div>
                  <p className="text-xs font-bold text-neutral-800 break-all mb-3">
                    {profile?.display_name || user.email}{t("welcome")}
                  </p>
                  <div className="flex flex-col space-y-2.5">
                    <Link
                      href="/my"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-xs font-bold text-neutral-600 hover:text-black uppercase tracking-wider"
                    >
                      {t("myArchives")}
                    </Link>
                    <button
                      onClick={async () => {
                        const supabase = createClient();
                        await supabase.auth.signOut();
                        setIsMobileMenuOpen(false);
                        window.location.reload();
                      }}
                      className="text-left text-xs font-bold text-neutral-600 hover:text-black uppercase tracking-wider cursor-pointer"
                    >
                      {t("logout")}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-[11px] text-neutral-500 leading-normal font-medium mb-3">
                    Sightsynch 계정에 가입하고 다양한 기능과 혜택을 이용해보세요.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href="/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                      style={{ backgroundColor: "#F37021" }}
                      className="text-white text-[10px] font-bold py-3 px-3 text-center uppercase tracking-wider rounded-none block"
                    >
                      {t("signup")}
                    </Link>
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="bg-white text-neutral-900 border border-neutral-300 hover:border-black text-[10px] font-bold py-3 px-3 text-center uppercase tracking-wider rounded-none block"
                    >
                      {t("login")}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          <hr className="border-neutral-200" />

          {/* Mobile Language Details */}
          <div className="space-y-3">
            <span className="block text-neutral-400 text-xs tracking-widest font-black uppercase">언어 설정 / Language</span>
            <div className="flex gap-4 text-xs font-bold text-neutral-600">
              <button 
                onClick={() => handleMobileLangChange("ko")}
                className={`pb-1 ${locale === "ko" ? "text-black border-b-2 border-black" : "hover:text-black"}`}
              >
                한국어
              </button>
              <button 
                onClick={() => handleMobileLangChange("en")}
                className={`pb-1 ${locale === "en" ? "text-black border-b-2 border-black" : "hover:text-black"}`}
              >
                English
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

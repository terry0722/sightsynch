"use client";

import React, { useState } from "react";
import Link from "next/link";
import AccountPopover from "./AccountPopover";

export default function Header() {
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("한국어");

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
            placeholder="Sightsynch 전체 검색"
            className="w-full bg-transparent text-xs text-neutral-905 placeholder-neutral-400 outline-none border-b border-transparent focus:border-neutral-400 py-1 transition-colors font-medium"
          />
        </div>

        {/* Right Menu (Account & Language) */}
        <div className="flex items-center space-x-6 text-xs font-bold uppercase tracking-wider text-neutral-800">
          {/* Account trigger */}
          <div 
            className="relative py-3 cursor-pointer"
            onMouseEnter={() => setIsAccountOpen(true)}
            onMouseLeave={() => setIsAccountOpen(false)}
          >
            <div className="flex items-center gap-1.5 hover:text-neutral-500 transition-colors">
              <svg 
                className="w-4 h-4 text-neutral-600" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>계정</span>
            </div>
            <AccountPopover isOpen={isAccountOpen} />
          </div>

          {/* Language trigger */}
          <div 
            className="relative py-3 cursor-pointer"
            onMouseEnter={() => setIsLangOpen(true)}
            onMouseLeave={() => setIsLangOpen(false)}
          >
            <div className="flex items-center gap-1.5 hover:text-neutral-500 transition-colors">
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
              <span>{currentLang}</span>
            </div>

            {/* Language Selection Popover */}
            {isLangOpen && (
              <div className="absolute top-full right-0 mt-1 w-28 bg-white border border-neutral-200 shadow-md py-1 z-50 text-left rounded-none">
                <button
                  onClick={() => {
                    setCurrentLang("한국어");
                    setIsLangOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-neutral-50 text-xs font-bold text-neutral-800"
                >
                  한국어
                </button>
                <button
                  onClick={() => {
                    setCurrentLang("English");
                    setIsLangOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-neutral-50 text-xs font-bold text-neutral-800"
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
          {/* '패션' with Dropdown */}
          <div className="relative group py-6">
            <button className="flex items-center gap-1 text-sm font-bold tracking-wider hover:text-neutral-500 transition-colors uppercase">
              패션
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
              <a 
                href="#apparel" 
                className="block px-5 py-3.5 text-xs font-semibold tracking-wider text-neutral-800 hover:bg-neutral-50 hover:text-black border-b border-neutral-100"
              >
                의류
              </a>
              <a 
                href="#shoes" 
                className="block px-5 py-3.5 text-xs font-semibold tracking-wider text-neutral-800 hover:bg-neutral-50 hover:text-black"
              >
                신발
              </a>
            </div>
          </div>

          <a 
            href="#art" 
            className="text-sm font-bold tracking-wider hover:text-neutral-500 transition-colors uppercase py-6"
          >
            미술
          </a>
          <a 
            href="#tech" 
            className="text-sm font-bold tracking-wider hover:text-neutral-500 transition-colors uppercase py-6"
          >
            테크
          </a>
          <a 
            href="#beauty" 
            className="text-sm font-bold tracking-wider hover:text-neutral-500 transition-colors uppercase py-6"
          >
            뷰티
          </a>
          <a 
            href="#lifestyle" 
            className="text-sm font-bold tracking-wider hover:text-neutral-500 transition-colors uppercase py-6"
          >
            라이프스타일
          </a>
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
              placeholder="Sightsynch 전체 검색"
              className="w-full bg-transparent text-xs text-neutral-900 placeholder-neutral-400 outline-none font-medium"
            />
          </div>

          {/* GNB Navigation Links */}
          <div className="flex flex-col space-y-4 text-sm font-bold tracking-wider uppercase text-neutral-900">
            <div className="space-y-2">
              <span className="block text-neutral-400 text-xs tracking-widest font-black">패션</span>
              <div className="pl-4 flex flex-col space-y-2 text-xs text-neutral-600 font-semibold">
                <a href="#apparel" className="hover:text-black">의류</a>
                <a href="#shoes" className="hover:text-black">신발</a>
              </div>
            </div>
            <a href="#art" className="hover:text-neutral-500 py-1 border-b border-neutral-100">미술</a>
            <a href="#tech" className="hover:text-neutral-500 py-1 border-b border-neutral-100">테크</a>
            <a href="#beauty" className="hover:text-neutral-500 py-1 border-b border-neutral-100">뷰티</a>
            <a href="#lifestyle" className="hover:text-neutral-500 py-1">라이프스타일</a>
          </div>

          <hr className="border-neutral-200" />

          {/* Mobile Account Details */}
          <div className="space-y-4">
            <span className="block text-neutral-400 text-xs tracking-widest font-black uppercase">계정</span>
            <div className="bg-neutral-50 p-5 border border-neutral-200 space-y-3">
              <p className="text-[11px] text-neutral-500 leading-normal font-medium">
                Sightsynch 계정에 가입하고 다양한 기능과 혜택을 이용해보세요.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/register"
                  style={{ backgroundColor: "#F37021" }}
                  className="text-white text-[10px] font-bold py-3 px-3 text-center uppercase tracking-wider rounded-none block"
                >
                  회원가입
                </Link>
                <button
                  onClick={() => alert("로그인")}
                  className="bg-white text-neutral-900 border border-neutral-300 text-[10px] font-bold py-3 px-3 text-center uppercase tracking-wider rounded-none"
                >
                  로그인
                </button>
              </div>
            </div>
          </div>

          <hr className="border-neutral-200" />

          {/* Mobile Language Details */}
          <div className="space-y-3">
            <span className="block text-neutral-400 text-xs tracking-widest font-black uppercase">언어 설정</span>
            <div className="flex gap-4 text-xs font-bold text-neutral-600">
              <button 
                onClick={() => setCurrentLang("한국어")}
                className={`pb-1 ${currentLang === "한국어" ? "text-black border-b-2 border-black" : "hover:text-black"}`}
              >
                한국어
              </button>
              <button 
                onClick={() => setCurrentLang("English")}
                className={`pb-1 ${currentLang === "English" ? "text-black border-b-2 border-black" : "hover:text-black"}`}
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

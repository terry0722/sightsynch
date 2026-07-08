"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    setError("");
    alert(`회원가입 요청: ${email}`);
    // Supabase Auth integration logic will go here in the future
  };

  return (
    <div className="min-h-screen bg-white text-[#111111] font-sans flex items-center justify-center py-12 px-6 selection:bg-[#111111] selection:text-white">
      <div className="w-full max-w-[450px] bg-white border border-neutral-200 p-8 md:p-10 shadow-sm rounded-none">
        
        {/* Logo */}
        <div className="text-center mb-6">
          <Link 
            href="/" 
            className="text-3xl font-black tracking-[0.15em] lowercase hover:opacity-80 transition-opacity inline-block"
          >
            sightsynch
          </Link>
        </div>

        {/* Description */}
        <p className="text-xs text-neutral-500 text-center leading-relaxed font-medium mb-8">
          sightsynch 계정을 등록하여 모든 Sightsynch 웹사이트에서 고유한 기능과 혜택을 이용할 수 있는 새로운 통합 계정을 만드세요.
        </p>

        {/* Error message */}
        {error && (
          <div className="mb-5 text-xs font-bold text-red-500 bg-red-50 border border-red-200 p-3.5">
            {error}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email input */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-neutral-800 flex items-center gap-0.5">
              이메일 <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일"
              required
              className="w-full px-4 py-3.5 text-xs bg-white text-black border border-neutral-300 focus:border-black outline-none font-semibold transition-colors placeholder-neutral-400 rounded-none"
            />
          </div>

          {/* Password input */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-neutral-800 flex items-center gap-0.5">
              비밀번호 <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              required
              className="w-full px-4 py-3.5 text-xs bg-white text-black border border-neutral-300 focus:border-black outline-none font-semibold transition-colors placeholder-neutral-400 rounded-none"
            />
          </div>

          {/* Confirm Password input */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-neutral-800 flex items-center gap-0.5">
              비밀번호 확인 <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호 확인"
              required
              className="w-full px-4 py-3.5 text-xs bg-white text-black border border-neutral-300 focus:border-black outline-none font-semibold transition-colors placeholder-neutral-400 rounded-none"
            />
          </div>

          {/* Agreement Note */}
          <p className="text-[10px] text-neutral-500 leading-relaxed font-semibold">
            회원가입 진행 시, 이용약관 및 개인정보처리방침을 읽고 동의한 것으로 간주됩니다.
          </p>

          {/* Submit Button */}
          <button
            type="submit"
            style={{ backgroundColor: "#F37021" }}
            className="w-full text-white text-xs font-bold py-4 px-4 uppercase tracking-wider transition-opacity hover:opacity-90 rounded-none mt-2"
          >
            회원가입
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex py-6 items-center">
          <div className="flex-grow border-t border-neutral-200"></div>
          <span className="flex-shrink mx-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">또는</span>
          <div className="flex-grow border-t border-neutral-200"></div>
        </div>

        {/* Social Authentication Buttons */}
        <div className="space-y-3">
          {/* Google */}
          <button
            onClick={() => alert("Google OAuth")}
            className="w-full flex items-center justify-center gap-3 bg-white text-neutral-800 hover:text-black border border-neutral-200 hover:border-black py-3 px-4 transition-all text-xs font-bold tracking-wider rounded-none"
          >
            {/* Google Icon */}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google로 로그인
          </button>

          {/* Apple */}
          <button
            onClick={() => alert("Apple OAuth")}
            className="w-full flex items-center justify-center gap-3 bg-white text-neutral-800 hover:text-black border border-neutral-200 hover:border-black py-3 px-4 transition-all text-xs font-bold tracking-wider rounded-none"
          >
            {/* Apple Icon */}
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.69-1.12 1.84-.98 2.94.12.01.19.02.26.02.92 0 2.01-.58 2.55-1.35" />
            </svg>
            Apple로 로그인
          </button>

          {/* Facebook */}
          <button
            onClick={() => alert("Facebook OAuth")}
            className="w-full flex items-center justify-center gap-3 bg-white text-neutral-800 hover:text-black border border-neutral-200 hover:border-black py-3 px-4 transition-all text-xs font-bold tracking-wider rounded-none"
          >
            {/* Facebook Icon */}
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Facebook로 로그인
          </button>
        </div>

        {/* Log In Redirect Section */}
        <div className="mt-8 border-t border-neutral-150 pt-6 text-center space-y-4">
          <p className="text-xs text-neutral-500 font-semibold">이미 회원입니다.</p>
          <button
            onClick={() => alert("로그인 화면으로 이동")}
            className="w-full block bg-white text-neutral-900 border border-neutral-200 hover:border-black py-3.5 px-4 text-xs font-bold tracking-wider uppercase transition-colors rounded-none text-center"
          >
            로그인
          </button>
        </div>

      </div>
    </div>
  );
}

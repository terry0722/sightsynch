"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setError("로그인 처리 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setMessage("");
    try {
      const supabase = createClient();
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    } catch (err) {
      console.error(err);
      setError("Google 로그인 요청 중 오류가 발생했습니다.");
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError("비밀번호 재설정을 위해 이메일을 먼저 입력해주세요.");
      return;
    }
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setError(error.message);
      } else {
        setMessage("비밀번호 재설정 링크가 이메일로 발송되었습니다.");
      }
    } catch (err) {
      console.error(err);
      setError("비밀번호 재설정 요청 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
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
        <p className="text-xs text-neutral-500 text-center leading-relaxed font-medium mb-8 uppercase tracking-wider">
          SIGHTSYNCH JOURNAL — SIGN IN
        </p>

        {/* Status messages */}
        {error && (
          <div className="mb-5 text-xs font-bold text-red-500 bg-red-50 border border-red-200 p-3.5">
            {error}
          </div>
        )}
        {message && (
          <div className="mb-5 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 p-3.5">
            {message}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleEmailLogin} className="space-y-5">
          {/* Email input */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
              이메일
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
              className="w-full px-4 py-3.5 text-xs bg-white text-black border border-neutral-300 focus:border-black outline-none font-semibold transition-colors placeholder-neutral-400 rounded-none"
            />
          </div>

          {/* Password input */}
          <div className="flex flex-col space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                비밀번호
              </label>
              <button
                type="button"
                onClick={handleResetPassword}
                disabled={loading}
                className="text-[10px] font-bold text-neutral-400 hover:text-black uppercase tracking-wider transition-colors"
              >
                비밀번호 재설정
              </button>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3.5 text-xs bg-white text-black border border-neutral-300 focus:border-black outline-none font-semibold transition-colors placeholder-neutral-400 rounded-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#111111] text-white hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed text-xs font-bold py-4 px-4 uppercase tracking-wider transition-colors rounded-none mt-2"
          >
            {loading ? "로그인 중..." : "로그인"}
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
          <button
            onClick={handleGoogleLogin}
            type="button"
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
        </div>

        {/* Redirect Section */}
        <div className="mt-8 border-t border-neutral-200 pt-6 text-center space-y-4">
          <p className="text-xs text-neutral-500 font-semibold">아직 회원이 아니신가요?</p>
          <Link
            href="/signup"
            className="w-full block bg-white text-neutral-900 border border-neutral-200 hover:border-black py-3.5 px-4 text-xs font-bold tracking-wider uppercase transition-colors rounded-none text-center"
          >
            계정 만들기
          </Link>
        </div>

      </div>
    </div>
  );
}

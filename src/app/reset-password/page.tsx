"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../utils/supabase/client";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setError(error.message);
      } else {
        setMessage("비밀번호가 안전하게 변경되었습니다. 메인 홈으로 이동합니다.");
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 2500);
      }
    } catch (err) {
      console.error(err);
      setError("비밀번호 변경 처리 중 오류가 발생했습니다.");
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
          SIGHTSYNCH JOURNAL — RESET PASSWORD
        </p>

        {/* Status messages */}
        {error && (
          <div className="mb-5 text-xs font-bold text-red-500 bg-red-50 border border-red-200 p-3.5">
            {error}
          </div>
        )}
        {message && (
          <div className="mb-5 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 p-3.5 leading-relaxed">
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleUpdatePassword} className="space-y-5">
          {/* New Password */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
              새 비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3.5 text-xs bg-white text-black border border-neutral-300 focus:border-black outline-none font-semibold transition-colors placeholder-neutral-400 rounded-none"
            />
          </div>

          {/* Confirm New Password */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
              비밀번호 확인
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? "변경 요청 중..." : "비밀번호 변경 완료"}
          </button>
        </form>

      </div>
    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "../utils/supabase/client";
import { getTranslation } from "../utils/i18n";
import { type User } from "@supabase/supabase-js";

interface Profile {
  display_name?: string;
  avatar_url?: string;
  created_at?: string;
  role?: string;
}

interface AccountPopoverProps {
  isOpen: boolean;
  onClose?: () => void;
  user: User | null;
  profile: Profile | null;
  locale: string;
}

export default function AccountPopover({ isOpen, onClose, user, profile, locale }: AccountPopoverProps) {
  const router = useRouter();
  const t = getTranslation(locale);

  if (!isOpen) return null;

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      
      if (onClose) onClose();
      
      // Refresh pages to trigger server session update and redirect if needed
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("로그아웃 오류:", err);
    }
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-neutral-200 p-6 shadow-lg z-50 text-left rounded-none">
      <h3 className="text-xl font-black tracking-wider text-black mb-2 uppercase">
        SIGHTSYNCH
      </h3>
      
      {user ? (
        <div className="space-y-4">
          <div className="border-b border-neutral-100 pb-3">
            <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">
              Welcome back
            </span>
            <p className="text-sm font-bold text-neutral-800 break-all">
              {profile?.display_name || user.email}
            </p>
          </div>
          
          <div className="flex flex-col space-y-2 text-xs font-bold uppercase tracking-wider text-neutral-600">
            <Link 
              href="/my" 
              onClick={onClose}
              className="hover:text-black transition-colors py-1.5"
            >
              {t("myArchives")}
            </Link>
            {(profile?.role === "editor" || profile?.role === "admin") && (
              <Link 
                href="/editor/manage" 
                onClick={onClose}
                className="hover:text-black transition-colors py-1.5"
              >
                {t("editorManage")}
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="text-left hover:text-black transition-colors py-1.5 cursor-pointer uppercase tracking-wider font-bold"
            >
              {t("logout")}
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-xs text-neutral-500 mb-6 leading-relaxed normal-case font-medium">
            {locale === "en" 
              ? "Join Sightsynch to experience more features and benefits." 
              : "Sightsynch 계정에 가입하고 다양한 기능과 혜택을 이용해보세요."
            }
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/signup"
              onClick={onClose}
              style={{ backgroundColor: "#F37021" }}
              className="text-white text-xs font-bold py-3 px-4 hover:opacity-90 transition-opacity uppercase tracking-wider rounded-none text-center block"
            >
              {t("signup")}
            </Link>
            <Link
              href="/login"
              onClick={onClose}
              className="bg-white text-neutral-900 border border-neutral-300 hover:border-black hover:bg-neutral-50 text-xs font-bold py-3 px-4 transition-all uppercase tracking-wider rounded-none text-center block"
            >
              {t("login")}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

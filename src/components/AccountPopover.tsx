"use client";

import React from "react";

import Link from "next/link";

interface AccountPopoverProps {
  isOpen: boolean;
  onClose?: () => void;
}

export default function AccountPopover({ isOpen, onClose }: AccountPopoverProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-neutral-200 p-6 shadow-lg z-50 text-left rounded-none">
      <h3 className="text-xl font-black tracking-wider text-black mb-2">
        SIGHTSYNCH
      </h3>
      <p className="text-xs text-neutral-500 mb-6 leading-relaxed normal-case font-medium">
        Sightsynch 계정에 가입하고 다양한 기능과 혜택을 이용해보세요.
      </p>
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/register"
          style={{ backgroundColor: "#F37021" }}
          className="text-white text-xs font-bold py-3 px-4 hover:opacity-90 transition-opacity uppercase tracking-wider rounded-none text-center block"
        >
          회원가입
        </Link>
        <button
          onClick={() => alert("로그인")}
          className="bg-white text-neutral-900 border border-neutral-300 hover:border-black text-xs font-bold py-3 px-4 transition-colors uppercase tracking-wider rounded-none text-center"
        >
          로그인
        </button>
      </div>
    </div>
  );
}

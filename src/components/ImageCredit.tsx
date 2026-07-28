import React from "react";

interface ImageCreditProps {
  className?: string;
}

export default function ImageCredit({ className = "" }: ImageCreditProps) {
  return (
    <span
      className={`block text-[10px] md:text-[11px] text-neutral-400 font-medium mt-1.5 tracking-tight font-sans ${className}`}
    >
      사진은 기사 내용과 직접적인 연관 없음./사진=unsplash
    </span>
  );
}

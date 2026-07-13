"use client";

import React, { useState } from "react";
import { createClient } from "../utils/supabase/client";
import { getTranslation } from "../utils/i18n";

interface NewsletterFormProps {
  locale?: string;
}

export default function NewsletterForm({ locale = "ko" }: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "duplicate" | "error">("idle");
  const t = getTranslation(locale);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");

    try {
      const supabase = createClient();
      const { error } = await supabase.from("subscribers").insert({ email: email.trim() });

      if (error) {
        // Postgrest unique violation code
        if (error.code === "23505") {
          setStatus("duplicate");
        } else {
          setStatus("error");
        }
      } else {
        setStatus("success");
        setEmail("");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div className="w-full max-w-md">
      <form 
        onSubmit={handleSubmit} 
        className="flex w-full border border-neutral-300 focus-within:border-black transition-colors"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("newsletterPlaceholder")}
          className="w-full px-4 py-3 text-xs bg-white text-black outline-none font-medium placeholder-neutral-400"
          required
          disabled={status === "loading"}
        />
        <button
          type="submit"
          className="bg-[#0066cc] text-white hover:bg-[#0052a3] px-6 py-3 text-xs font-bold tracking-wider uppercase transition-colors shrink-0 disabled:bg-neutral-300 disabled:cursor-not-allowed"
          disabled={status === "loading"}
        >
          {status === "loading" ? t("subscribing") : t("newsletterButton")}
        </button>
      </form>

      {/* Status Messages */}
      <div className="mt-3 min-h-[1.5rem]">
        {status === "success" && (
          <p className="text-xs font-bold text-emerald-600">
            {t("newsletterSuccess")}
          </p>
        )}
        {status === "duplicate" && (
          <p className="text-xs font-bold text-amber-600">
            {t("newsletterDuplicate")}
          </p>
        )}
        {status === "error" && (
          <p className="text-xs font-bold text-red-500">
            {t("newsletterError")}
          </p>
        )}
      </div>
    </div>
  );
}

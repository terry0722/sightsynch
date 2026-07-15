"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "../utils/supabase/client";
import { getTranslation, type TranslationKey } from "../utils/i18n";

interface EditorPick {
  id: string;
  title: string;
  subtitle?: string;
  category?: string;
  cover_image_url?: string;
  status: "draft" | "published";
  created_at?: string;
  published_at?: string;
}

interface ManagePicksClientProps {
  initialPicks: EditorPick[];
  locale: string;
}

export default function ManagePicksClient({ initialPicks, locale }: ManagePicksClientProps) {
  const [picks, setPicks] = useState<EditorPick[]>(initialPicks);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const t = getTranslation(locale);
  const router = useRouter();
  const supabase = createClient();

  const handleToggleStatus = async (id: string, currentStatus: "draft" | "published") => {
    setLoadingId(id);
    const nextStatus = currentStatus === "draft" ? "published" : "draft";
    const nextPublishedAt = nextStatus === "published" ? new Date().toISOString() : null;

    try {
      const { error } = await supabase
        .from("editor_picks")
        .update({
          status: nextStatus,
          published_at: nextPublishedAt,
          updated_at: new Date().toISOString()
        })
        .eq("id", id);

      if (error) {
        console.error("Toggle status error:", error);
        alert(error.message);
      } else {
        setPicks((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, status: nextStatus, published_at: nextPublishedAt || undefined } : p
          )
        );
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("confirmDelete"))) return;

    setLoadingId(id);
    try {
      const { error } = await supabase
        .from("editor_picks")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Delete pick error:", error);
        alert(error.message);
      } else {
        setPicks((prev) => prev.filter((p) => p.id !== id));
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  const getTranslatedCategory = (cat?: string) => {
    if (!cat) return "-";
    const key = cat.toLowerCase() as TranslationKey;
    return t(key) || cat;
  };

  return (
    <div>
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-neutral-200 pb-6 mb-12 gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-[0.25em] text-neutral-400 block mb-2">
            STAFF DASHBOARD
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none text-neutral-900 uppercase">
            {t("editorManage")}
          </h1>
        </div>
        <Link 
          href="/editor/manage/new" 
          className="bg-black text-white hover:bg-neutral-800 px-6 py-3.5 text-xs font-bold tracking-widest uppercase transition-colors shrink-0"
        >
          {t("newPick")}
        </Link>
      </div>

      {/* Picks Table list */}
      {picks.length > 0 ? (
        <div className="overflow-x-auto border border-neutral-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-400 text-[10px] font-mono uppercase tracking-widest">
                <th className="px-6 py-4 font-bold">{t("coverImage")}</th>
                <th className="px-6 py-4 font-bold">{t("title")}</th>
                <th className="px-6 py-4 font-bold">{t("category")}</th>
                <th className="px-6 py-4 font-bold">{t("status")}</th>
                <th className="px-6 py-4 font-bold">{t("actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-xs font-medium text-neutral-800">
              {picks.map((pick) => (
                <tr key={pick.id} className="hover:bg-neutral-50 transition-colors">
                  {/* Image column */}
                  <td className="px-6 py-4">
                    <div className="relative w-16 h-10 border border-neutral-200 bg-neutral-100 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={pick.cover_image_url || "/hero_modern_art.jpg"} 
                        alt={pick.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </td>

                  {/* Title & subtitle column */}
                  <td className="px-6 py-4 font-bold">
                    <Link href={`/editor/${pick.id}`} className="hover:underline text-black block max-w-xs md:max-w-md truncate">
                      {pick.title}
                    </Link>
                    {pick.subtitle && (
                      <span className="block text-[10px] text-neutral-400 font-normal truncate max-w-xs md:max-w-md">
                        {pick.subtitle}
                      </span>
                    )}
                  </td>

                  {/* Category column */}
                  <td className="px-6 py-4 uppercase font-bold tracking-wider text-neutral-500">
                    {getTranslatedCategory(pick.category)}
                  </td>

                  {/* Status badge column */}
                  <td className="px-6 py-4 font-mono text-[10px] tracking-wider">
                    {pick.status === "published" ? (
                      <span className="inline-block px-2.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold uppercase">
                        {t("published")}
                      </span>
                    ) : (
                      <span className="inline-block px-2.5 py-1.5 bg-neutral-100 text-neutral-500 border border-neutral-200 font-bold uppercase">
                        {t("draft")}
                      </span>
                    )}
                  </td>

                  {/* Actions column */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Link 
                        href={`/editor/manage/${pick.id}/edit`}
                        className="hover:underline text-blue-600 font-bold uppercase tracking-wider text-[10px]"
                      >
                        {t("edit")}
                      </Link>

                      <button
                        onClick={() => handleToggleStatus(pick.id, pick.status)}
                        disabled={loadingId !== null}
                        className="hover:underline text-amber-600 font-bold uppercase tracking-wider text-[10px] disabled:opacity-50"
                      >
                        {pick.status === "published" ? "DRAFTIFY" : "PUBLISH"}
                      </button>

                      <button
                        onClick={() => handleDelete(pick.id)}
                        disabled={loadingId !== null}
                        className="hover:underline text-red-600 font-bold uppercase tracking-wider text-[10px] disabled:opacity-50"
                      >
                        {t("delete")}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-24 text-center border border-dashed border-neutral-300">
          <p className="text-sm font-mono uppercase text-neutral-400 tracking-wider">
            {t("noPicks")}
          </p>
        </div>
      )}
    </div>
  );
}

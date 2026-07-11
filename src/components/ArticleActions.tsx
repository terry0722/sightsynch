"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../utils/supabase/client";

interface ArticleActionsProps {
  articleId: string;
  initialLikesCount: number;
  initialIsLiked: boolean;
  initialIsBookmarked: boolean;
}

export default function ArticleActions({
  articleId,
  initialLikesCount,
  initialIsLiked,
  initialIsBookmarked,
}: ArticleActionsProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id);
      }
    });
  }, []);

  const handleAuthRedirect = () => {
    router.push(`/login?next=/article/${articleId}`);
  };

  const toggleLike = async () => {
    if (!userId) {
      handleAuthRedirect();
      return;
    }

    // Optimistic UI updates
    const nextIsLiked = !isLiked;
    setIsLiked(nextIsLiked);
    setLikesCount((prev) => (nextIsLiked ? prev + 1 : prev - 1));

    const supabase = createClient();
    try {
      if (nextIsLiked) {
        const { error } = await supabase
          .from("article_likes")
          .insert({ user_id: userId, article_id: articleId });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("article_likes")
          .delete()
          .eq("user_id", userId)
          .eq("article_id", articleId);
        if (error) throw error;
      }
    } catch (err) {
      // Revert states on failure
      setIsLiked(isLiked);
      setLikesCount((prev) => (isLiked ? prev + 1 : prev - 1));
      console.error("좋아요 처리 실패:", err);
    }
  };

  const toggleBookmark = async () => {
    if (!userId) {
      handleAuthRedirect();
      return;
    }

    // Optimistic UI updates
    const nextIsBookmarked = !isBookmarked;
    setIsBookmarked(nextIsBookmarked);

    const supabase = createClient();
    try {
      if (nextIsBookmarked) {
        const { error } = await supabase
          .from("bookmarks")
          .insert({ user_id: userId, article_id: articleId });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("bookmarks")
          .delete()
          .eq("user_id", userId)
          .eq("article_id", articleId);
        if (error) throw error;
      }
    } catch (err) {
      // Revert states on failure
      setIsBookmarked(isBookmarked);
      console.error("북마크 처리 실패:", err);
    }
  };

  return (
    <div className="flex items-center gap-4 my-8 font-mono text-xs">
      {/* Like Button */}
      <button
        onClick={toggleLike}
        className={`flex items-center gap-1.5 px-4 py-2 border transition-colors ${
          isLiked
            ? "bg-[#111111] text-white border-neutral-900"
            : "bg-white text-neutral-800 border-neutral-300 hover:border-black"
        }`}
      >
        <span>{isLiked ? "★" : "☆"}</span>
        <span className="font-bold uppercase tracking-wider">
          LIKE {likesCount > 0 ? `(${likesCount})` : ""}
        </span>
      </button>

      {/* Bookmark Button */}
      <button
        onClick={toggleBookmark}
        className={`flex items-center gap-1.5 px-4 py-2 border transition-colors ${
          isBookmarked
            ? "bg-[#111111] text-white border-neutral-900"
            : "bg-white text-neutral-800 border-neutral-300 hover:border-black"
        }`}
      >
        <span>{isBookmarked ? "★" : "☆"}</span>
        <span className="font-bold uppercase tracking-wider">
          {isBookmarked ? "BOOKMARKED" : "BOOKMARK"}
        </span>
      </button>
    </div>
  );
}

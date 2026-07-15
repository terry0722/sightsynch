"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { supabase } from "../utils/supabase/client";
import { getTranslation, type TranslationKey } from "../utils/i18n";

interface EditorPick {
  id?: string;
  title: string;
  subtitle?: string;
  category?: string;
  tags?: string | string[];
  body_markdown?: string;
  cover_image_url?: string;
  status?: "draft" | "published";
  published_at?: string | null;
}

interface PickFormProps {
  initialData?: EditorPick;
  locale: string;
}

const CATEGORIES = ["패션", "미술", "테크", "뷰티", "라이프스타일"];

function generateStoragePath(userId: string, ext: string): string {
  const timestamp = new Date().getTime();
  const uuid = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : Math.random().toString(36).substring(2);
  return `${userId}/${timestamp}-${uuid}.${ext}`;
}

export default function PickForm({ initialData, locale }: PickFormProps) {
  const router = useRouter();
  const t = getTranslation(locale);

  const [title, setTitle] = useState(initialData?.title || "");
  const [subtitle, setSubtitle] = useState(initialData?.subtitle || "");
  const [category, setCategory] = useState(initialData?.category || CATEGORIES[0]);
  const [bodyMarkdown, setBodyMarkdown] = useState(initialData?.body_markdown || "");
  const [coverImageUrl, setCoverImageUrl] = useState(initialData?.cover_image_url || "");
  
  // Format initial tags to comma-separated string
  const getInitialTagsString = () => {
    if (!initialData?.tags) return "";
    if (Array.isArray(initialData.tags)) return initialData.tags.join(", ");
    try {
      const parsed = JSON.parse(initialData.tags);
      if (Array.isArray(parsed)) return parsed.join(", ");
    } catch {
      // Fallback
    }
    return String(initialData.tags);
  };
  const [tagsString, setTagsString] = useState(getInitialTagsString());

  const [isUploading, setIsUploading] = useState(false);
  const [isInsertingImage, setIsInsertingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const uploadImageFile = async (file: File): Promise<string | null> => {
    // Size limit: 10MB
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize || !file.type.startsWith("image/")) {
      alert(t("uploadFailed"));
      return null;
    }

    let ext = "";
    const parts = file.name.split(".");
    if (parts.length > 1) {
      ext = parts.pop()?.toLowerCase() || "";
    }
    if (!ext) {
      if (file.type === "image/png") ext = "png";
      else if (file.type === "image/jpeg" || file.type === "image/jpg") ext = "jpg";
      else if (file.type === "image/webp") ext = "webp";
    }

    const allowedExtensions = ["png", "jpg", "jpeg", "webp"];
    if (!allowedExtensions.includes(ext)) {
      alert("Only PNG, JPG, JPEG, and WEBP image files are allowed.");
      return null;
    }

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      console.error("Session check error or no session:", sessionError);
      alert("You must be logged in to upload images. Redirecting to login...");
      router.push("/login");
      return null;
    }

    const filePath = generateStoragePath(session.user.id, ext);

    const { error } = await supabase.storage
      .from("editor-pick-images")
      .upload(filePath, file, { contentType: file.type, upsert: false });

    if (error) {
      console.error("Storage upload error:", error);
      alert("Upload failed: " + error.message);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("editor-pick-images")
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const publicUrl = await uploadImageFile(file);
      if (publicUrl) {
        setCoverImageUrl(publicUrl);
      }
    } catch (err) {
      console.error("Cover image upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleInsertImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsInsertingImage(true);
    try {
      const publicUrl = await uploadImageFile(file);
      if (publicUrl) {
        const textarea = document.getElementById("body-markdown-textarea") as HTMLTextAreaElement | null;
        if (textarea) {
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const text = textarea.value;
          const before = text.substring(0, start);
          const after = text.substring(end, text.length);
          const markdownTag = `\n\n![${file.name.split(".")[0]}](` + publicUrl + `)\n\n`;
          
          setBodyMarkdown(before + markdownTag + after);
          
          setTimeout(() => {
            textarea.focus();
            textarea.selectionStart = textarea.selectionEnd = start + markdownTag.length;
          }, 50);
        } else {
          setBodyMarkdown((prev) => prev + `\n\n![${file.name.split(".")[0]}](` + publicUrl + `)\n\n`);
        }
      }
    } catch (err) {
      console.error("Inline image insertion error:", err);
    } finally {
      setIsInsertingImage(false);
      e.target.value = "";
    }
  };

  const handleSave = async (status: "draft" | "published") => {
    if (!title.trim()) {
      alert("Please enter a title.");
      return;
    }

    setIsSaving(true);
    const parsedTags = tagsString
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const pickData = {
      title: title.trim(),
      subtitle: subtitle.trim(),
      category,
      tags: parsedTags,
      body_markdown: bodyMarkdown,
      cover_image_url: coverImageUrl,
      status,
      published_at: status === "published" ? (initialData?.published_at || new Date().toISOString()) : null,
      updated_at: new Date().toISOString()
    };

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        console.error("Session check error or no session:", sessionError);
        alert("You must be logged in to save. Redirecting to login...");
        router.push("/login");
        return;
      }

      if (initialData?.id) {
        // Edit mode: update existing pick
        const { error } = await supabase
          .from("editor_picks")
          .update(pickData)
          .eq("id", initialData.id);

        if (error) {
          console.error("Update error:", error);
          alert("Failed to update post: " + error.message);
        } else {
          router.push("/editor/manage");
          router.refresh();
        }
      } else {
        // Create mode: get current user name to set author_name
        let authorName = "Editor";
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("display_name")
          .eq("id", session.user.id)
          .single();

        if (profileError) {
          console.error("Profile fetch error:", profileError);
        }

        authorName = profile?.display_name || session.user.email || "Editor";

        const { error } = await supabase
          .from("editor_picks")
          .insert({
            ...pickData,
            author_id: session.user.id,
            author_name: authorName,
            created_at: new Date().toISOString()
          });

        if (error) {
          console.error("Insert error:", error);
          alert("Failed to publish post: " + error.message);
        } else {
          router.push("/editor/manage");
          router.refresh();
        }
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.error("Save error:", err);
      alert("An unexpected error occurred while saving: " + errMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const getTranslatedCategory = (cat: string) => {
    const key = cat.toLowerCase() as TranslationKey;
    return t(key) || cat;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Editor Inputs Column */}
      <div className="space-y-6">
        {/* Cover Image Upload */}
        <div className="space-y-2">
          <label className="block text-xs font-mono uppercase tracking-widest text-neutral-400 font-bold">
            {t("coverImage")}
          </label>
          <div className="flex items-center gap-6">
            <div className="relative w-32 h-20 border border-neutral-300 bg-neutral-50 overflow-hidden flex items-center justify-center shrink-0">
              {coverImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={coverImageUrl} alt="Cover Preview" className="object-cover w-full h-full" />
              ) : (
                <span className="text-[10px] text-neutral-400 font-mono">NO IMAGE</span>
              )}
              {isUploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-[10px] font-mono tracking-wider font-bold">
                  {t("uploading")}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading || isSaving}
                className="hidden"
                id="file-upload-input"
              />
              <label
                htmlFor="file-upload-input"
                className="inline-block cursor-pointer bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 px-4 py-2 text-center text-xs font-mono font-bold uppercase transition-colors"
              >
                SELECT IMAGE
              </label>
              <span className="text-[10px] text-neutral-400 font-mono">
                MAX SIZE: 10MB (JPEG, PNG, WEBP)
              </span>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <label className="block text-xs font-mono uppercase tracking-widest text-neutral-400 font-bold">
            {t("title")} *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSaving}
            placeholder="Type your title here..."
            className="w-full border border-neutral-300 focus:border-black transition-colors px-4 py-3 text-xs bg-white text-black outline-none font-medium placeholder-neutral-400"
          />
        </div>

        {/* Subtitle */}
        <div className="space-y-2">
          <label className="block text-xs font-mono uppercase tracking-widest text-neutral-400 font-bold">
            {t("subtitle")}
          </label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            disabled={isSaving}
            placeholder="Type your subtitle or summary here..."
            className="w-full border border-neutral-300 focus:border-black transition-colors px-4 py-3 text-xs bg-white text-black outline-none font-medium placeholder-neutral-400"
          />
        </div>

        {/* Category & Tags Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category Dropdown */}
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-widest text-neutral-400 font-bold">
              {t("category")}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isSaving}
              className="w-full border border-neutral-300 focus:border-black transition-colors px-4 py-3 text-xs bg-white text-black outline-none font-bold uppercase tracking-wider cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {getTranslatedCategory(cat)}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-widest text-neutral-400 font-bold">
              {t("tags")}
            </label>
            <input
              type="text"
              value={tagsString}
              onChange={(e) => setTagsString(e.target.value)}
              disabled={isSaving}
              placeholder="fashion, tech, minimalist"
              className="w-full border border-neutral-300 focus:border-black transition-colors px-4 py-3 text-xs bg-white text-black outline-none font-medium placeholder-neutral-400"
            />
          </div>
        </div>

        {/* Body Markdown Textarea */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-xs font-mono uppercase tracking-widest text-neutral-400 font-bold">
              {t("bodyMarkdown")}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleInsertImage}
                disabled={isInsertingImage || isSaving}
                className="hidden"
                id="inline-image-upload-input"
              />
              <label
                htmlFor="inline-image-upload-input"
                className="cursor-pointer bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 px-3 py-1.5 text-[10px] font-mono font-bold uppercase transition-colors flex items-center gap-1.5 select-none"
              >
                {isInsertingImage ? (
                  <>
                    <svg className="animate-spin h-3 w-3 text-neutral-600" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    <span>INSERTING...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3 h-3 text-neutral-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>INSERT IMAGE</span>
                  </>
                )}
              </label>
            </div>
          </div>
          <textarea
            id="body-markdown-textarea"
            value={bodyMarkdown}
            onChange={(e) => setBodyMarkdown(e.target.value)}
            disabled={isSaving}
            rows={15}
            placeholder="Write your article in markdown format..."
            className="w-full border border-neutral-300 focus:border-black transition-colors px-4 py-3 text-xs bg-white text-black outline-none font-mono placeholder-neutral-400"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4 border-t border-neutral-200">
          <button
            onClick={() => handleSave("draft")}
            disabled={isSaving || isUploading}
            className="flex-1 bg-neutral-100 border border-neutral-300 text-neutral-800 hover:bg-neutral-200 px-6 py-3.5 text-xs font-bold tracking-widest uppercase transition-colors disabled:opacity-50"
          >
            {t("saveDraft")}
          </button>
          <button
            onClick={() => handleSave("published")}
            disabled={isSaving || isUploading}
            className="flex-1 bg-black text-white hover:bg-neutral-800 px-6 py-3.5 text-xs font-bold tracking-widest uppercase transition-colors disabled:opacity-50"
          >
            {t("publish")}
          </button>
        </div>
      </div>

      {/* Live Preview Column */}
      <div className="space-y-6 lg:border-l lg:border-neutral-200 lg:pl-12">
        <label className="block text-xs font-mono uppercase tracking-widest text-neutral-400 font-bold border-b border-neutral-200 pb-2">
          👁️ {t("preview")}
        </label>
        
        {/* Render Preview */}
        <article className="prose prose-neutral max-w-none">
          {title ? (
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none text-neutral-900 uppercase mb-4">
              {title}
            </h1>
          ) : (
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none text-neutral-300 uppercase mb-4">
              TITLE PREVIEW
            </h1>
          )}
          
          {subtitle && (
            <p className="text-md md:text-xl font-normal leading-relaxed text-neutral-500 mb-8">
              {subtitle}
            </p>
          )}

          {coverImageUrl && (
            <div className="w-full aspect-[3/2] relative border border-neutral-200 mb-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={coverImageUrl} alt="Preview Cover" className="object-cover w-full h-full" />
            </div>
          )}

          <div className="prose prose-neutral max-w-none mt-8">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h2 className="text-xl md:text-2xl font-black mt-8 mb-4 uppercase tracking-tight text-neutral-900">
                    {children}
                  </h2>
                ),
                h2: ({ children }) => (
                  <h3 className="text-lg md:text-xl font-black mt-6 mb-3 uppercase tracking-tight text-neutral-900">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-sm leading-relaxed text-neutral-700 mb-4 font-normal">
                    {children}
                  </p>
                ),
                strong: ({ children }) => (
                  <strong className="font-bold text-neutral-900">{children}</strong>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-neutral-300 pl-4 my-4 italic text-neutral-600 text-sm leading-relaxed">
                    {children}
                  </blockquote>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc pl-5 space-y-2 mb-4 text-neutral-700 font-normal">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal pl-5 space-y-2 mb-4 text-neutral-700 font-normal">
                    {children}
                  </ol>
                ),
                hr: () => <hr className="my-6 border-neutral-200" />,
                img: ({ src, alt }) => (
                  <figure className="my-6">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={alt} className="max-w-full h-auto mx-auto rounded-lg" />
                    {alt && (
                      <figcaption className="text-center text-xs text-neutral-400 font-mono mt-2 uppercase tracking-wider">
                        {alt}
                      </figcaption>
                    )}
                  </figure>
                ),
              }}
            >
              {bodyMarkdown || "*No content written yet.*"}
            </ReactMarkdown>
          </div>
        </article>
      </div>
    </div>
  );
}

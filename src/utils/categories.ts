export const CATEGORY_MAP = {
  fashion:   { ko: "패션",       en: "Fashion" },
  art:       { ko: "미술",       en: "Art" },
  tech:      { ko: "테크",       en: "Tech" },
  beauty:    { ko: "뷰티",       en: "Beauty" },
  lifestyle: { ko: "라이프스타일", en: "Lifestyle" },
} as const;

export type CategorySlug = keyof typeof CATEGORY_MAP;

export function isValidCategorySlug(slug: string): slug is CategorySlug {
  return slug in CATEGORY_MAP;
}

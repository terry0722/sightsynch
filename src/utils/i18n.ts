export interface ArticleInput {
  id: string;
  title: string;
  title_en?: string | null;
  summary: string;
  summary_en?: string | null;
  category: string;
  tags: string | string[];
  tags_en?: string | string[] | null;
  image_url: string;
  body_markdown?: string | null;
  body_markdown_en?: string | null;
  created_at?: string;
  view_count?: number;
  source_url?: string | null;
}

export function pickArticle(article: ArticleInput, locale: string) {
  if (!article) return null;
  const isEn = locale === "en";
  const title = isEn ? (article.title_en && article.title_en.trim() !== "" ? article.title_en : article.title) : article.title;
  const summary = isEn ? (article.summary_en && article.summary_en.trim() !== "" ? article.summary_en : article.summary) : article.summary;
  const body = isEn ? (article.body_markdown_en && article.body_markdown_en.trim() !== "" ? article.body_markdown_en : article.body_markdown) : article.body_markdown;
  const tags = isEn ? (article.tags_en && (Array.isArray(article.tags_en) ? article.tags_en.length > 0 : String(article.tags_en).trim() !== "") ? article.tags_en : article.tags) : article.tags;

  return {
    ...article,
    title,
    summary,
    body,
    body_markdown: body, // Keep body_markdown alias for compatibility
    tags,
  };
}

const DICTIONARY: Record<string, Record<string, string>> = {
  ko: {
    // Header Categories
    fashion: "패션",
    art: "미술",
    tech: "테크",
    beauty: "뷰티",
    lifestyle: "라이프스타일",
    clothing: "의류",
    shoes: "신발",
    // Header UI
    searchPlaceholder: "Sightsynch 전체 검색",
    account: "계정",
    welcome: "님 환영합니다",
    logout: "로그아웃 (Sign Out)",
    login: "로그인",
    signup: "회원가입",
    myArchives: "내 북마크 (My Archives)",
    // Home/Category Page UI
    editorialSubheader: "SIGHTSYNCH 저널 — 글로벌 아카이브",
    latestIssues: "최신호 기사",
    byCategory: "카테고리별 탐색",
    featuredArticles: "추천 기사",
    loadMore: "더 보기",
    backToHome: "← 홈으로 돌아가기",
    myArchiveHeader: "내 북마크 목록",
    savedIssuesCount: "저장된 아카이브 개수",
    noBookmarks: "저장된 북마크가 없습니다.",
    exploreArticles: "기사 둘러보기",
    archiveMore: "아카이브 / 추가 기사",
    follow: "팔로우",
    company: "회사소개",
    newsroom: "뉴스룸",
    careers: "채용",
    partnership: "광고 및 제휴",
    contact: "연락처",
    // Article Detail UI
    backToIssues: "← BACK TO ISSUES",
    globalArchive: "GLOBAL ARCHIVE",
    originalSource: "원문 보기 (SOURCE) →",
    newsletterTitle: "NEWSLETTER",
    newsletterDesc: "Sightsynch의 최신 소식을 이메일로 받아보세요.",
    newsletterPlaceholder: "이메일 주소를 입력하세요",
    newsletterButton: "구독하기",
    newsletterSuccess: "✓ 구독 신청이 완료되었습니다.",
    newsletterDuplicate: "ℹ 이미 구독 중인 이메일입니다.",
    newsletterError: "✗ 구독 신청 중 오류가 발생했습니다. 다시 시도해 주세요.",
    subscribing: "신청 중...",
    // Article Detail Footer
    foot1Title: "01 / 브랜드 에디토리얼",
    foot1Desc: "럭셔리 패션, 현대 건축, 사운드 디자인 및 뷰티의 교차점을 다루는 큐레이팅된 분석.",
    foot2Title: "02 / 아카이브 프린트",
    foot2Desc: "서울, 도쿄, 파리의 엄선된 글로벌 서점 및 하이엔드 편집숍에서 매 분기 실물 매거진으로 만나보실 수 있습니다.",
    foot3Title: "03 / 디지털 싱크",
    foot3Desc: "고해상도 비주얼 컬처에 대한 실시간 동기화 소식을 뉴스레터를 통해 이메일로 받아보세요.",
    terms: "이용약관",
    privacy: "개인정보처리방침",
    searchTitle: "검색 결과",
    searchResultsCount: "건의 결과 발견됨",
    noResults: "에 대한 결과가 없습니다.",
    searchPrompt: "검색어를 입력하세요",
    searchBoxPlaceholder: "검색하고 싶은 키워드를 입력해 주세요",
    editorsPick: "에디터픽",
    editorManage: "에디터픽 관리",
    draft: "초안",
    published: "발행됨",
    newPick: "새 글 작성",
    saveDraft: "초안 저장",
    publish: "발행하기",
    edit: "수정",
    delete: "삭제",
    status: "상태",
    actions: "관리",
    confirmDelete: "정말로 삭제하시겠습니까?",
    title: "제목",
    subtitle: "부제목",
    category: "카테고리",
    tags: "태그 (쉼표로 구분)",
    bodyMarkdown: "본문 마크다운",
    preview: "실시간 미리보기",
    coverImage: "대표 이미지",
    uploading: "업로드 중...",
    uploadFailed: "업로드 실패: 이미지 파일(최대 10MB)만 가능합니다.",
    noPicks: "등록된 에디터픽이 없습니다.",
  },
  en: {
    // Header Categories
    fashion: "Fashion",
    art: "Art",
    tech: "Tech",
    beauty: "Beauty",
    lifestyle: "Lifestyle",
    clothing: "Clothing",
    shoes: "Shoes",
    // Header UI
    searchPlaceholder: "Search Sightsynch",
    account: "Account",
    welcome: "Welcome, ",
    logout: "Sign Out",
    login: "Sign In",
    signup: "Sign Up",
    myArchives: "My Archives",
    // Home/Category Page UI
    editorialSubheader: "SIGHTSYNCH JOURNAL — GLOBAL ARCHIVE",
    latestIssues: "LATEST ISSUES",
    byCategory: "EXPLORE BY CATEGORY",
    featuredArticles: "FEATURED ARTICLES",
    loadMore: "LOAD MORE",
    backToHome: "← BACK TO HOME",
    myArchiveHeader: "MY BOOKMARKS",
    savedIssuesCount: "YOUR SAVED ENTRIES",
    noBookmarks: "No bookmarked articles found.",
    exploreArticles: "Explore Articles",
    archiveMore: "ARCHIVE / MORE ARTICLES",
    follow: "FOLLOW",
    company: "COMPANY",
    newsroom: "Newsroom",
    careers: "Careers",
    partnership: "Advertising & Partnership",
    contact: "Contact",
    // Article Detail UI
    backToIssues: "← BACK TO ISSUES",
    globalArchive: "GLOBAL ARCHIVE",
    originalSource: "VIEW SOURCE →",
    newsletterTitle: "NEWSLETTER",
    newsletterDesc: "Subscribe to receive the latest updates from Sightsynch.",
    newsletterPlaceholder: "Enter your email address",
    newsletterButton: "SUBSCRIBE",
    newsletterSuccess: "✓ Subscription completed successfully.",
    newsletterDuplicate: "ℹ Already subscribed email.",
    newsletterError: "✗ Subscription failed. Please try again.",
    subscribing: "Subscribing...",
    // Article Detail Footer
    foot1Title: "01 / BRAND EDITORIAL",
    foot1Desc: "Curated analysis covering the intersections of luxury fashion, modern architecture, sound design, and beauty.",
    foot2Title: "02 / ARCHIVE PRINT",
    foot2Desc: "Available quarterly in selected global bookstores and high-end boutiques across Seoul, Tokyo, and Paris.",
    foot3Title: "03 / DIGITAL SYNC",
    foot3Desc: "Receive real-time synchronizations of high-fidelity visual culture directly via our dedicated newsletter.",
    terms: "Terms of Use",
    privacy: "Privacy Policy",
    searchTitle: "Search Results",
    searchResultsCount: "results found",
    noResults: "No results found for",
    searchPrompt: "Please enter a search term",
    searchBoxPlaceholder: "Type keywords to search...",
    editorsPick: "Editor's Pick",
    editorManage: "Manage Picks",
    draft: "Draft",
    published: "Published",
    newPick: "New Pick",
    saveDraft: "Save Draft",
    publish: "Publish",
    edit: "Edit",
    delete: "Delete",
    status: "Status",
    actions: "Actions",
    confirmDelete: "Are you sure you want to delete this?",
    title: "Title",
    subtitle: "Subtitle",
    category: "Category",
    tags: "Tags (separated by commas)",
    bodyMarkdown: "Body Markdown",
    preview: "Live Preview",
    coverImage: "Cover Image",
    uploading: "Uploading...",
    uploadFailed: "Upload failed: image files only (max 10MB).",
    noPicks: "No editor's picks found.",
  }
};

export type TranslationKey = keyof typeof DICTIONARY.ko;

export function getTranslation(locale: string) {
  const isEn = locale === "en";
  const dict = isEn ? DICTIONARY.en : DICTIONARY.ko;
  return (key: TranslationKey) => {
    return dict[key] || DICTIONARY.ko[key] || "";
  };
}

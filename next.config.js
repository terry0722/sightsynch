/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // 홈 화면의 next/image(<Image>)가 외부 이미지를 최적화하려면
    // 허용 도메인을 반드시 등록해야 합니다. 이게 없으면 400 → 회색 박스(깨짐).
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
        pathname: "/**",
      },
      // Supabase Storage에 이미지를 올릴 경우 대비 (사용 안 하면 지워도 됨)
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

module.exports = nextConfig;

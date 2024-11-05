import withPWAInit from "@ducanh2912/next-pwa";
import { withSentryConfig } from "@sentry/nextjs";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  exclude: [({ url }) => new RegExp(`^/($|auth/callback$)`).test(url.pathname)],
});

const nextConfig = {
  // Next.js 설정
  productionBrowserSourceMaps: true, // 프로덕션에서 소스맵 활성화

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "img1.kakaocdn.net",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "k.kakaocdn.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn-icons-png.flaticon.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "bizimg.giftishow.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "image.yes24.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "contents.kyobobook.co.kr",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "mblogthumb-phinf.pstatic.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "d2uaylxt6f2ffw.cloudfront.net",
        pathname: "/**",
      },
    ],
  },
  webpack(config) {
    // SVGR 설정 추가
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default withSentryConfig(withPWA(nextConfig), {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options
  org: "none-0b7",
  project: "javascript-nextjs",
  silent: true,
  widenClientFileUpload: true,
  reactComponentAnnotation: { enabled: true },
  hideSourceMaps: false, // 소스맵을 숨기지 않음
  disableLogger: true,
  automaticVercelMonitors: true,
  include: "./.next", // 소스맵이 포함된 Next.js 빌드 디렉토리
  urlPrefix: "~/_next", // Sentry에 업로드된 파일 경로가 _next로 시작하도록 설정
  stripPrefix: ["webpack://_N_E/"], // 필요 시 경로에서 특정 프리픽스를 제거
  debug: process.env.NODE_ENV === "development",
});

import withPWAInit from "@ducanh2912/next-pwa";
import { withSentryConfig } from "@sentry/nextjs";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
});

const nextConfig = {
  // Next.js 설정
  productionBrowserSourceMaps: true, // 프로덕션에서 소스맵 활성화

  images: {
    remotePatterns: [
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
  org: "none-0b7", // Sentry 조직 설정
  project: "javascript-nextjs", // Sentry 프로젝트 이름
  silent: false,
  widenClientFileUpload: true, // 파일 업로드 시 더 많은 정보를 포함
  reactComponentAnnotation: { enabled: true }, // React 컴포넌트에서 에러 추적 활성화
  hideSourceMaps: true, // 소스맵을 숨김
  disableLogger: true, // Sentry의 로깅 기능 비활성화
  automaticVercelMonitors: true, // Vercel 모니터링 자동 설정
});

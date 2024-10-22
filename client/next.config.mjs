import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
});

export default withPWA({
  // Your Next.js config
  productionBrowserSourceMaps: false, // 프로덕션에서 소스 맵 비활성화
});

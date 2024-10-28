import withPWAInit from "@ducanh2912/next-pwa";
import { withSentryConfig } from "@sentry/nextjs";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
});

export default withSentryConfig(
  withPWA({
    // Your Next.js config
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
          hostname: "cdn-icons-png.flaticon.com",
          pathname: "/**",
        },
      ],
    },
  }),
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    org: "none-0b7",
    project: "javascript-nextjs",

    // Only print logs for uploading source maps in CI
    silent: !process.env.CI,

    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Automatically annotate React components to show their full name in breadcrumbs and session replay
    reactComponentAnnotation: {
      enabled: true,
    },

    // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
    // This can increase your server load as well as your hosting bill.
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    // tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true, // Sentry 소스 맵 표시 비활성화

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  }
);

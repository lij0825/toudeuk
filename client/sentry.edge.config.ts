// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

const isProduction = process.env.NODE_ENV === "production";

Sentry.init({
  dsn:
    process.env.NEXT_PUBLIC_SENTRY_DSN ||
    "https://873bd5cfbb5745397111c1fd985f2cdc@o4508194294398976.ingest.de.sentry.io/4508194337783888",
  environment: isProduction ? "production" : "development",

  // Edge environment에서는 최소한의 설정만 사용
  tracesSampleRate: isProduction ? 0.1 : 1.0,

  // debug 옵션 제거 (Edge runtime에서는 지원되지 않음)
});

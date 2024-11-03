// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
import * as Sentry from "@sentry/nextjs";

const isProduction = process.env.NODE_ENV === "production";

Sentry.init({
  dsn:
    process.env.NEXT_PUBLIC_SENTRY_DSN ||
    "https://873bd5cfbb5745397111c1fd985f2cdc@o4508194294398976.ingest.de.sentry.io/4508194337783888",
  environment: isProduction ? "production" : "development",
  tracesSampleRate: isProduction
    ? parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || "1.0")
    : 0,
  replaysSessionSampleRate: isProduction ? 0.1 : 0,
  replaysOnErrorSampleRate: isProduction ? 1.0 : 0,
  debug: !isProduction, // 프로덕션이 아니면 디버그 활성화
});

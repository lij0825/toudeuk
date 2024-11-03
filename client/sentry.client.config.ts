// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { browserTracingIntegration, replayIntegration } from "@sentry/nextjs";

const isProduction = process.env.NODE_ENV === "production";

Sentry.init({
  dsn:
    process.env.NEXT_PUBLIC_SENTRY_DSN ||
    "https://873bd5cfbb5745397111c1fd985f2cdc@o4508194294398976.ingest.de.sentry.io/4508194337783888",
  environment: isProduction ? "production" : "development",
  integrations: [
    browserTracingIntegration(),
    replayIntegration({
      maskAllText: true,
    }),
  ],

  tracesSampleRate: isProduction
    ? parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || "1.0")
    : 0,
  replaysSessionSampleRate: isProduction ? 0.1 : 0,
  replaysOnErrorSampleRate: isProduction ? 1.0 : 0,
});

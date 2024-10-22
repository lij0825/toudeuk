import dynamic from "next/dynamic";
import type { Metadata, Viewport } from "next";
import "./globals.css";

const ClientWrapper = dynamic(() => import("@/providers/ReacQueryProvider"), {
  ssr: false,
});

const APP_NAME = "TouDeuk";
const APP_DEFAULT_TITLE = "TouDeuk App";
const APP_TITLE_TEMPLATE = "%s - PWA App";
const APP_DESCRIPTION = "터치를 통해 보상을 획득하세요";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: true,
  },
  //웹페이지가 소셜 미디어 플랫폼에서 어떻게 표시될지 정의
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}

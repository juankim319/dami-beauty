import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getMessages } from "@/lib/i18n";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const m = getMessages();

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://dami-beauty.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: m.meta.siteTitle,
    template: "%s | Dami Beauty",
  },
  description: m.meta.siteDescription,
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Dami Beauty",
  },
  icons: {
    icon: "/icons/icon.svg",
    apple: "/icons/apple-icon.svg",
  },
  openGraph: {
    title: "Dami Beauty",
    description: m.meta.siteDescription,
    locale: "tr_TR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#2a1219",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('dami-theme');var d=t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${inter.variable} min-h-dvh font-sans text-sm antialiased`}>
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { site } from "@/lib/site";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Loader } from "@/components/Loader";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: `${site.name} — ${site.subline}`,
  description: site.tagline,
  // TODO: once deployed, set this to your real domain — it fixes social
  // previews and canonical URLs.
  // metadataBase: new URL("https://yourdomain.com"),
  openGraph: {
    title: `${site.name} — ${site.subline}`,
    description: site.tagline,
    type: "website",
  },
};

/**
 * Resolves the theme BEFORE first paint. If this ran in React instead, every
 * load would flash the default theme for a frame before correcting itself.
 * Saved choice wins; otherwise fall back to the OS preference.
 */
const themeScript = `
(function(){
  try {
    var saved = localStorage.getItem('theme');
    var theme = saved || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-sans">
        <SmoothScroll />
        <Loader />
        <Header />
        {children}
      </body>
    </html>
  );
}

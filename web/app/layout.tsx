import type { Metadata } from "next";
import { Caveat, Inter, Red_Hat_Display } from "next/font/google";
import { t } from "@/lib/strings.uz";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const display = Red_Hat_Display({
  variable: "--font-display-face",
  subsets: ["latin"],
  weight: ["500", "600"],
});
const caveat = Caveat({ variable: "--font-caveat", subsets: ["latin"], weight: "600" });

const themeScript =
  "try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}";

export const metadata: Metadata = {
  title: t.meta.title,
  description: t.meta.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="uz"
      className={`${inter.variable} ${display.variable} ${caveat.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Tanlangan temani bo'yashdan oldin qo'yamiz, aks holda bir lahza boshqa tema ko'rinadi. */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

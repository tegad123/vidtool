import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import Script from "next/script";
import { Inter } from "next/font/google";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VideoTool - Free Video Global Downloader & Helper",
  description: "Download videos, extract audio, transcribe, summarize, and add subtitles locally.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
              {children}
            </main>
            <footer className="py-6 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-black text-center text-sm text-gray-500">
              <div className="flex justify-center gap-6 mb-2">
                <a href="/privacy" className="hover:text-gray-900 dark:hover:text-gray-300">Privacy</a>
                <a href="/terms" className="hover:text-gray-900 dark:hover:text-gray-300">Terms</a>
                <a href="/contact" className="hover:text-gray-900 dark:hover:text-gray-300">Contact</a>
              </div>
              <p className="text-xs text-gray-400">
                This site uses ads to support free access. Not affiliated with any social platform.
              </p>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

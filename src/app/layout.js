import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar";
import { ThemeProvider } from './components/ThemeProvider';
import Footer from './components/Footer';
import { GoogleAnalytics } from '@next/third-parties/google'
import Script from 'next/script'

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ideagnose",
  description: "ideagnose is an intellectual blo... You know what? See it for yourself, 80% chance you'll like parts of it.",
  openGraph: {
    title: "ideagnose",
    description: "ideagnose is an intellectual blo... You know what? See it for yourself, 80% chance you'll like parts of it.",
    url: "https://www.ideagnose.com",
    siteName: "ideagnose",
    images: [
      {
        url: "https://www.ideagnose.com/full1logo.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ideagnose",
    description: "",
    images: ["https://www.ideagnose.com/full1logo.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
      <link rel="manifest" href="/site.webmanifest" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#2C3E57" />
        <Script src="/scripts/theme.js" strategy="beforeInteractive" />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 transition-colors duration-300`}>
        <ThemeProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
        <GoogleAnalytics gaId="G-6Q4VNLV08G" />
      </body>
    </html>
  );
}

import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar";
import { ThemeProvider } from './components/ThemeProvider';
import Footer from './components/Footer';
import { GoogleAnalytics } from '@next/third-parties/google'

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
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" sizes="180x180" href="/penne8.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/penne8.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/penne8.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="#2C3E57" />
        <script
  dangerouslySetInnerHTML={{
    __html: `
      (function() {
        const theme = localStorage.getItem('color-theme');
        if (!theme) {
          localStorage.setItem('color-theme', 'dark');
          document.documentElement.classList.add('dark');
        } else if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        
        // Update theme-color meta tag based on current theme
        const metaThemeColor = document.querySelector('meta[name=theme-color]');
        if (!metaThemeColor) {
          const newMeta = document.createElement('meta');
          newMeta.name = 'theme-color';
          document.head.appendChild(newMeta);
        }
        
        // Define your status bar colors here
        const darkStatusBarColor = '#2C3E57';  // Dark blue for dark mode
        const lightStatusBarColor = '#f3f4f6'; // Light gray for light mode
        
        if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          metaThemeColor.setAttribute('content', darkStatusBarColor);
        } else {
          metaThemeColor.setAttribute('content', lightStatusBarColor);
        }
        
        // Listen for changes in color scheme
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
          const newTheme = e.matches ? 'dark' : 'light';
          metaThemeColor.setAttribute('content', newTheme === 'dark' ? darkStatusBarColor : lightStatusBarColor);
        });
      })();
    `,
  }}
/>
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 transition-colors duration-300`}>
        <ThemeProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId="G-6Q4VNLV08G" />
    </html>
  );
}
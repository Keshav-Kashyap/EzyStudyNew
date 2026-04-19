import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import Provider from "./Provider";
import { ThemeProvider } from './ThemeProvider';
import { Toaster } from 'sonner';
import UserAutoRegister from '@/components/UserAutoRegister';
import RoleBasedRedirect from '@/components/RoleBasedRedirect';
import ReactQueryProvider from '@/providers/ReactQueryProvider';
import { siteConfig, generateMetadata as generateSeoMetadata } from '@/lib/seo-config';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = generateSeoMetadata({
  title: siteConfig.title,
  description: siteConfig.description,
  url: "/",
  keywords: siteConfig.keywords,
});

export default function RootLayout({ children }) {
  return (

    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9698637801497906"
            crossOrigin="anonymous"></script>

          <link rel="icon" href="/Image.jpeg" sizes="any" type="image/jpeg" />
          <link rel="apple-touch-icon" href="/Image.jpeg" />
          <link rel="manifest" href="/site.webmanifest" />
          <meta name="theme-color" content="#3b82f6" />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
          <meta name="google-site-verification" content="your-verification-code" />
          <meta name="application-name" content="Ezy Learn" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="Ezy Learn" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ReactQueryProvider>
            <Provider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange={false}
              >
                <UserAutoRegister />
                <RoleBasedRedirect />
                {children}
                <Toaster position="top-right" />
              </ThemeProvider>
            </Provider>
          </ReactQueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

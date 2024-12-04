import type { Metadata } from "next";
import localFont from "next/font/local";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://sl-nic-details.vercel.app'),
  title: "Sri Lankan NIC Analyzer | Birth Date & Gender Calculator",
  description: "Free tool to analyze Sri Lankan National Identity Card (NIC) numbers. Calculate birth date, age, and gender from both old and new NIC formats.",
  keywords: ["Sri Lanka NIC", "NIC calculator", "birth date from NIC", "Sri Lankan ID validator", "NIC number analyzer"],
  authors: [{ name: "Tharsanan" }],
  openGraph: {
    title: "Sri Lankan NIC Analyzer | Birth Date & Gender Calculator",
    description: "Free tool to analyze Sri Lankan National Identity Card (NIC) numbers",
    type: "website",
    locale: "en_US",
    url: '/',
  },
  twitter: {
    card: "summary_large_image",
    title: "Sri Lankan NIC Analyzer",
    description: "Calculate birth date and gender from Sri Lankan NIC numbers",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Analytics mode="production" debug={false} />
        <SpeedInsights />
      </body>
    </html>
  );
}


import "./globals.css";
import "@uploadthing/react/styles.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://tilakpopatfilms.in"),
  title: {
    default: "TPF | Tilak Popat Films",
    template: "%s | Tilak Popat Films",
  },
  description: "Tilak Popat Films (TPF) is a premier film production house in India creating cinematic films, music videos, behind the scenes, and digital design media.",
  keywords: [
    "Tilak Popat Films",
    "TPF",
    "Tilak Popat",
    "Film Production House India",
    "Music Video Director India",
    "Independent filmmaker Mumbai",
    "TPF Films",
    "Behind the scenes filmmaking",
    "Cinematic video production"
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "TPF | Tilak Popat Films",
    description: "Tilak Popat Films (TPF) is a premier film production house in India creating cinematic films, music videos, and visual media.",
    url: "https://tilakpopatfilms.in",
    siteName: "Tilak Popat Films",
    images: [
      {
        url: "/tpf-logo-new.png",
        width: 800,
        height: 800,
        alt: "Tilak Popat Films Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TPF | Tilak Popat Films",
    description: "Creative Film Production House - Tilak Popat Films (TPF). Explore our premium projects, music videos, and crew.",
    images: ["/tpf-logo-new.png"],
  },
  icons: {
    icon: "/tpf-logo-new.png",
    apple: "/tpf-logo-new.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TPF Admin",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Prevent flash of wrong theme on initial load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('tpf-theme');
                  document.documentElement.setAttribute('data-theme', theme === 'light' ? 'light' : 'dark');
                } catch(e) {}
              })();
            `,
          }}
        />
        {/* Google Schema (JSON-LD) for Search Rich Results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Tilak Popat Films",
              "alternateName": "TPF",
              "url": "https://tilakpopatfilms.in",
              "logo": "https://tilakpopatfilms.in/tpf-logo-new.png",
              "description": "Tilak Popat Films (TPF) is a premier film production house in India creating cinematic films, music videos, behind the scenes, and digital design media.",
              "contactPoint": {
                "@type": "ContactPoint",
                "email": "work.tilakpopatfilms@gmail.com",
                "contactType": "production inquiries"
              },
              "sameAs": [
                "https://www.instagram.com/tilak_popat_films",
                "https://www.youtube.com/@tilakpopatfilms"
              ]
            })
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

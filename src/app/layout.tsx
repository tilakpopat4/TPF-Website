
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
  title: "TPF | Tilak Popat Films",
  description: "Creative Production House - Tilak Popat Films. Explore our premium projects, music, and talented crew.",
  keywords: ["TPF", "Tilak Popat Films", "Production House", "Film Production", "Music", "Creative Portfolio"],
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

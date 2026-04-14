import type { Metadata } from "next";
import "./globals.css";
import "@uploadthing/react/styles.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "TPF | Tilak Popat Films",
  description: "Creative Production House - Tilak Popat Films. Explore our premium projects, music, and talented crew.",
  keywords: ["TPF", "Tilak Popat Films", "Production House", "Film Production", "Music", "Creative Portfolio"],
  icons: {
    icon: "/tpf-logo-new.png",
    apple: "/tpf-logo-new.png",
  },
}; // Deployment Trigger: Sync v2

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}

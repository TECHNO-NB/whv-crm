import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { WrapperLayout } from "@/components/WrapperLayout";
import Navbar from "@/components/Navbar";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "World Hindu Vision CRM", // Updated Title
  description: "Next.js CRM Dashboard for NGO Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Define a consistent sidebar width (w-44 equals ml-44, which is 11rem)
  const sidebarWidthClass = "w-44";

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <main className="w-full">
        {/* <Navbar/> */}
       
          <WrapperLayout>{children}</WrapperLayout>
       
        </main>
      </body>
    </html>
  );
}

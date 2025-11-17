import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";


import Sidebar from "@/components/Sidebar";
import CountryManagerSidebar from "@/components/CountryChairmanSidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Country Manager ", // Updated Title
  description: "Next.js CRM Dashboard for NGO Management",
};

export default function AdminLayout({
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
        {/* Optional: Add Navbar here if it spans the entire width */}
        {/* <Navbar /> */}

        {/* 1. Main Dashboard Container: Uses Flex to position Sidebar and Content */}
        <div className="flex min-h-screen">
          {/* 2. Sidebar: Fixed Position on the left */}
          <div
            className={`fixed top-0 left-0 h-full bg-gray-900 z-10 ${sidebarWidthClass}`}
          >
            <CountryManagerSidebar />
          </div>

          {/* 3. Main Content Area */}
          <div
            className={`flex-1 ${sidebarWidthClass}`}
            style={{ marginLeft: "11rem" }}
          >
            {/* The ml-44 offset needs to be applied here to account for the fixed sidebar. */}
            {/* Tailwind's 'ml-44' is 11rem. */}

            {/* Content (Dashboard Pages) */}
            <main className="w-full">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}

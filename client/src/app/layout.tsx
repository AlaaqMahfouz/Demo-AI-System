import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Recruitment System",
  description: "Coded by J.A.G. in an internship for the FYP at MoonDev by Questa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="flex self-center h-full w-full" >
      <body className={`inter.className w-full font-mono`} >{children}</body>
    </html>
  );
}

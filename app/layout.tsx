import React from "react";
import "./globals.css";
import Image from "next/image";
import "react-loading-skeleton/dist/skeleton.css";
import { Toaster } from "@/components/ui/toaster";
export const metadata = {
  title: "Artisan Finder",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <>
          <Toaster />
          <Image src="/logo.png" alt="logo" priority width={100} height={50} />
          {children}
        </>
      </body>
    </html>
  );
}
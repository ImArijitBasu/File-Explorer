import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mini File Explorer — Webbly Media",
  description:
    "A modern mini file explorer web application for managing folders and text files in a hierarchical structure. Built with Next.js, TypeScript, and Tailwind CSS.",
  keywords: ["file explorer", "file manager", "Next.js", "TypeScript", "Webbly Media"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}

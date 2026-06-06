import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "3P Generator",
  description: "Generate 3 properties for any domain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

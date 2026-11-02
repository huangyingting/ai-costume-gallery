import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Costume Index | An AI outfit reference catalog",
  description:
    "Explore 1,407 AI-generated outfit references across eight collections. Search by garment, color, season, or ID and view artwork on the original gallery.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

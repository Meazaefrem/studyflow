import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Studyflow",
  description: "En enkel studieplanerare för dina uppgifter.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="sv">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
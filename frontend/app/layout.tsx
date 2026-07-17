import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Todo App",
  description: "Your personal task manager for quick daily planning.",
  openGraph: {
    title: "Todo App",
    description: "Your personal task manager for quick daily planning.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased font-sans">{children}</body>
    </html>
  );
}

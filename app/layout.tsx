import { Geist } from "next/font/google";
import "./globals.css";

export const metadata = {
  title: "Todue | Landing",
  description: "The fastest way to build apps with Next.js and Supabase",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}

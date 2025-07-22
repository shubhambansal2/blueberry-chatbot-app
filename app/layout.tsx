import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ShopProvider } from '../components/ShopContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Purpleberry AI | LLM Powered Chatbots",
  description: "Harness the power of LLMs to build chatbots for your business",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ShopProvider>{children}</ShopProvider>
      </body>
    </html>
  );
}

import clsx from "clsx";
import { usePathname } from "next/navigation";
import React from "react";
import { Banner } from "./Banner";
import { Footer } from "./Footer";
import Navbar from "./Navbar/Navbar";
import { Metadata } from "next";

// Define metadata type
interface CustomMeta extends Metadata {
  type?: string;
  image?: string;
}

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  metadata?: CustomMeta;
}

// Metadata can be exported from the page itself
export const metadata: Metadata = {
  title: "Foxtrot | SaaS Marketing Template",
  description: "Foxtrot is a SaaS marketing template developed at Aceternity. It is built with Next.js, Tailwind CSS, and Framer Motion.",
  openGraph: {
    title: "Foxtrot | SaaS Marketing Template",
    description: "Foxtrot is a SaaS marketing template developed at Aceternity. It is built with Next.js, Tailwind CSS, and Framer Motion.",
    url: "https://blueberryai.com",
    siteName: "foxtrotaceternity",
    images: [
      {
        url: "https://foxtrot.aceternity.com/banner.png",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@foxtrotaceternity",
    title: "Foxtrot | SaaS Marketing Template",
    description: "Foxtrot is a SaaS marketing template developed at Aceternity. It is built with Next.js, Tailwind CSS, and Framer Motion.",
    images: ["https://foxtrot.aceternity.com/banner.png"],
  },
  robots: "index, follow",
};

export const Container = ({ children, className, metadata: customMeta }: ContainerProps) => {
  const pathname = usePathname();

  // Merge default metadata with custom metadata
  const meta = {
    ...metadata,
    ...customMeta,
  };

  return (
    <>
      {/* Banner and Navbar are commented out in the original code */}
      {/* <Banner /> */}
      {/* <Navbar /> */}
      <main className={clsx("antialiased", className)}>{children}</main>
      <Footer />
    </>
  );
};

// If you need to generate dynamic metadata, you can use this function in your pages
export async function generateMetadata({ params }: any): Promise<Metadata> {
  return {
    ...metadata,
    alternates: {
      canonical: `https://foxtrot.aceternity.com${params?.slug || ''}`,
    },
  };
}
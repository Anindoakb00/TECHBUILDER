import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner"
import Header from "@/components/Header"
import Footer from "@/components/Footer"




const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TechBuilders – Your One Stop Tech Shop",
    template: "%s | TechBuilders",
  },
  description: "TechBuilders is your trusted online tech store for laptops, gadgets, and accessories.",
  keywords: ["TechBuilders", "laptops", "gadgets", "accessories", "ecommerce"],
  openGraph: {
    type: "website",
    url: "https://www.techbuilders.com",
    title: "TechBuilders – Your One Stop Tech Shop",
    description: "Buy laptops, gadgets, and accessories with fast delivery.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TechBuilders Ecommerce Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@TechBuilders",
    title: "TechBuilders – Shop Smarter",
    description: "TechBuilders is your trusted online tech store.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  )
}
import { auth } from "@/auth"
import type { Metadata } from "next"
import { SessionProvider } from "next-auth/react"
import localFont from "next/font/local"
import { ReactNode } from "react"
import { Toaster } from "sonner"
import "./globals.css"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export const metadata: Metadata = {
  title: "TAMA Farmers Trust",
  description: "Leading farmers to prosperity",
  keywords: [
    "TAMA Farmers Trust",
    "Farming in Malawi",
    "Agriculture in Malawi",
    "Malawi Farmers",
    "Tobacco Farming",
    "Malawi Agriculture Development",
    "Farming Solutions",
    "Agricultural Trust Malawi",
    "Malawi Farmers Cooperative",
  ],
  other: {
    canonical: "https://tamalawi.com",
  },
  openGraph: {
    title: "TAMA Farmers Trust | Leading farmers to prosperity",
    description:
      "Discover how TAMA Farmers Trust supports farmers in Malawi with agricultural resources, financial trust services, and a commitment to sustainability.",
    url: "https://tamalawi.com",
    images: [
      {
        url: "https://tamalawi.com/assets/images/logo.png",
        width: 1200,
        height: 630,
        alt: "TAMA Farmers Trust in Malawi - Agriculture and Prosperity",
      },
    ],
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
}

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const session = await auth()

  return (
    <SessionProvider session={session}>
      <html lang="en">
        <head>
          {/* Geography Meta Tags */}
          <meta name="geo.region" content="MW-LI" />
          <meta name="geo.placename" content="Lilongwe" />
          <meta name="geo.position" content="-13.9626;33.7741" />
          <meta name="ICBM" content="-13.9626, 33.7741" />
          {/* Canonical URL */}
          <link rel="canonical" href="https://tamalawi.com" />
          <link rel="icon" href="/favicon.ico" />
          {/* Open Graph Meta Tags for Facebook */}
          <meta
            property="og:title"
            content="TAMA Farmers Trust | Leading farmers to prosperity"
          />
          <meta
            property="og:description"
            content="Discover how TAMA Farmers Trust supports farmers in Malawi with agricultural resources, financial trust services, and a commitment to sustainability."
          />
          <meta property="og:url" content="https://tamalawi.com" />
          <meta
            property="og:image"
            content="https://tamalawi.com/assets/images/logo.png"
          />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="TAMA Farmers Trust" />
          {/* Twitter Card Meta Tags */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content="TAMA Farmers Trust | Leading farmers to prosperity"
          />
          <meta
            name="twitter:description"
            content="Leading farmers in Malawi to prosperity with innovative solutions in agriculture and trust management."
          />
          <meta
            name="twitter:image"
            content="https://tamalawi.com/assets/images/logo.png"
          />
          <meta name="twitter:site" content="@TamaTrust" />
          <meta name="twitter:creator" content="@TamaTrust" />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <div className="main">
            <div className="gradient" />
          </div>
          <main className="z-50">{children}</main>
          <Toaster />
        </body>
      </html>
    </SessionProvider>
  )
}

export default RootLayout

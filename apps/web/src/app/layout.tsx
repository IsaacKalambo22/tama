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
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <div className="main">
            <div className="gradient" />
          </div>
          <main className="z-50">{children}</main>
          <Toaster richColors closeButton />
        </body>
      </html>
    </SessionProvider>
  )
}

export default RootLayout

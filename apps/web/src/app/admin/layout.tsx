import type { Metadata } from "next"
import DashboardWrapper from "./dashboard-wrapper"

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

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <DashboardWrapper>{children}</DashboardWrapper>
}

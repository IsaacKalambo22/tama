import type { Metadata } from "next"
import DashboardWrapper from "./dashboard-wrapper"

export const metadata: Metadata = {
  title: "TAMA Farmers Trust | Farmer Dashboard",
  description: "Farmer Dashboard for TAMA Farmers Trust",
  keywords: [
    "TAMA Farmers Trust",
    "Farmer Dashboard",
    "Farming in Malawi",
    "Agriculture in Malawi",
  ],
}

export default function FarmerLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <DashboardWrapper>{children}</DashboardWrapper>
}

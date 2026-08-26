import type { Metadata } from "next"
import DashboardWrapper from "./dashboard-wrapper"

export const metadata: Metadata = {
  title: "TAMA Farmers Trust | District Admin",
  description: "District Admin Dashboard for TAMA Farmers Trust",
  keywords: [
    "TAMA Farmers Trust",
    "District Admin",
    "Farming in Malawi",
    "Agriculture in Malawi",
  ],
}

export default function DistrictAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <DashboardWrapper>{children}</DashboardWrapper>
}

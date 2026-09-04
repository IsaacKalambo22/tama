import type { Metadata } from "next"
import DashboardWrapper from "./dashboard-wrapper"

export const metadata: Metadata = {
  title: "TAMA Farmers Trust | Council Admin",
  description: "Council Admin Dashboard for TAMA Farmers Trust",
  keywords: [
    "TAMA Farmers Trust",
    "Council Admin",
    "Farming in Malawi",
    "Agriculture in Malawi",
  ],
}

export default function CouncilAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <DashboardWrapper>{children}</DashboardWrapper>
}

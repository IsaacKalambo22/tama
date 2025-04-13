import Services from "@/modules/client/services"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Services - TAMA Farmers Trust",
  description:
    "Explore the wide range of services offered by TAMA Farmers Trust to support and empower farmers.",
}

const ServicesPage = () => {
  return <Services />
}

export default ServicesPage

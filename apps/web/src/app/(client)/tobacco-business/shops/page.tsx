import Shop from "@/modules/client/shop"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shops - TAMA Farmers Trust",
  description: "Find our trusted Agre-shops near you.",
}

const ShopsPage = () => {
  return <Shop />
}

export default ShopsPage

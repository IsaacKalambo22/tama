import FormsAndDocuments from "@/modules/client/forms-documents"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Downloads - TAMA Farmers Trust",
  description: "Access important downloads provided by TAMA Farmers Trust.",
}

const FormsPage = () => {
  return <FormsAndDocuments />
}

export default FormsPage

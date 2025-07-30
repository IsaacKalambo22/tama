import FormsAndDocuments from "@/modules/client/forms-documents"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Downloads - TAMA Farmers Trust",
  description:
    "Download and access important documents provided by TAMA Farmers Trust.",
}

const FormsPage = () => {
  return <FormsAndDocuments />
}

export default FormsPage

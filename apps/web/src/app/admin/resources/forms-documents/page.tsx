import FormsAndDocuments from "@/modules/admin/forms-documents"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Forms and Documents - TAMA Farmers Trust",
  description:
    "Access important forms and documents provided by TAMA Farmers Trust.",
}

const FormsAndDocumentsPage = () => {
  return <FormsAndDocuments />
}

export default FormsAndDocumentsPage

import Contact from "@/modules/client/contact"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us - TAMA Farmers Trust",
  description:
    "Reach out to TAMA Farmers Trust for inquiries, support, and partnerships.",
}

const ContactPage = () => {
  return <Contact />
}

export default ContactPage

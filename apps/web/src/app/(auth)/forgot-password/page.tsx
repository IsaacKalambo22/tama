import ForgotPassword from "@/modules/auth/forgot-password"
import { Metadata } from "next"
export const metadata: Metadata = {
  title: "Forgot Password | TAMA Farmers Trust",
  description: "Access your TAMA Farmers Trust account.",
}

const ForgotPasswordPage = () => {
  return <ForgotPassword />
}

export default ForgotPasswordPage

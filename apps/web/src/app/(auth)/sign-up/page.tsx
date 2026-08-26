import SignUp from "@/modules/auth/sign-up"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "TAMA Farmers Trust | Sign Up",
  description: "Create a farmer account on TAMA Farmers Trust",
}

export default function SignUpPage() {
  return <SignUp />
}

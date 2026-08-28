import CreatePassword from "@/modules/auth/create-password"
import { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Create Password - Tama Farmers Trust",
  description:
    "Create your password to access your account with Tama Farmers Trust.",
}

const CreatePasswordPage = () => {
  return (
    <Suspense fallback={null}>
      <CreatePassword />
    </Suspense>
  )
}

export default CreatePasswordPage

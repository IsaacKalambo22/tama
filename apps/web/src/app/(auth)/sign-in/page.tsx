import SignIn from "@/modules/auth/sign-in"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign In | TAMA Farmers Trust",
  description:
    "Sign in to your TAMA Farmers Trust account to access your dashboard.",
  keywords: [
    "TAMA Farmers Trust Login",
    "Sign In TAMA Farmers Trust",
    "Malawi Farmers",
    "Tobacco Farming",
    "Agriculture in Malawi",
  ],
  openGraph: {
    title: "Sign In | TAMA Farmers Trust",
    description:
      "Sign in to your TAMA Farmers Trust account to access your dashboard.",
    url: "https://tamalawi.com/sign-in",
    images: [
      {
        url: "https://tamalawi.com/assets/images/logo.png",
        width: 1200,
        height: 630,
        alt: "Sign In - TAMA Farmers Trust",
      },
    ],
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
}

const SignInPage = () => {
  return <SignIn />
}

export default SignInPage

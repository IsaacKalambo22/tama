"use client"

import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import { FaFacebook, FaTwitter } from "react-icons/fa"
import { FcGoogle } from "react-icons/fc"

const SocialLogin = () => {
  const socialLogin = (provider: "google" | "facebook" | "twitter") => {
    signIn(provider, { callbackUrl: "/" })
  }

  return (
    <div className="flex w-full gap-2 items-center justify-between">
      <Button
        onClick={() => socialLogin("google")}
        className="flex-1 h-9 bg-transparent mr-1" // Use flex-1 for equal width and add margin right
        variant="outline"
        size="icon"
      >
        <FcGoogle className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => socialLogin("facebook")}
        className="flex-1 h-9 bg-transparent mr-1" // Same as above
        variant="outline"
        size="icon"
      >
        <FaFacebook className="h-4 w-4 text-[#1877F2]" />
      </Button>
      <Button
        onClick={() => socialLogin("twitter")}
        className="flex-1 h-9 bg-transparent" // No margin here for the last button
        variant="outline"
        size="icon"
      >
        <FaTwitter className="h-4 w-4 text-[#1DA1F2]" />
      </Button>
    </div>
  )
}

export default SocialLogin

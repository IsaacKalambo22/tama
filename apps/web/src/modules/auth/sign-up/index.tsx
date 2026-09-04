"use client"

import { CouncilProps, DistrictProps } from "@/lib/api"
import { FormFieldType } from "@/modules/common/custom-form-field"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { signUp } from "../actions"
import AuthForm, { FormType } from "../auth-form"
import { signUpSchema } from "../validation"

const SignUp = () => {
  const router = useRouter()
  const [councils, setCouncils] = useState<CouncilProps[]>([])
  const [districts, setDistricts] = useState<DistrictProps[]>([])
  const [selectedCouncil, setSelectedCouncil] = useState<string>("")

  useEffect(() => {
    const fetchCouncils = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/councils`,
          {
            headers: { "Content-Type": "application/json" },
          }
        )
        const data = await res.json()
        if (data.success) {
          setCouncils(data.data)
        }
      } catch (error) {
        console.error("Failed to fetch councils:", error)
      }
    }
    fetchCouncils()
  }, [])

  useEffect(() => {
    if (!selectedCouncil) {
      setDistricts([])
      return
    }
    const fetchDistricts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/councils/${selectedCouncil}/districts`,
          {
            headers: { "Content-Type": "application/json" },
          }
        )
        const data = await res.json()
        if (data.success) {
          setDistricts(data.data)
        }
      } catch (error) {
        console.error("Failed to fetch districts:", error)
      }
    }
    fetchDistricts()
  }, [selectedCouncil])

  const handleSignUp = async (values: any) => {
    const result = await signUp({
      name: values.fullName,
      email: values.email,
      phoneNumber: values.phoneNumber || "",
      role: "FARMER",
      councilId: values.councilId || undefined,
      districtId: values.districtId || undefined,
    })

    if (result.success) {
      toast.success(
        "Account created! Please check your email to set your password."
      )
      router.push("/sign-in")
    } else {
      toast.error(result.error || "An error occurred during sign up.")
    }
  }

  return (
    <AuthForm
      type={FormType.SIGN_UP}
      schema={signUpSchema}
      defaultValues={{
        fullName: "",
        email: "",
        phoneNumber: "",
        councilId: "",
        districtId: "",
      }}
      fieldTypes={{
        fullName: FormFieldType.INPUT,
        email: FormFieldType.INPUT,
        phoneNumber: FormFieldType.PHONE_INPUT,
        councilId: FormFieldType.SELECT,
        districtId: FormFieldType.SELECT,
      }}
      onSubmit={handleSignUp}
      councils={councils}
      districts={districts}
      selectedCouncil={selectedCouncil}
      onCouncilChange={setSelectedCouncil}
    />
  )
}

export default SignUp

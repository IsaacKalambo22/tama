"use client"

import { FormFieldType } from "@/modules/common/custom-form-field"
import { useSearchParams } from "next/navigation"
import { setFirstLoginPassword } from "../actions"
import AuthForm, { FormType } from "../auth-form"
import { setPasswordSchema } from "../validation"

const CreatePassword = () => {
  const searchParams = useSearchParams()
  const token = searchParams.get("token") ?? ""
  const email = searchParams.get("email") ?? ""

  const handleSubmit = async (data: {
    password: string
    confirmPassword: string
    verificationToken?: string
  }) => {
    return setFirstLoginPassword({
      setupToken: data.verificationToken ?? token,
      email,
      password: data.password,
    })
  }

  return (
    <div className="w-full flex flex-col gap-2">
      {email && (
        <p className="text-center text-muted-foreground text-sm">
          Create a password for{" "}
          <span className="font-medium text-foreground">{email}</span>
        </p>
      )}
      {!token && (
        <p className="text-center text-destructive text-sm">
          This link is invalid or has expired. Please try signing in again.
        </p>
      )}
      <AuthForm
        type={FormType.SET_PASSWORD}
        schema={setPasswordSchema}
        defaultValues={{
          password: "",
          confirmPassword: "",
        }}
        fieldTypes={{
          password: FormFieldType.PASSWORD,
          confirmPassword: FormFieldType.PASSWORD,
        }}
        verificationToken={token}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

export default CreatePassword

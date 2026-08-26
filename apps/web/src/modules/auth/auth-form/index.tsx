"use client"

import { Form } from "@/components/ui/form"
import { SelectItem } from "@/components/ui/select"
import { CouncilProps, DistrictProps } from "@/lib/api"
import CustomFormField, {
  FormFieldType,
} from "@/modules/common/custom-form-field"
import SubmitButton from "@/modules/common/submit-button"
import { zodResolver } from "@hookform/resolvers/zod"
import { getSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
  UseFormReturn,
} from "react-hook-form"
import { toast } from "sonner"
import { ZodType } from "zod"
import { FIELD_NAMES } from "../constants"

export enum FormType {
  SIGN_IN = "SIGN_IN",
  SIGN_UP = "SIGN_UP",
  SET_PASSWORD = "SET_PASSWORD",
  RESET_PASSWORD = "RESET_PASSWORD",
  FORGOT_PASSWORD = "FORGOT_PASSWORD",
}

interface AuthFormProps<T extends FieldValues> {
  schema: ZodType<T>
  defaultValues: T
  fieldTypes?: Record<string, FormFieldType>
  onSubmit: (data: T & { verificationToken?: string }) => Promise<{
    success: boolean
    error?: string
  }>
  type: FormType
  verificationToken?: string
  councils?: CouncilProps[]
  districts?: DistrictProps[]
  selectedCouncil?: string
  onCouncilChange?: (value: string) => void
}

const AuthForm = <T extends FieldValues>({
  type,
  schema,
  defaultValues,
  fieldTypes = {},
  onSubmit,
  verificationToken,
  councils = [],
  districts = [],
  selectedCouncil = "",
  onCouncilChange,
}: AuthFormProps<T>) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)

  const isSignIn = type === FormType.SIGN_IN
  const isSignUp = type === FormType.SIGN_UP
  const isSetPassword = type === FormType.SET_PASSWORD
  const isResetPassword = type === FormType.RESET_PASSWORD
  const isForgotPassword = type === FormType.FORGOT_PASSWORD

  const form: UseFormReturn<T> = useForm({
    resolver: zodResolver(schema),
    mode: "all",
    defaultValues: defaultValues as DefaultValues<T>,
  })

  const handleSubmit: SubmitHandler<T> = async (data) => {
    setIsLoading(true)

    const result = await onSubmit({
      ...data,
      ...((isSetPassword || isResetPassword) && verificationToken
        ? { verificationToken }
        : {}),
    })

    if (result.success) {
      toast.success(
        isSignIn
          ? "Signed in successfully"
          : isSignUp
            ? "Account created! Please check your email to set your password."
            : isResetPassword
              ? "Password has been reset successfully"
              : isForgotPassword
                ? "Verification details sent to your email."
                : "Password has been set successfully."
      )

      setIsRedirecting(true)
      if (isForgotPassword) router.push("/")
      if (isSignUp) {
        router.push("/sign-in")
      } else {
        await getSession()
        router.refresh()
      }
    } else {
      toast.error(result.error ?? "An error occurred.")
    }
    setIsLoading(false)
  }

  const getFieldLabel = (field: string): string => {
    const labels: Record<string, string> = {
      fullName: "Full Name",
      email: "Email",
      password: "Password",
      phoneNumber: "Phone Number",
      councilId: "Council (Area)",
      districtId: "District",
    }
    return (
      labels[field] || FIELD_NAMES[field as keyof typeof FIELD_NAMES] || field
    )
  }

  return (
    <div className="w-full flex flex-col gap-2 mt-2">
      <h1 className="text-2xl text-center font-semibold">
        {isSignIn
          ? "Welcome back"
          : isSignUp
            ? "Create a Farmer Account"
            : isSetPassword
              ? "Set Your Password"
              : isResetPassword
                ? "Reset Your Password"
                : "Forgot Your Password"}
      </h1>

      {isSignUp && (
        <p className="text-center text-muted-foreground text-sm">
          Register as a farmer to access your dashboard
        </p>
      )}

      {isForgotPassword && (
        <p className="text-center text-muted-foreground text-sm">
          Enter your email address and we&apos;ll send you a link to reset your
          password
        </p>
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="w-full min-w-full flex flex-col gap-2"
        >
          {Object.entries(defaultValues).map(([field]) => {
            if (field === "councilId" && isSignUp) {
              return (
                <CustomFormField
                  key={field}
                  fieldType={FormFieldType.SELECT}
                  name={field as Path<T>}
                  label={getFieldLabel(field)}
                  control={form.control}
                  placeholder="Select your council"
                  onChange={(value) => {
                    form.setValue(field as Path<T>, value as any)
                    onCouncilChange?.(value)
                  }}
                >
                  {councils.map((council) => (
                    <SelectItem key={council.id} value={council.id}>
                      {council.name}
                    </SelectItem>
                  ))}
                </CustomFormField>
              )
            }

            if (field === "districtId" && isSignUp && selectedCouncil) {
              return (
                <CustomFormField
                  key={field}
                  fieldType={FormFieldType.SELECT}
                  name={field as Path<T>}
                  label={getFieldLabel(field)}
                  control={form.control}
                  placeholder="Select your district"
                >
                  {districts.map((district) => (
                    <SelectItem key={district.id} value={district.id}>
                      {district.name}
                    </SelectItem>
                  ))}
                </CustomFormField>
              )
            }

            if (field === "councilId" || field === "districtId") {
              return null
            }

            return (
              <CustomFormField
                key={field}
                fieldType={fieldTypes[field] || FormFieldType.INPUT}
                name={field as Path<T>}
                label={getFieldLabel(field)}
                control={form.control}
              />
            )
          })}

          {isSignIn && (
            <Link className="mt-1" href="/forgot-password">
              <p className="text-gray-600 hover:text-primary text-sm font-semibold transition duration-200">
                Forgot password?
              </p>
            </Link>
          )}

          {isSignIn && (
            <Link className="mt-1" href="/sign-up">
              <p className="text-gray-600 hover:text-primary text-sm font-semibold transition duration-200">
                Don&apos;t have an account? Sign up
              </p>
            </Link>
          )}

          <SubmitButton
            disabled={isLoading || isRedirecting || !form.formState.isValid}
            isLoading={isLoading || isRedirecting}
            className="w-full h-9 mt-3"
            loadingText={
              isRedirecting
                ? "Redirecting..."
                : isSignIn
                  ? "Signing in..."
                  : isSignUp
                    ? "Creating account..."
                    : isResetPassword
                      ? "Resetting..."
                      : isForgotPassword
                        ? "Sending reset link..."
                        : "Setting password..."
            }
          >
            {isSignIn
              ? "Sign In"
              : isSignUp
                ? "Create Account"
                : isResetPassword
                  ? "Reset Password"
                  : isForgotPassword
                    ? "Send Reset Link"
                    : "Set Password"}
          </SubmitButton>
        </form>
      </Form>
    </div>
  )
}

export default AuthForm

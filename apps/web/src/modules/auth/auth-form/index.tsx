"use client"

import { Form } from "@/components/ui/form"
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

// Keep in sync with roleRouteMap in src/middleware.ts
const ROLE_LANDING_ROUTES: Record<string, string> = {
  SUPER_ADMIN: "/admin",
  COUNCIL_ADMIN: "/council-admin",
  DISTRICT_ADMIN: "/district-admin",
  FARMER: "/farmer",
}

export enum FormType {
  SIGN_IN = "SIGN_IN",
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
    requiresPasswordSetup?: boolean
    email?: string
    setupToken?: string
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

    if (result.requiresPasswordSetup) {
      const query = new URLSearchParams({
        token: result.setupToken ?? "",
        email: result.email ?? "",
      })
      router.push(`/create-password?${query.toString()}`)
      setIsLoading(false)
      return
    }

    if (result.success) {
      toast.success(
        isSignIn
          ? "Signed in successfully"
          : isResetPassword
            ? "Password has been reset successfully"
            : isForgotPassword
              ? "Verification details sent to your email."
              : "Password has been set successfully."
      )

      setIsRedirecting(true)
      if (isForgotPassword) {
        router.push("/")
      } else {
        // Navigate to the landing route for the signed-in role. Relying on
        // router.refresh() alone leaves the user where they are, since the
        // middleware returns early for public routes before it can redirect.
        const session = await getSession()
        const role = (session as { role?: string } | null)?.role
        router.push(ROLE_LANDING_ROUTES[role ?? ""] ?? "/farmer")
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
          : isSetPassword
            ? "Set Your Password"
            : isResetPassword
              ? "Reset Your Password"
              : "Forgot Your Password"}
      </h1>

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

          <SubmitButton
            disabled={isLoading || isRedirecting || !form.formState.isValid}
            isLoading={isLoading || isRedirecting}
            className="w-full h-9 mt-3"
            loadingText={
              isRedirecting
                ? "Redirecting..."
                : isSignIn
                  ? "Signing in..."
                  : isResetPassword
                    ? "Resetting..."
                    : isForgotPassword
                      ? "Sending reset link..."
                      : "Setting password..."
            }
          >
            {isSignIn
              ? "Sign In"
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

"use client"

import { Form } from "@/components/ui/form"
import { SelectItem } from "@/components/ui/select"
import useCustomPath from "@/hooks/use-custom-path"
import { CouncilProps, DistrictProps, Role } from "@/lib/api"
import { normalizeMalawiPhone } from "@/lib/phone-validation"
import CustomFormField, {
  FormFieldType,
} from "@/modules/common/custom-form-field"
import SubmitButton from "@/modules/common/submit-button"
import { zodResolver } from "@hookform/resolvers/zod"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as zod from "zod"
import { createUser } from "../../actions"
import Modal from "../../modal"

type Props = {
  isOpen: boolean
  onClose: () => void
  id?: string | null
}

const roleLabels: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  COUNCIL_ADMIN: "Council Admin",
  DISTRICT_ADMIN: "District Admin",
  FARMER: "Farmer",
}

const ModalNewUser = ({ isOpen, onClose }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const path = usePathname()
  const { fullPath } = useCustomPath(path)
  const [showPassword, setShowPassword] = useState(false)
  const [councils, setCouncils] = useState<CouncilProps[]>([])
  const [districts, setDistricts] = useState<DistrictProps[]>([])
  const [selectedRole, setSelectedRole] = useState<string>("")
  const [selectedCouncil, setSelectedCouncil] = useState<string>("")

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }
  const phoneNumberRegex = /^(\+265(9|8)\d{8}|0(9|8)\d{8})$/

  const formSchema = zod.object({
    firstName: zod.string().min(2, {
      message: "First name must be at least 2 characters.",
    }),
    lastName: zod.string().min(2, {
      message: "Last name must be at least 2 characters.",
    }),
    email: zod.string().email({
      message: "Invalid email address.",
    }),
    phoneNumber: zod.string().regex(phoneNumberRegex, {
      message:
        "Phone number must be a valid TNM or Airtel number (e.g., +2659XXXXXXXX or 09XXXXXXXX).",
    }),
    role: zod.string().min(1, { message: "Role is required." }),
    councilId: zod.string().optional(),
    districtId: zod.string().optional(),
  })

  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      role: "",
      councilId: "",
      districtId: "",
    },
  })

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
    if (isOpen) {
      fetchCouncils()
    }
  }, [isOpen])

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

  const showScopeFields =
    selectedRole === "COUNCIL_ADMIN" ||
    selectedRole === "DISTRICT_ADMIN" ||
    selectedRole === "FARMER"

  const showDistrictField =
    selectedRole === "DISTRICT_ADMIN" || selectedRole === "FARMER"

  const onSubmit = async (values: zod.infer<typeof formSchema>) => {
    setIsLoading(true)
    const name = `${values.firstName} ${values.lastName}`.trim()
    const email = values.email
    const phoneNumber = normalizeMalawiPhone(values.phoneNumber)
    const role = values.role
    const payload: Record<string, any> = {
      name,
      email,
      phoneNumber,
      role,
    }

    if (values.councilId) {
      payload.councilId = values.councilId
    }
    if (values.districtId) {
      payload.districtId = values.districtId
    }

    const result = await createUser(payload, fullPath, "/admin")

    onClose()
    if (result.success) {
      toast.success("User created successfully")
    } else {
      toast.error(result.error ?? "An error occurred.")
    }
    setIsLoading(false)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Add New User">
      <Form {...form}>
        <form
          className="flex flex-col gap-5 w-full"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            name="firstName"
            label="First name"
            control={form.control}
            placeholder="John"
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            name="lastName"
            label="Last name"
            control={form.control}
            placeholder="Doe"
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            name="email"
            label="Email"
            control={form.control}
            placeholder="johndoe@gmail.com"
          />
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            name="role"
            label="Role"
            control={form.control}
            placeholder="Select a role"
            onChange={(value) => {
              setSelectedRole(value)
              form.setValue("role", value)
              form.setValue("councilId", "")
              form.setValue("districtId", "")
            }}
          >
            {Object.values(Role).map((role) => (
              <SelectItem key={role} value={role}>
                <div className="flex cursor-pointer items-center gap-2">
                  <p>{roleLabels[role] || role}</p>
                </div>
              </SelectItem>
            ))}
          </CustomFormField>

          {showScopeFields && (
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              name="councilId"
              label="Council (Area)"
              control={form.control}
              placeholder="Select a council"
              onChange={(value) => {
                setSelectedCouncil(value)
                form.setValue("councilId", value)
                form.setValue("districtId", "")
              }}
            >
              {councils.map((council) => (
                <SelectItem key={council.id} value={council.id}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <p>{council.name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>
          )}

          {showDistrictField && selectedCouncil && (
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              name="districtId"
              label="District"
              control={form.control}
              placeholder="Select a district"
            >
              {districts.map((district) => (
                <SelectItem key={district.id} value={district.id}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <p>{district.name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>
          )}

          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            name="phoneNumber"
            label="Phone number"
            control={form.control}
            placeholder="Enter phone number"
          />

          <SubmitButton
            disabled={isLoading || !form.formState.isValid}
            isLoading={isLoading}
            className="w-full h-9"
            loadingText="Saving..."
          >
            Save
          </SubmitButton>
        </form>
      </Form>
    </Modal>
  )
}

export default ModalNewUser

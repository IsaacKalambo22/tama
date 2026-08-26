"use client"

import { Form } from "@/components/ui/form"
import { SelectItem } from "@/components/ui/select"
import useCustomPath from "@/hooks/use-custom-path"
import { CouncilProps, DistrictProps, Role, UserProps } from "@/lib/api"
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
import { updateUser } from "../../actions"
import Modal from "../../modal"

type Props = {
  isOpen: boolean
  onClose: () => void
  user: UserProps
}

const roleLabels: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  COUNCIL_ADMIN: "Council Admin",
  DISTRICT_ADMIN: "District Admin",
  FARMER: "Farmer",
}

const ModalEditUser = ({ isOpen, onClose, user }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [councils, setCouncils] = useState<CouncilProps[]>([])
  const [districts, setDistricts] = useState<DistrictProps[]>([])
  const [selectedRole, setSelectedRole] = useState<string>(user.role)
  const [selectedCouncil, setSelectedCouncil] = useState<string>(
    user.councilId || ""
  )

  const path = usePathname()
  const { fullPath } = useCustomPath(path)

  const phoneNumberRegex = /^\+?[1-9]\d{1,14}$/

  const formSchema = zod.object({
    name: zod.string().min(2, "Name must be at least 2 characters.").optional(),
    email: zod.string().email("Invalid email address.").optional(),
    phoneNumber: zod
      .string()
      .regex(phoneNumberRegex, {
        message: "Phone number must be in a valid international format.",
      })
      .optional(),
    role: zod.string().optional(),
    councilId: zod.string().optional(),
    districtId: zod.string().optional(),
  })

  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      role: user.role,
      councilId: user.councilId || "",
      districtId: user.districtId || "",
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
    const payload: Record<string, any> = {
      name: values.name || undefined,
      email: values.email || undefined,
      phoneNumber: values.phoneNumber || undefined,
      role: values.role || undefined,
      councilId: values.councilId || null,
      districtId: values.districtId || null,
    }
    const result = await updateUser(payload, user.id, fullPath)

    onClose()
    if (result.success) {
      toast.success("User updated successfully")
    } else {
      toast.error(result.error ?? "An error occurred.")
    }
    setIsLoading(false)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} name={`Edit ${user.name}`}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full"
        >
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            name="name"
            label="Full name"
            control={form.control}
            placeholder="John Doe"
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
            }}
          >
            {Object.values(Role).map((role) => (
              <SelectItem key={role} value={role}>
                {roleLabels[role] || role}
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
            label="Phone Number"
            control={form.control}
            placeholder="Enter phone number"
          />
          <SubmitButton
            disabled={isLoading || !form.formState.isValid}
            isLoading={isLoading}
            loadingText="Updating..."
            className="w-full h-9"
          >
            Update
          </SubmitButton>
        </form>
      </Form>
    </Modal>
  )
}

export default ModalEditUser

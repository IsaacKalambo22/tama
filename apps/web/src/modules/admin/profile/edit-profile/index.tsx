"use client"
import { Form, FormControl } from "@/components/ui/form"
import useCustomPath from "@/hooks/use-custom-path"
import { useFileUpload } from "@/hooks/use-file-upload"
import { toast } from "@/hooks/use-toast"
import { UserProps } from "@/lib/api"
import { passwordRegex } from "@/modules/auth/validation"
import CustomFormField, {
  FormFieldType,
} from "@/modules/common/custom-form-field"
import { FileUploader } from "@/modules/common/file-uploader"
import SubmitButton from "@/modules/common/submit-button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSession } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as zod from "zod"
import { updateUser } from "../../actions"
import Modal from "../../modal"

type Props = {
  isOpen: boolean
  onClose: () => void
  refetch: () => void
  user?: UserProps | null
}

const profileRedirect: Record<string, string> = {
  SUPER_ADMIN: "/admin/profile",
  COUNCIL_ADMIN: "/council-admin/profile",
  DISTRICT_ADMIN: "/district-admin/profile",
  FARMER: "/farmer/profile",
}

const ModalEditProfile = ({ isOpen, onClose, refetch, user }: Props) => {
  const { data: session } = useSession()

  const path = usePathname()
  const { fullPath } = useCustomPath(path)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const {
    uploadFile,
    status: uploadStatus,
    progress: uploadProgress,
    error: uploadError,
  } = useFileUpload({
    path: "profile",
  })
  const router = useRouter()

  const currentValues = {
    name: user?.name || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    district: user?.district || "",
    about: user?.about || "",
  }

  const formSchema = zod.object({
    name: zod.string().optional(),
    district: zod.string().optional(),
    about: zod.string().optional(),
    email: zod.string().optional(),
    phoneNumber: zod.string().optional(),
    newPassword: zod.string().optional(),
    confirmPassword: zod.string().optional(),
    files: zod.custom<File[]>(),
  })

  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      ...currentValues,
      newPassword: "",
      confirmPassword: "",
      files: [],
    },
  })

  const control = form.control as any

  const onSubmit = async (values: zod.infer<typeof formSchema>) => {
    setIsLoading(true)
    let avatar = ""

    try {
      const newPassword = values.newPassword
      const confirmPassword = values.confirmPassword

      if (newPassword || confirmPassword) {
        if (newPassword !== confirmPassword) {
          toast({
            title: "Error",
            description: "Passwords do not match.",
            variant: "destructive",
          })
          return
        }
        if (newPassword && !passwordRegex.test(newPassword)) {
          toast({
            title: "Error",
            description:
              "Password must be at least 8 characters long, include one uppercase letter, one number, and one special character.",
            variant: "destructive",
          })
          return
        }
      }

      if (values.files.length > 0) {
        const file = values.files[0]

        setIsUploading(true)
        const result = await uploadFile(file).catch((error) => {
          console.error("Error during file upload:", error)
          throw new Error(`Upload failed: ${error.message || "Unknown error"}`)
        })
        setIsUploading(false)

        if (!result) {
          throw new Error("File upload failed - no result returned")
        }

        avatar = result.url
      }

      const payload: Record<string, unknown> = {
        name: values.name ?? "",
        email: values.email ?? "",
        district: values.district ?? "",
        about: values.about ?? "",
        phoneNumber: values.phoneNumber ?? "",
        avatar,
      }

      if (newPassword) {
        payload.password = newPassword
      }

      const result = await updateUser(payload, session?.id || "", fullPath)

      if (!result.success) {
        toast({
          title: "Error",
          description: result.error || "An error occurred while updating.",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Success",
        description: `${values.name} has been updated successfully.`,
      })
      refetch()
      onClose()
      const role = (session?.role as string) || "FARMER"
      router.push(profileRedirect[role] || "/farmer/profile")
      router.refresh()
    } catch (error) {
      console.error("Error updating user:", error)
      toast({
        title: "Error",
        description: "An error occurred while updating the user.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsUploading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} name={`Edit Profile`}>
      <Form {...form}>
        <form
          className="flex flex-col gap-5 w-full"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            name="name"
            label="Full name"
            control={control}
            placeholder="John Doe"
          />

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            name="email"
            label="Email"
            control={control}
            placeholder="johndoe@gmail.com"
          />

          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            name="phoneNumber"
            label="Phone Number"
            control={control}
            placeholder="Enter phone number"
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            name="district"
            label="District"
            control={control}
            placeholder="Enter your district"
          />
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            name="about"
            label="About"
            control={control}
            placeholder="Write something about yourself..."
          />

          <div className="border-t pt-4">
            <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-200">
              Change Password
            </p>
            <div className="flex flex-col gap-5">
              <CustomFormField
                fieldType={FormFieldType.PASSWORD}
                name="newPassword"
                label="New password"
                control={control}
                placeholder="Leave blank to keep current password"
              />
              <CustomFormField
                fieldType={FormFieldType.PASSWORD}
                name="confirmPassword"
                label="Confirm new password"
                control={control}
                placeholder="Re-enter new password"
              />
            </div>
          </div>

          <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={control}
            name="files"
            label="Profile image"
            renderSkeleton={(field) => (
              <FormControl>
                <FileUploader
                  files={field.value}
                  onChange={field.onChange}
                  uploadProgress={uploadProgress}
                  uploadStatus={uploadStatus}
                  isUploading={isUploading}
                  allowedTypes={["image/jpeg", "image/png", "image/jpg"]}
                  maxSizeMB={5}
                />
              </FormControl>
            )}
          />

          <SubmitButton
            disabled={isLoading || isUploading}
            isLoading={isLoading}
            className="w-full  h-9"
            loadingText="Updating..."
          >
            Update
          </SubmitButton>
        </form>
      </Form>
    </Modal>
  )
}

export default ModalEditProfile

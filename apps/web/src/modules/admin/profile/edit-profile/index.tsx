"use client"
import { Form, FormControl } from "@/components/ui/form"
import useCustomPath from "@/hooks/use-custom-path"
import { toast } from "@/hooks/use-toast"
import { UserProps } from "@/lib/api"
import { useFileUpload } from "@/hooks/use-file-upload"
import { getFileType } from "@/lib/utils"
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
  refetch: () => void // Accept refetch function as prop
}

const ModalEditProfile = ({ isOpen, onClose, refetch }: Props) => {
  const { data: session } = useSession() // Get session data

  const path = usePathname()
  const { fullPath, pathWithoutAdmin } = useCustomPath(path)
  useState<UserProps | null>(null) // State to hold user details
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  
  // Initialize the file upload hook
  const {
    uploadFile,
    status: uploadStatus,
    progress: uploadProgress,
    result: uploadResult,
    error: uploadError,
  } = useFileUpload({
    path: "profile",
  })
  const router = useRouter()
  const phoneNumberRegex = /^\+?[1-9]\d{1,14}$/

  const formSchema = zod.object({
    name: zod
      .string()

      .optional(),
    district: zod
      .string()

      .optional(),

    about: zod
      .string()

      .optional(),
    email: zod
      .string()
      //   .email('Invalid email address.')
      .optional(),

    phoneNumber: zod
      .string()
      //   .regex(phoneNumberRegex, {
      //     message:
      //       'Phone number must be in a valid international format.',
      //   })
      .optional(),
    files: zod.custom<File[]>(),
  })

  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      district: "",
      about: "",
      files: [],
    },
  })

  const onSubmit = async (values: zod.infer<typeof formSchema>) => {
    setIsLoading(true)
    try {
      let avatar = ""
      let size = undefined

      if (values.files.length > 0) {
        const file = values.files[0]
        
        // Set uploading state to true to show progress bar
        setIsUploading(true)
        
        // Upload file to Supabase Storage
        console.log("Uploading profile image:", file.name)
        const result = await uploadFile(file).catch((error) => {
          console.error("Error during file upload:", error)
          throw new Error(`Upload failed: ${error.message || "Unknown error"}`)
        })
        
        // Set uploading state to false after upload completes
        setIsUploading(false)
        
        if (!result) {
          throw new Error("File upload failed - no result returned")
        }
        
        avatar = result.url
      }

      const payload = {
        name: values.name ?? "",
        email: values.email ?? "",
        district: values.district ?? "",
        about: values.about ?? "",
        phoneNumber: values.phoneNumber ?? "",
        avatar,
      }
      await updateUser(
        payload,
        session?.id || "", // Pass the session user ID
        fullPath
      )

      toast({
        title: "Success",
        description: `${values.name} has been updated successfully.`,
      })
      refetch()
      onClose()
      router.push("/admin/profile")
    } catch (error) {
      console.error("Error updating user:", error)
      toast({
        title: "Error",
        description: "An error occurred while updating the user.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
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
            fieldType={FormFieldType.PHONE_INPUT}
            name="phoneNumber"
            label="Phone Number"
            control={form.control}
            placeholder="Enter phone number"
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            name="district"
            label="District"
            control={form.control}
            placeholder="Enter your district"
          />
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            name="about"
            label="About"
            control={form.control}
            placeholder="Write something about yourself..."
          />

          <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
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
            disabled={isLoading || !form.formState.isValid}
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

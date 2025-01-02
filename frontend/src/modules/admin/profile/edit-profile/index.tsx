'use client';
import {
  Form,
  FormControl,
} from '@/components/ui/form';
import useCustomPath from '@/hooks/use-custom-path';
import { toast } from '@/hooks/use-toast';
import { UserProps } from '@/lib/api';
import { handleFileUpload } from '@/lib/utils';
import CustomFormField, {
  FormFieldType,
} from '@/modules/common/custom-form-field';
import { FileUploader } from '@/modules/common/file-uploader';
import SubmitButton from '@/modules/common/submit-button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as zod from 'zod';
import { updateUser } from '../../actions';
import Modal from '../../modal';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  //   shop: ShopProps;
};

const ModalEditProfile = ({
  isOpen,
  onClose,
}: Props) => {
  const { data: session } = useSession(); // Get session data

  const path = usePathname();
  const { fullPath, pathWithoutAdmin } =
    useCustomPath(path);
  useState<UserProps | null>(null); // State to hold user details
  const [isLoading, setIsLoading] =
    useState(false);

  const phoneNumberRegex = /^\+?[1-9]\d{1,14}$/;

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
  });

  const form = useForm<
    zod.infer<typeof formSchema>
  >({
    resolver: zodResolver(formSchema),
    mode: 'onTouched',
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      district: '',
      about: '',
      files: [],
    },
  });

  const onSubmit = async (
    values: zod.infer<typeof formSchema>
  ) => {
    setIsLoading(true);
    console.log({ values });
    try {
      let avatar = '';
      let size = undefined;

      if (values.files.length > 0) {
        const file = values.files[0];
        avatar = await handleFileUpload(file);
      }

      const payload = {
        name: values.name ?? '',
        email: values.email ?? '',
        district: values.district ?? '',
        about: values.about ?? '',
        phoneNumber: values.phoneNumber ?? '',
        avatar,
      };
      await updateUser(
        session?.id || '', // Pass the session user ID
        payload,
        fullPath,
        pathWithoutAdmin
      );

      // Update the form's default values after successful update
      form.reset({
        name: values.name || '',
        email: values.email || '',
        phoneNumber: values.phoneNumber || '',
      });

      toast({
        title: 'Success',
        description: `${values.name} has been updated successfully.`,
      });
      onClose();
    } catch (error) {
      console.error(
        'Error updating user:',
        error
      );
      toast({
        title: 'Error',
        description:
          'An error occurred while updating the user.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      name={`Edit Profile`}
    >
      {/* <div className='overflow-auto max-h-[70vh] p-4'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col gap-5 w-full'
          >
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              name='name'
              label='Full name'
              control={form.control}
              placeholder='John Doe'
            />

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              name='email'
              label='Email'
              control={form.control}
              placeholder='johndoe@gmail.com'
            />

            <CustomFormField
              fieldType={
                FormFieldType.PHONE_INPUT
              }
              name='phoneNumber'
              label='Phone Number'
              control={form.control}
              placeholder='Enter phone number'
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              name='district'
              label='District'
              control={form.control}
              placeholder='Enter your district'
            />
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              name='about'
              label='About'
              control={form.control}
              placeholder='Write something about yourself...'
            />
            <CustomFormField
              fieldType={FormFieldType.SKELETON}
              control={form.control}
              name='files'
              label='Profile image'
              renderSkeleton={(field) => (
                <FormControl>
                  <FileUploader
                    files={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
              )}
            />

            <SubmitButton
              disabled={
                isLoading ||
                !form.formState.isValid
              }
              isLoading={isLoading}
              loadingText='Updating...'
              className='w-full h-9'
            >
              Update
            </SubmitButton>
          </form>
        </Form>
      </div> */}

      <Form {...form}>
        <form
          className='flex flex-col gap-5 w-full'
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            name='name'
            label='Full name'
            control={form.control}
            placeholder='John Doe'
          />

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            name='email'
            label='Email'
            control={form.control}
            placeholder='johndoe@gmail.com'
          />

          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            name='phoneNumber'
            label='Phone Number'
            control={form.control}
            placeholder='Enter phone number'
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            name='district'
            label='District'
            control={form.control}
            placeholder='Enter your district'
          />
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            name='about'
            label='About'
            control={form.control}
            placeholder='Write something about yourself...'
          />

          <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name='files'
            label='Profile image'
            renderSkeleton={(field) => (
              <FormControl>
                <FileUploader
                  files={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
            )}
          />

          <SubmitButton
            disabled={
              isLoading || !form.formState.isValid
            }
            isLoading={isLoading}
            className='w-full  h-9'
            loadingText='Updating...'
          >
            Update
          </SubmitButton>
        </form>
      </Form>
    </Modal>
  );
};

export default ModalEditProfile;

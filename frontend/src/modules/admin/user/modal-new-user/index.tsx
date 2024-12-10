'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SelectItem } from '@/components/ui/select';
import useCustomPath from '@/hooks/use-custom-path';
import { toast } from '@/hooks/use-toast';
import { Role } from '@/lib/api';
import CustomFormField, {
  FormFieldType,
} from '@/modules/common/custom-form-field';
import SubmitButton from '@/modules/common/submit-button';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as zod from 'zod';
import Modal from '../../modal';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  id?: string | null;
};

const ModalNewUser = ({
  isOpen,
  onClose,
}: Props) => {
  const [isLoading, setIsLoading] =
    useState(false);
  const path = usePathname();
  const { fullPath, pathWithoutAdmin } =
    useCustomPath(path);
  const roleOptions = Object.values(Role); // Get the values of the Role enum
  const [showPassword, setShowPassword] =
    useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const formSchema = zod.object({
    firstName: zod.string().min(2, {
      message:
        'First name must be at least 2 characters.',
    }),
    lastName: zod.string().min(2, {
      message:
        'Last name must be at least 2 characters.',
    }),
    email: zod.string().min(2, {
      message:
        'Email must be at least 2 characters.',
    }),
    password: zod.string().min(2, {
      message:
        'Password must be at least 2 characters.',
    }),
    phoneNumber: zod.string().min(2, {
      message:
        'PhoneNumber must be at least 2 characters.',
    }),
    role: zod.string().min(2, {
      message:
        'Role must be at least 2 characters.',
    }),
  });

  const form = useForm<
    zod.infer<typeof formSchema>
  >({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phoneNumber: '',
    },
  });
  const onSubmit = async (
    values: zod.infer<typeof formSchema>
  ) => {
    setIsLoading(true);
    console.log({ values });
    try {
      // const result = await createUser(
      //   formData,
      //   fullPath,
      //   pathWithoutAdmin
      // );

      // console.log('Upload result:', result);
      onClose();
      toast({
        title: 'Success',
        description:
          'New form or document has been created successfully',
      });
      // Handle the result, such as showing success or error messages
    } catch (error) {
      toast({
        title: 'Error',
        description:
          'An unexpected error has occurred',
        variant: 'destructive',
      });
      console.log('Upload error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      name='Add New User'
    >
      <Form {...form}>
        <form
          className='flex flex-col gap-5 w-full'
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            name='firstName'
            label='First name'
            control={form.control}
            placeholder='John'
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            name='lastName'
            label='Last name'
            control={form.control}
            placeholder='Doe'
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            name='email'
            label='Email'
            control={form.control}
            placeholder='johndoe@gmail.com'
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className='relative'>
                    <Input
                      placeholder='Chad784238@'
                      type={
                        showPassword
                          ? 'text'
                          : 'password'
                      }
                      {...field}
                      className='form_input'
                    />
                    <Button
                      size='icon'
                      variant='ghost'
                      onClick={(e) => {
                        e.preventDefault();
                        toggleShowPassword();
                      }}
                      className='absolute inset-y-0 right-0 px-3 py-2 text-sm font-medium text-gray-500'
                    >
                      {showPassword ? (
                        <EyeOff />
                      ) : (
                        <Eye />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            name='role'
            label='Role'
            control={form.control}
            placeholder='Select a role'
          >
            {roleOptions.map((role) => (
              <SelectItem key={role} value={role}>
                <div className='flex cursor-pointer items-center gap-2'>
                  <p>{role}</p>
                </div>
              </SelectItem>
            ))}
          </CustomFormField>
          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            name='phoneNumber'
            label='Phone number'
            control={form.control}
            placeholder='Enter phone number'
          />

          <SubmitButton
            disabled={
              isLoading || !form.formState.isValid
            }
            isLoading={isLoading}
            className='w-full  h-9'
            loadingText='Saving...'
          >
            Save
          </SubmitButton>
        </form>
      </Form>
    </Modal>
  );
};

export default ModalNewUser;

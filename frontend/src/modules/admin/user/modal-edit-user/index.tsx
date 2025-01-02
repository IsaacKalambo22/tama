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
import { Role, UserProps } from '@/lib/api';
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
import { updateUser } from '../../actions';
import Modal from '../../modal';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  user: UserProps;
};

const ModalEditUser = ({
  isOpen,
  onClose,
  user,
}: Props) => {
  const [isLoading, setIsLoading] =
    useState(false);
  const [showPassword, setShowPassword] =
    useState(false);

  const path = usePathname();
  const { fullPath, pathWithoutAdmin } =
    useCustomPath(path);

  const roleOptions = Object.values(Role);

  const toggleShowPassword = () =>
    setShowPassword(!showPassword);

  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const phoneNumberRegex = /^\+?[1-9]\d{1,14}$/;

  const formSchema = zod.object({
    name: zod
      .string()
      .min(
        2,
        'Name must be at least 2 characters.'
      )
      .optional(),
    email: zod
      .string()
      .email('Invalid email address.')
      .optional(),
    password: zod
      .string()
      .regex(passwordRegex, {
        message:
          'Password must be at least 8 characters long, include one uppercase letter, one number, and one special character.',
      })
      .optional(),
    phoneNumber: zod
      .string()
      .regex(phoneNumberRegex, {
        message:
          'Phone number must be in a valid international format.',
      })
      .optional(),
    role: zod
      .nativeEnum(Role, {
        errorMap: () => ({
          message: 'Invalid role.',
        }),
      })
      .optional(),
  });

  const form = useForm<
    zod.infer<typeof formSchema>
  >({
    resolver: zodResolver(formSchema),
    mode: 'onTouched',
    defaultValues: {
      name: user.name || '',
      email: user.email || '',
      password: '',
      phoneNumber: user.phoneNumber || '',
      role: user.role,
    },
  });

  const onSubmit = async (
    values: zod.infer<typeof formSchema>
  ) => {
    setIsLoading(true);
    const payload = {
      name: values.name || undefined,
      email: values.email || undefined,
      password: values.password || undefined,
      phoneNumber:
        values.phoneNumber || undefined,
      role: values.role || undefined,
    };
    try {
      // Send the values directly as a JSON object
      await updateUser(
        payload,
        user.id, // Assuming `user.id` is the unique identifier for the user
        fullPath
      );

      toast({
        title: 'Success',
        description: `${user.name} has been updated successfully.`,
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
      name={`Edit ${user.name}`}
    >
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
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className='relative'>
                    <Input
                      placeholder='Password'
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
                {role}
              </SelectItem>
            ))}
          </CustomFormField>
          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            name='phoneNumber'
            label='Phone Number'
            control={form.control}
            placeholder='Enter phone number'
          />
          <SubmitButton
            disabled={
              isLoading || !form.formState.isValid
            }
            isLoading={isLoading}
            loadingText='Updating...'
            className='w-full h-9'
          >
            Update
          </SubmitButton>
        </form>
      </Form>
    </Modal>
  );
};

export default ModalEditUser;

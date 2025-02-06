'use client';

import { Form } from '@/components/ui/form';
import { SelectItem } from '@/components/ui/select';
import useCustomPath from '@/hooks/use-custom-path';
import { Role, UserProps } from '@/lib/api';
import CustomFormField, {
  FormFieldType,
} from '@/modules/common/custom-form-field';
import SubmitButton from '@/modules/common/submit-button';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
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

  const path = usePathname();
  const { fullPath } = useCustomPath(path);

  const roleOptions = Object.values(Role);

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
      phoneNumber:
        values.phoneNumber || undefined,
      role: values.role || undefined,
    };
    const result = await updateUser(
      payload,
      user.id,
      fullPath
    );

    onClose();
    if (result.success) {
      toast.success('User updated successfully');
    } else {
      toast.error(
        result.error ?? 'An error occurred.'
      );
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

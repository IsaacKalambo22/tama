'use client';

import { Form } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import CustomFormField, {
  FormFieldType,
} from '@/modules/common/custom-form-field';
import RedirectionLoader from '@/modules/common/redirection-loader';
import SubmitButton from '@/modules/common/submit-button';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as zod from 'zod';
import { resetPassword } from '../actions';
import { ResetPasswordSchema } from '../login-schema';

const ResetPassword = () => {
  const [isLoading, setIsLoading] =
    useState(false);
  const [isRedirecting, setIsRedirecting] =
    useState(false);
  const router = useRouter();

  const form = useForm<
    zod.infer<typeof ResetPasswordSchema>
  >({
    resolver: zodResolver(ResetPasswordSchema),
    mode: 'all',
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (
    values: zod.infer<typeof ResetPasswordSchema>
  ) => {
    setIsLoading(true);

    try {
      const result = await resetPassword(
        values.email
      );

      if (result.status === 'ERROR') {
        toast({
          title: 'Failed to reset password',
          description: result.error,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Success',
        description:
          'Password reset successfully.',
      });

      setIsRedirecting(true);
      router.refresh();
      // setTimeout(() => {
      // }, 2000); // Adjust the delay as needed
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: 'Unexpected Error',
        description:
          'An unexpected error occurred. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isRedirecting) {
    return <RedirectionLoader />;
  }

  return (
    <div className='flex flex-col justify-center items-center'>
      <main className='min-h-screen px-4 w-[330px] flex flex-col justify-center items-center'>
        <div className='max-w-[600px] w-full flex flex-col justify-center items-center rounded-lg'>
          <div className='flex flex-col justify-center items-center'>
            <Link href='/'>
              <div className='flex items-center justify-center w-16 h-16'>
                <Image
                  src='/assets/images/logo.png'
                  alt='Logo'
                  width={64}
                  height={64}
                  priority
                />
              </div>
            </Link>
            <h2 className='font-bold text-2xl mt-3 text-gray-900 mb-2'>
              Reset Your Password
            </h2>
            <p className='text-gray-600 text-muted-foreground text-sm'>
              Reset your password to get started
            </p>
          </div>
          <div className='gap-2 pt-6 w-full flex flex-col justify-center items-center rounded-bl-lg rounded-br-lg'>
            <Form {...form}>
              <form
                className='flex flex-col gap-5 w-full max-w-[400px]'
                onSubmit={form.handleSubmit(
                  onSubmit
                )}
              >
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  name='email'
                  // label='Email'
                  control={form.control}
                  placeholder='Enter email'
                />
                <SubmitButton
                  disabled={
                    isLoading ||
                    !form.formState.isValid
                  }
                  isLoading={isLoading}
                  className='w-full h-9'
                  loadingText='Resetting password...'
                >
                  Reset Password
                </SubmitButton>
              </form>
            </Form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResetPassword;

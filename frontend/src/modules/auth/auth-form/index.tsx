'use client';

import { Form } from '@/components/ui/form';
import CustomFormField, {
  FormFieldType,
} from '@/modules/common/custom-form-field';
import SubmitButton from '@/modules/common/submit-button';
import { zodResolver } from '@hookform/resolvers/zod';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
  UseFormReturn,
} from 'react-hook-form';
import { toast } from 'sonner';
import { ZodType } from 'zod';
import { FIELD_NAMES } from '../constants';

export enum FormType {
  SIGN_IN = 'SIGN_IN',
  SET_PASSWORD = 'SET_PASSWORD',
  RESET_PASSWORD = 'RESET_PASSWORD',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
}

interface AuthFormProps<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  fieldTypes?: Record<string, FormFieldType>;
  onSubmit: (
    data: T & { verificationToken?: string }
  ) => Promise<{
    success: boolean;
    error?: string;
  }>;
  type: FormType;
  verificationToken?: string;
}

const AuthForm = <T extends FieldValues>({
  type,
  schema,
  defaultValues,
  fieldTypes = {},
  onSubmit,
  verificationToken,
}: AuthFormProps<T>) => {
  const router = useRouter();
  const [isLoading, setIsLoading] =
    useState(false);
  const [isRedirecting, setIsRedirecting] =
    useState(false);

  const isSignIn = type === FormType.SIGN_IN;
  const isSetPassword =
    type === FormType.SET_PASSWORD;
  const isResetPassword =
    type === FormType.RESET_PASSWORD;
  const isForgotPassword =
    type === FormType.FORGOT_PASSWORD;

  const form: UseFormReturn<T> = useForm({
    resolver: zodResolver(schema),
    mode: 'all',
    defaultValues:
      defaultValues as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<T> = async (
    data
  ) => {
    setIsLoading(true);

    const result = await onSubmit({
      ...data,
      ...((isSetPassword || isResetPassword) &&
      verificationToken
        ? { verificationToken }
        : {}), // Include verificationToken if it's SET_PASSWORD
    });

    console.log({ result });

    if (result.success) {
      toast.success(
        isSignIn
          ? 'Signed in successfully'
          : isResetPassword
          ? 'Password has been reset successfully'
          : isForgotPassword
          ? 'Verification details sent to your email.'
          : 'Password has been set successfully.'
      );
      await getSession();

      router.push('/');
      setIsRedirecting(true);
    } else {
      toast.error(
        result.error ?? 'An error occurred.'
      );
    }

    setIsLoading(false);
  };

  return (
    <div className='w-full flex flex-col gap-2 mt-2'>
      <h1 className='text-2xl text-center font-semibold'>
        {isSignIn
          ? 'Welcome back'
          : isSetPassword
          ? 'Set Your Password'
          : isResetPassword
          ? 'Reset Your Password'
          : 'Forgot Your Password'}
      </h1>

      {isForgotPassword && (
        <p className='text-center text-muted-foreground text-sm'>
          Enter your email address and we&apos;ll
          send you a link to reset your password
        </p>
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(
            handleSubmit
          )}
          className='w-full min-w-full flex flex-col gap-2'
        >
          {Object.entries(defaultValues).map(
            ([field]) => (
              <CustomFormField
                key={field}
                fieldType={
                  fieldTypes[field] ||
                  FormFieldType.INPUT
                }
                name={field as Path<T>}
                label={
                  FIELD_NAMES[
                    field as keyof typeof FIELD_NAMES
                  ]
                }
                control={form.control}
              />
            )
          )}
          {isSignIn && (
            <Link
              className='mt-1'
              href='/forgot-password'
            >
              <p className='text-gray-600 hover:text-primary text-sm font-semibold transition duration-200'>
                Forgot password?
              </p>
            </Link>
          )}
          <SubmitButton
            disabled={
              isLoading ||
              isRedirecting ||
              !form.formState.isValid
            }
            isLoading={isLoading || isRedirecting}
            className='w-full h-9 mt-4'
            loadingText={
              isSignIn
                ? 'Signing in...'
                : isResetPassword
                ? 'Resetting...'
                : isForgotPassword
                ? 'Sending reset link...'
                : isRedirecting
                ? 'Redirecting...'
                : 'Setting password...'
            }
          >
            {isSignIn
              ? 'Sign In'
              : isResetPassword
              ? 'Reset Password'
              : isForgotPassword
              ? 'Reset Reset Link'
              : 'Set Password'}
          </SubmitButton>
        </form>
      </Form>
    </div>
  );
};

export default AuthForm;

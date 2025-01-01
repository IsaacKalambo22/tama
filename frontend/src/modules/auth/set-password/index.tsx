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
import { toast } from '@/hooks/use-toast';
import RedirectionLoader from '@/modules/common/redirection-loader';
import SubmitButton from '@/modules/common/submit-button';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as zod from 'zod';
import { setPassword } from '../actions';
import { SetPasswordSchema } from '../login-schema';

const SetPassword = ({
  verificationToken,
}: {
  verificationToken: string;
}) => {
  const [showPassword, setShowPassword] =
    useState(false);
  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);
  const [isLoading, setIsLoading] =
    useState(false);
  const [isRedirecting, setIsRedirecting] =
    useState(false);
  const router = useRouter();

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const form = useForm<
    zod.infer<typeof SetPasswordSchema>
  >({
    resolver: zodResolver(SetPasswordSchema),
    mode: 'all',
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (
    values: zod.infer<typeof SetPasswordSchema>
  ) => {
    setIsLoading(true);

    try {
      const result = await setPassword(
        verificationToken,
        values.password
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
                />
              </div>
            </Link>
            <h2 className='font-bold text-2xl mt-3 text-gray-900 mb-2'>
              Welcome to TAMA
            </h2>
            <p className='text-gray-600 text-muted-foreground text-sm'>
              Set your password to get started
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
                            className='form_input shad-input'
                          />
                          <Button
                            size='icon'
                            variant='ghost'
                            onClick={(e) => {
                              e.preventDefault();
                              toggleShowPassword();
                            }}
                            className='absolute inset-y-0 right-0 px-3 py-2 text-sm font-medium hover:bg-inherit text-gray-500'
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
                <FormField
                  control={form.control}
                  name='confirmPassword'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className='relative'>
                          <Input
                            placeholder='Confirm Password'
                            type={
                              showConfirmPassword
                                ? 'text'
                                : 'password'
                            }
                            {...field}
                            className='form_input shad-input'
                          />
                          <Button
                            size='icon'
                            variant='ghost'
                            onClick={(e) => {
                              e.preventDefault();
                              toggleShowConfirmPassword();
                            }}
                            className='absolute inset-y-0 right-0 px-3 py-2 text-sm font-medium hover:bg-inherit text-gray-500'
                          >
                            {showConfirmPassword ? (
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
                <SubmitButton
                  disabled={
                    isLoading ||
                    !form.formState.isValid
                  }
                  isLoading={isLoading}
                  className='w-full h-9'
                  loadingText='Setting Password...'
                >
                  Set Password
                </SubmitButton>
              </form>
            </Form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SetPassword;

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
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { toast } from '@/hooks/use-toast';
import SubmitButton from '@/modules/common/submit-button';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as zod from 'zod';
import { login } from '../actions';
import { LoginSchema } from '../login-schema';

export type FormState = {
  error: string;
  status: 'INITIAL' | 'SUCCESS' | 'ERROR';
};

const Login = () => {
  const [showPassword, setShowPassword] =
    useState(false);
  const router = useRouter();
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const [isLoading, setIsLoading] =
    useState(false);

  const form = useForm<
    zod.infer<typeof LoginSchema>
  >({
    resolver: zodResolver(LoginSchema),
    mode: 'all',
    defaultValues: { email: '', password: '' },
  });
  const onSubmit = async (
    values: zod.infer<typeof LoginSchema>
  ) => {
    setIsLoading(true);

    try {
      console.log({ values });

      const result = await login(values);

      if (result.status === 'ERROR') {
        toast({
          title: 'Failed to log in',
          description:
            result.error ||
            'Failed to log in. Please try again.',
          variant: 'destructive',
        });

        return;
      }

      router.push('/');
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

  return (
    <>
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
            <h2 className='font-bold text-xl my-3 text-gray-900 text-left'>
              Sign in to TAMA
            </h2>
          </div>
          <div className='gap-2 pt-6 w-full flex flex-col justify-center items-center  rounded-bl-lg rounded-br-lg'>
            <Form {...form}>
              <form
                className='flex flex-col gap-5 w-full max-w-[400px]'
                onSubmit={form.handleSubmit(
                  onSubmit
                )}
              >
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className='form_input'
                          placeholder='Email'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
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

                <SubmitButton
                  disabled={
                    isLoading ||
                    !form.formState.isValid
                  }
                  isLoading={isLoading}
                  className='w-full  h-9'
                  loadingText='Signing in...'
                >
                  Sign in
                </SubmitButton>
              </form>
            </Form>
          </div>
        </div>
      </main>
    </>
  );
};

export default Login;

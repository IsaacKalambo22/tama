'use server';

import { signIn } from '@/auth';
import * as zod from 'zod';
import { LoginSchema } from '../login-schema';

export const login = async (
  values: zod.infer<typeof LoginSchema>
) => {
  const { email, password } = values;

  try {
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    console.log('Sign-in Result:', result);

    return {
      status: 'SUCCESS',
      user: result.user,
    };
  } catch (error) {
    console.error('Error during login:', error);
    return {
      status: 'ERROR',
      error: 'Email or password is incorrect.',
    };
  }
};

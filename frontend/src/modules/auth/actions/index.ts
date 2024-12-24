'use server';

import { signIn } from '@/auth';
import { BASE_URL } from '@/lib/utils';
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

export const resetPassword = async (
  verificationToken: string,
  password: string
) => {
  try {
    // Prepare the payload
    const payload = {
      verificationToken, // Use the id as the verification token
      password, // Send the password
    };
    console.log({ payload });

    // Replace with your actual API endpoint
    const response = await fetch(
      `${BASE_URL}/auth/set-password`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.error || 'Failed to reset password'
      );
    }

    console.log(
      'Password Reset Successful:',
      result
    );

    return {
      status: 'SUCCESS',
      message: 'Password reset successfully.',
    };
  } catch (error) {
    console.error(
      'Error during password reset:',
      error
    );

    return {
      status: 'ERROR',
      error:
        'Failed to reset password. Please try again later.',
    };
  }
};

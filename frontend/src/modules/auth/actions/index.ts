'use server';

import { signIn } from '@/auth';
import { BASE_URL } from '@/lib/utils';

export const login = async (
  email: string,
  password: string
) => {
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

export const setPassword = async (
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
        result.error || 'Failed to set password'
      );
    }

    console.log(
      'Password Set Successful:',
      result
    );

    const email = result.email;
    await login(email, password);
    return {
      status: 'SUCCESS',
      message: 'Password set successfully.',
    };
  } catch (error) {
    console.error(
      'Error during password set:',
      error
    );

    return {
      status: 'ERROR',
      error:
        'Failed to set password. Please try again later.',
    };
  }
};
export const resetPassword = async (
  email: string
) => {
  try {
    // Prepare the payload
    const payload = {
      email,
    };
    console.log({ payload });

    // Replace with your actual API endpoint
    const response = await fetch(
      `${BASE_URL}/auth/reset-password`,
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

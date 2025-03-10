import { z } from 'zod';

export const passwordRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const signUpSchema = z.object({
  fullName: z.string().min(2, {
    message:
      'Full name must be at least 2 characters.',
  }),

  email: z.string().email({
    message: 'Invalid email address.',
  }),
});

export const signInSchema = z.object({
  email: z
    .string()
    .min(4, {
      message: 'Email is required',
    })
    .email({
      message: 'Provide a valid email address',
    }),
  password: z
    .string({
      message: 'Password is required',
    })
    .min(4, {
      message: 'Password is required',
    }),
});

export const setPasswordSchema = z
  .object({
    password: z.string().regex(passwordRegex, {
      message:
        'Password must be at least 8 characters long, include one uppercase letter, one number, and one special character.',
    }),
    confirmPassword: z.string({
      required_error:
        'Confirm Password is required',
    }),
  })
  .refine(
    (data) =>
      data.password === data.confirmPassword,
    {
      message: 'Passwords must match',
      path: ['confirmPassword'], // This points the error to the confirmPassword field
    }
  );

export const resetPasswordSchema = z
  .object({
    password: z.string().regex(passwordRegex, {
      message:
        'Password must be at least 8 characters long, include one uppercase letter, one number, and one special character.',
    }),
    confirmPassword: z.string({
      required_error:
        'Confirm Password is required',
    }),
  })
  .refine(
    (data) =>
      data.password === data.confirmPassword,
    {
      message: 'Passwords must match',
      path: ['confirmPassword'], // This points the error to the confirmPassword field
    }
  );

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email({ message: 'Email is required' }),
});

import * as zod from 'zod';

export const passwordRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const LoginSchema = zod.object({
  email: zod
    .string()
    .min(4, {
      message: 'Email is required',
    })
    .email({
      message: 'Provide a valid email address',
    }),
  password: zod
    .string({
      message: 'Password is required',
    })
    .min(4, {
      message: 'Password is required',
    }),
});

export const SetPasswordSchema = zod
  .object({
    password: zod.string().regex(passwordRegex, {
      message:
        'Password must be at least 8 characters long, include one uppercase letter, one number, and one special character.',
    }),
    confirmPassword: zod.string({
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
export const ForgotPasswordSchema = zod.object({
  email: zod
    .string()
    .email({ message: 'Email is required' }),
});

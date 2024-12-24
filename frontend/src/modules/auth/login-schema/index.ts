import * as zod from 'zod';

export const LoginSchema = zod.object({
  email: zod
    .string()
    .email({ message: 'Email is required' }),
  password: zod
    .string({
      message: 'Email is required',
    })
    .min(4, {
      message: 'Email is required',
    }),
});
export const SetPasswordSchema = zod
  .object({
    password: zod
      .string({
        required_error: 'Password is required',
      })
      .min(8, {
        message:
          'Password must be at least 8 characters long',
      })
      .regex(/[A-Z]/, {
        message:
          'Password must include at least one uppercase letter',
      })
      .regex(/[\W_]/, {
        message:
          'Password must include at least one special character',
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

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

export const RegisterSchema = zod.object({
  fullName: zod.string({
    message: 'Full name is required',
  }),
  email: zod
    .string()
    .email({ message: 'Email is required' }),
  password: zod
    .string()
    .min(8, {
      message:
        'Password must have at least 8 characters',
    })
    .regex(/[a-zA-Z]/, {
      message:
        'Password must have at least one letter.',
    })
    .regex(/[0-9]/, {
      message:
        'Password must have at least one number.',
    })
    .regex(/[^a-zA-Z0-9]/, {
      message:
        'Password must have at least one special character.',
    })
    .trim(),
});

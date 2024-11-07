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

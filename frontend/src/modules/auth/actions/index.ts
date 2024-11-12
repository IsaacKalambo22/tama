'use server';

import { parseServerActionResponse } from '@/lib/utils';
import * as zod from 'zod';
import { LoginSchema } from '../login-schema';

export const login = async (
  values: zod.infer<typeof LoginSchema>
) => {
  const { email, password } = values;

  try {
    const credentials = {
      email,
      password,
    };

    return parseServerActionResponse({
      ...credentials,
      error: '',
      status: 'SUCCESS',
    });
  } catch (error) {
    console.log(error);

    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: 'ERROR',
    });
  }
};

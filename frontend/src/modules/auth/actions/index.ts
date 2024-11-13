'use server';

import { parseServerActionResponse } from '@/lib/utils';
import { FormState } from '../login';

export const login = async (
  state: FormState,
  form: FormData
) => {
  const { email, password } = Object.fromEntries(
    Array.from(form)
  );

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

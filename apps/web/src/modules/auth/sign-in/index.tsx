'use client';

import { FormFieldType } from '@/modules/common/custom-form-field';
import { signInWithCredentials } from '../actions';
import AuthForm, { FormType } from '../auth-form';
import { signInSchema } from '../validation';

const SignIn = () => {
  return (
    <AuthForm
      type={FormType.SIGN_IN}
      schema={signInSchema}
      defaultValues={{
        email: '',
        password: '',
      }}
      fieldTypes={{
        email: FormFieldType.INPUT,
        password: FormFieldType.PASSWORD,
      }}
      onSubmit={signInWithCredentials}
    />
  );
};

export default SignIn;

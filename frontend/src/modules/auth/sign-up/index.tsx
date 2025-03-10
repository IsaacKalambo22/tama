'use client';

import { FormFieldType } from '@/modules/common/custom-form-field';
import { signUp } from '../actions';
import AuthForm, { FormType } from '../auth-form';
import { signUpSchema } from '../validation';

const SignUp = () => {
  return (
    <AuthForm
      type={FormType.SIGN_UP}
      schema={signUpSchema}
      defaultValues={{
        fullName: '',
        email: '',
      }}
      fieldTypes={{
        fullName: FormFieldType.INPUT,
        email: FormFieldType.INPUT,
      }}
      onSubmit={signUp}
    />
  );
};

export default SignUp;

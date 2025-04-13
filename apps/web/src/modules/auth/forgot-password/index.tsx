'use client';

import { FormFieldType } from '@/modules/common/custom-form-field';
import { forgotPassword } from '../actions';
import AuthForm, { FormType } from '../auth-form';
import { forgotPasswordSchema } from '../validation';

const ForgotPassword = () => {
  return (
    <AuthForm
      type={FormType.FORGOT_PASSWORD}
      schema={forgotPasswordSchema}
      defaultValues={{
        email: '',
      }}
      fieldTypes={{
        email: FormFieldType.INPUT,
      }}
      onSubmit={forgotPassword}
    />
  );
};

export default ForgotPassword;

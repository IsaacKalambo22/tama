'use client';

import { FormFieldType } from '@/modules/common/custom-form-field';
import { setPassword } from '../actions';
import AuthForm, { FormType } from '../auth-form';
import { setPasswordSchema } from '../validation';

const SetPassword = ({
  verificationToken,
}: {
  verificationToken: string;
}) => {
  return (
    <AuthForm
      type={FormType.SET_PASSWORD}
      schema={setPasswordSchema}
      defaultValues={{
        password: '',
        confirmPassword: '',
      }}
      fieldTypes={{
        password: FormFieldType.PASSWORD,
        confirmPassword: FormFieldType.PASSWORD,
      }}
      verificationToken={verificationToken}
      onSubmit={setPassword}
    />
  );
};

export default SetPassword;

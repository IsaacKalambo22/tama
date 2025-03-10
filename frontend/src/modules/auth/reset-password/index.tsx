'use client';

import { FormFieldType } from '@/modules/common/custom-form-field';
import { resetPassword } from '../actions';
import AuthForm, { FormType } from '../auth-form';
import { resetPasswordSchema } from '../validation';

const ResetPassword = ({
  verificationToken,
}: {
  verificationToken: string;
}) => {
  return (
    <AuthForm
      type={FormType.RESET_PASSWORD}
      schema={resetPasswordSchema}
      defaultValues={{
        password: '',
        confirmPassword: '',
      }}
      fieldTypes={{
        password: FormFieldType.PASSWORD,
        confirmPassword: FormFieldType.PASSWORD,
      }}
      verificationToken={verificationToken}
      onSubmit={resetPassword}
    />
  );
};

export default ResetPassword;

import ResetPassword from '@/modules/auth/reset-password';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Reset Password - TAMA Farmers Trust',
  description:
    'Access your account and manage your activities with TAMA Farmers Trust.',
};

const ResetPasswordPage = () => {
  return <ResetPassword />;
};

export default ResetPasswordPage;

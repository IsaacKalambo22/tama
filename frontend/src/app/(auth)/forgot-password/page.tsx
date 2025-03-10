import ForgotPassword from '@/modules/auth/forgot-password';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Forgot Password - Pacific Diagnostics',
  description:
    'Access your account and manage your activities with Pacific Diagnostics.',
};

const ForgotPasswordPage = () => {
  return <ForgotPassword />;
};

export default ForgotPasswordPage;

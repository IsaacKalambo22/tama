import ResetPassword from '@/modules/auth/reset-password';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reset Password - Pacific Diagnostics',
  description:
    'Access your account and manage your activities with Pacific Diagnostics.',
};

interface ResetPasswordProps {
  params: {
    id: string; // The blog ID will be passed as a string in the params
  };
}

const ResetPasswordPage = async ({
  params,
}: ResetPasswordProps) => {
  const id = (await params).id; // Extract the blog ID from the params
  return <ResetPassword verificationToken={id} />;
};

export default ResetPasswordPage;

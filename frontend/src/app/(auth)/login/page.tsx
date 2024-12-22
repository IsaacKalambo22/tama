import Login from '@/modules/auth/login';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - TAMA Farmers Trust',
  description:
    'Access your account and manage your activities with TAMA Farmers Trust.',
};

const LoginPage = () => {
  return <Login />;
};

export default LoginPage;

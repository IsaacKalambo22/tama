import SignIn from '@/modules/auth/sign-in';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | Pacific Diagnostics',
  description:
    'Access your Pacific Diagnostics account and connect with a global community of changemakers and innovators.',
  keywords: [
    'Pacific Diagnostics Login',
    'Sign In Pacific Diagnostics',
    'Social Impact Network',
    'Entrepreneurship Platform',
    'Leadership Community',
  ],
  openGraph: {
    title: 'Sign In | Pacific Diagnostics',
    description:
      'Log in to your Pacific Diagnostics account and continue your journey of impact and innovation.',
    url: 'https://identityimpacthub.com/signin',
    images: [
      {
        url: 'https://identityimpacthub.com/assets/images/signin-og.png',
        width: 1200,
        height: 630,
        alt: 'Sign In - Pacific Diagnostics',
      },
    ],
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const SignInPage = () => {
  return <SignIn />;
};

export default SignInPage;

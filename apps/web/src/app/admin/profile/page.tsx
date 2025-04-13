import Profile from '@/modules/admin/profile';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Profile - TAMA Farmers Trust',
  description:
    'Access your account and manage your activities with TAMA Farmers Trust.',
};

const ProfilePage = () => {
  return <Profile />;
};

export default ProfilePage;

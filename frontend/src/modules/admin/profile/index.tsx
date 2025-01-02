'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Edit } from 'lucide-react';
import { useRouter } from 'next/navigation';
import AboutMe from './about-me';
import AvatarCard from './avatar-card';
import PersonalDetails from './personal-details';

const Profile = () => {
  const router = useRouter();

  const handleEditProfile = () => {
    router.push('/admin/profile/user-profile');
  };

  return (
    <div className='flex flex-col'>
      <div className='mb-5 flex w-full items-center justify-between'>
        <h1 className='text-lg font-semibold dark:text-white'>
          Profile
        </h1>
        <Button onClick={handleEditProfile}>
          <Edit className='h-4 w-4' />
          Edit Profile
        </Button>
      </div>
      <Card className='flex flex-col lg:flex-row gap-8 shadow-none mt-4 p-8'>
        <div className='flex flex-col gap-4'>
          <AvatarCard
            name='Resten Madzalo'
            role='ADMIN'
            imageSrc='/assets/images/logo.png'
          />
        </div>
        <div className='flex flex-col gap-4 w-full'>
          <PersonalDetails />
          <AboutMe />
        </div>
      </Card>
    </div>
  );
};

export default Profile;

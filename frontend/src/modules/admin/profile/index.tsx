'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { UserProps } from '@/lib/api';
import { BASE_URL } from '@/lib/utils';
import { Edit } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AboutMe from './about-me';
import AvatarCard from './avatar-card';
import PersonalDetails from './personal-details';

const Profile = () => {
  const { data: session } = useSession(); // Get session data
  const router = useRouter();
  const [userDetails, setUserDetails] =
    useState<UserProps | null>(null); // State for user details
  const [loading, setLoading] = useState(true); // State for loading

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (session?.id && session?.accessToken) {
        try {
          const response = await fetch(
            `${BASE_URL}/users/${session.id}`,
            {
              headers: {
                Authorization: `Bearer ${session.accessToken}`, // Send bearer token
                'Content-Type':
                  'application/json',
              },
            }
          );

          if (!response.ok)
            throw new Error(
              'Failed to fetch user details'
            );
          const data = await response.json();
          setUserDetails(data.data);
        } catch (error) {
          console.error(
            'Error fetching user details:',
            error
          );
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false); // Stop loading if no session or access token
      }
    };

    fetchUserDetails();
  }, [session]);

  const handleEditProfile = () => {
    router.push('/admin/profile/user-profile');
  };

  if (loading) {
    return (
      <div className='text-center'>
        Loading...
      </div>
    );
  }

  if (!userDetails) {
    return (
      <div className='text-center'>
        Failed to load user details.
      </div>
    );
  }

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
            name={userDetails.name}
            role={userDetails.role}
            imageSrc={
              userDetails.avatar ||
              '/assets/images/default-avatar.png'
            }
          />
        </div>
        <div className='flex flex-col gap-4 w-full'>
          <PersonalDetails
            userDetails={{
              name: userDetails.name,
              phone: userDetails.phoneNumber,
              email: userDetails.email,
              district:
                userDetails.district ?? 'Not set',
            }}
          />

          <AboutMe about={userDetails.about} />
        </div>
      </Card>
    </div>
  );
};

export default Profile;

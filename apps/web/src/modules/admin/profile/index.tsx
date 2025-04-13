'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { UserProps } from '@/lib/api';
import { BASE_URL } from '@/lib/utils';
import CustomLoader from '@/modules/common/custom-loader';
import { Edit } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AboutMe from './about-me';
import AvatarCard from './avatar-card';
import ModalEditProfile from './edit-profile';
import PersonalDetails from './personal-details';

const Profile = () => {
  const { data: session } = useSession(); // Get session data
  const router = useRouter();
  const [userDetails, setUserDetails] =
    useState<UserProps | null>(null); // State for user details
  const [loading, setLoading] = useState(true); // State for loading
  const [isModalOpen, setIsModalOpen] =
    useState(false); // State for opening modal

  // Fetch user details function
  const fetchUserDetails = async () => {
    if (session?.id && session?.accessToken) {
      try {
        const response = await fetch(
          `${BASE_URL}/users/${session.id}`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
              'Content-Type': 'application/json',
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
      setLoading(false);
    }
  };

  // Refetch user details
  const refetchUserDetails = () => {
    setLoading(true); // Set loading to true while fetching
    fetchUserDetails();
  };

  // Fetch user details on initial load and when session changes
  useEffect(() => {
    fetchUserDetails();
  }, [session]);

  const handleEditProfile = () => {
    if (userDetails) {
      setIsModalOpen(true); // Open the modal to edit profile
    }
  };

  if (loading) {
    return <CustomLoader />;
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
      <div className='mb-4 flex w-full items-center justify-between'>
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
      {/* Modal for editing profile */}
      <ModalEditProfile
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        refetch={refetchUserDetails} // Pass the refetch function here
      />
    </div>
  );
};

export default Profile;

import { Card } from '@/components/ui/card';

import Image from 'next/image';
import TeamActionDropdown from '../team-action-dropdown';
import { TeamProps } from '@/lib/api';

interface TeamCardProps {
  team: TeamProps;
}

const TeamCard = ({ team }: TeamCardProps) => {
 
  return (
    <Card className='p-6 shadow-none rounded-3xl hover:shadow-lg cursor-pointer transition-shadow relative'>
      <div className='absolute top-5 right-5'>
        <TeamActionDropdown team={team} />
      </div>
      <Image
        src={team.imageUrl}
        alt={team.name}
        width={400}
        unoptimized
        height={250}
        className='rounded-2xl w-full mb-4 h-[12rem]'
      />
      <h2 className='text-xl font-semibold mb-2 line-clamp-1'>
        {team.name}
      </h2>
      <p className='text-gray-700 mb-4 line-clamp-3'>
        {team.description}
      </p>
      <div className='flex justify-between items-center text-sm text-gray-500 mb-1'>
        <span>{team.position}</span>
        <div>
        <p className='text-gray-700 mb-4 line-clamp-3'>
        {team.facebookUrl}
      </p>
      <p className='text-gray-700 mb-4 line-clamp-3'>
        {team.linkedInProfile}
      </p>
      <p className='text-gray-700 mb-4 line-clamp-3'>
        {team.twitterUrl}
      </p>
        </div>
      </div>
    </Card>
  );
};

export default TeamCard;

import { Card } from '@/components/ui/card';
import { User } from 'lucide-react'; // Example icon

export interface TeamMember {
  name: string;
  role: string;
  description: string;
  imageUrl: string;
}

interface TeamProps {
  teamMembers: TeamMember[];
}

const Team = ({ teamMembers }: TeamProps) => {
  return (
    <div className='flex flex-col items-center gap-1'>
      <h2 className='text-4xl font-bold text-center green_gradient'>
        Meet Our Team
      </h2>
      <p className='text-gray-600 text-lg text-center'>
        Our passionate and skilled team members
        work tirelessly to achieve our mission and
        vision.
      </p>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 w-full mt-8'>
        {teamMembers.map((member, index) => (
          <Card
            key={index}
            className='flex flex-col items-center bg-white rounded-3xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300 border-t-4 border-green-600'
          >
            <div className='relative w-16 h-16 mb-4 rounded-full flex items-center justify-center bg-gray-200'>
              <User className='text-4xl text-gray-600' />
            </div>
            <h3 className='text-lg font-semibold text-gray-800 mb-1'>
              {member.name}
            </h3>
            <p className='text-green-600 text-sm font-medium mb-2'>
              {member.role}
            </p>
            <p className='text-gray-600 text-center text-sm'>
              {member.description}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Team;

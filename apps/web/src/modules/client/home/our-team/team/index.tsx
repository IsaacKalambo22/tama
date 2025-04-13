import { Card } from '@/components/ui/card';
import { User } from 'lucide-react'; // Example icon

export interface TeamMember {
  name: string;
  role: string;
  description: string;
  linkedinUrl: string;
  facebookUrl: string;
}

interface TeamProps {
  teamMembers: TeamMember[];
}

const Team = ({ teamMembers }: TeamProps) => {
  return (
    <div className='flex flex-col items-center gap-1'>
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
            {/* <div className='flex gap-4 mt-3'>
              <a
                href={member.linkedinUrl}
                target='_blank'
                rel='noopener noreferrer'
                aria-label={`LinkedIn profile of ${member.name}`}
              >
                <FaLinkedin className='text-blue-700 text-xl hover:text-blue-900' />
              </a>
              <a
                href={member.facebookUrl}
                target='_blank'
                rel='noopener noreferrer'
                aria-label={`Facebook profile of ${member.name}`}
              >
                <FaFacebook className='text-blue-600 text-xl hover:text-blue-800' />
              </a>
            </div> */}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Team;

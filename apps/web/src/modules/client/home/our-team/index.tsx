import Team, { TeamMember } from './team';

const teamMembers: TeamMember[] = [
  {
    name: 'Nixon Lita',
    role: 'Chief Executive Officer',
    description:
      'Providing strategic direction and oversight, driving growth initiatives, and ensuring the overall success of the organization.',
    linkedinUrl:
      'https://linkedin.com/in/nicksonlita',
    facebookUrl:
      'https://facebook.com/nicksonlita',
  },
  {
    name: 'Sam Gift Kasambala',
    role: 'Head of Operations',
    description:
      'Overseeing day-to-day operational activities, optimizing processes, and ensuring efficient service delivery across all departments.',
    linkedinUrl:
      'https://linkedin.com/in/samgiftkasambala',
    facebookUrl:
      'https://facebook.com/samgiftkasambala',
  },
  {
    name: 'Jacqueline Chakwana Moleni',
    role: 'Head of Finance',
    description:
      'Managing financial planning, budgeting, and risk assessment while ensuring financial sustainability and compliance with regulations.',
    linkedinUrl:
      'https://linkedin.com/in/jaquelinemoleni',
    facebookUrl:
      'https://facebook.com/jaquelinemoleni',
  },
];

export default function OurTeam() {
  return (
    <div className='flex flex-col items-center gap-1'>
      <span className='home-text'>
        Meet Our Management Team
      </span>
      <p className='text-gray-600 text-lg text-center'>
        Our passionate and skilled team members
        work tirelessly to achieve our mission and
        vision.
      </p>
    
      <Team teamMembers={teamMembers} />
    </div>
  );
}

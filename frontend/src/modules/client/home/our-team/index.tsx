import Team from './team';

const teamMembers = [
  {
    name: 'John Doe',
    role: 'CEO',
    description:
      'Leading the team with a visionary approach to business development.',
    imageUrl: '/assets/images/team/2.jpg',
  },
  {
    name: 'Jane Smith',
    role: 'CTO',
    description:
      'Crafting innovative solutions and overseeing technical excellence.',
    imageUrl: '/assets/images/team/1.jpg',
  },
  {
    name: 'Jane Smith',
    role: 'CTO',
    description:
      'Crafting innovative solutions and overseeing technical excellence.',
    imageUrl: '/assets/images/team/3.jpg',
  },
];

export default function OurTeam() {
  return (
    <div>
      <Team teamMembers={teamMembers} />
    </div>
  );
}

import Team, { TeamMember } from './team';

const teamMembers: TeamMember[] = [
  {
    name: 'Councilor A.M. Kalima Banda',
    role: 'President',
    description:
      'Leading the executive committee with dedication and visionary leadership.',
    imageUrl: "", // No image, use icon instead
  },
  {
    name: 'Councilor R.D. Sulumba',
    role: '1st Vice President',
    description:
      'Assisting the president and ensuring the smooth operation of the committee.',
    imageUrl: "", // No image, use icon instead
  },
  {
    name: 'Councilor A.V. Siame',
    role: '2nd Vice President',
    description:
      'Supporting leadership and enhancing strategic decisions within the committee.',
    imageUrl: "", // No image, use icon instead
  },
  {
    name: 'Councilor J.N. Sibande',
    role: 'Agricultural Services Board Chair',
    description:
      'Overseeing agricultural programs and ensuring their alignment with community goals.',
    imageUrl: "", // No image, use icon instead
  },
  {
    name: 'Councilor A. Kachenje (Mrs.)',
    role: 'Enterprise Services Board Chair',
    description:
      'Driving enterprise growth and managing board strategies to foster success.',
    imageUrl: "", // No image, use icon instead
  },
];

export default function OurTeam() {
  return (
    <div>
      <Team teamMembers={teamMembers} />
    </div>
  );
}

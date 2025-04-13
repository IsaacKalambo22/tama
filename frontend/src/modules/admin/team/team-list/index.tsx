import { TeamProps } from '@/lib/api';
import TeamCard from '../team-card';
interface Props {
  team: TeamProps[];
}
const TeamList = ({ team }: Props) => {
  return (
    <div className='grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
      {team.map((team) => (
        <TeamCard key={team.id} team={team} />
      ))}
    </div>
  );
};

export default TeamList;

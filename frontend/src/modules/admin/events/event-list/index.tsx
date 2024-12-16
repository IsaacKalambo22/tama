import { EventProps } from '@/lib/api';
import EventCard from '../event-card';
interface Props {
  events: EventProps[];
}
const EventList = ({ events }: Props) => {
  return (
    <div className='grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};

export default EventList;

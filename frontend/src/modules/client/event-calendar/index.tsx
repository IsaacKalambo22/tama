import { fetchEvents } from '@/lib/api';
import HeaderText from '@/modules/common/header-text';
import EventCard from './event-card';

const EventCalendar = async () => {
  let events = [];
  try {
    events = await fetchEvents(); // Fetch the events from the API
  } catch (error) {
    console.error(
      'Failed to fetch events:',
      error
    );
    return (
      <div className='flex flex-col w-full items-center gap-10 mb-16'>
        <HeaderText
          title='Upcoming Farming Events'
          subtitle='Join Workshops and Seminars to Enhance Your Farming Skills'
        />
        <p className='text-red-500'>
          Failed to load events. Please try again
          later.
        </p>
      </div>
    );
  }

  return (
    <div className='flex flex-col w-full gap-10 mb-16'>
      <HeaderText
        title='Upcoming Farming Events'
        subtitle='Stay informed about upcoming events and opportunities'
      />
      {events?.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10'>
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
            />
          ))}
        </div>
      ) : (
        <p className='text-gray-500 mt-4'>
          No events available. Stay tuned for
          upcoming events!
        </p>
      )}
    </div>
  );
};

export default EventCalendar;

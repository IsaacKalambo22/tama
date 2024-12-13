import HeaderText from '@/modules/common/header-text';
import EventCard from './event-card';

type Event = {
  id: number;
  title: string;
  description: string;
  date: string;
  endDate?: string;
  time?: string;
};

const EventCalendar: React.FC = () => {
  const events: Event[] = [
    {
      id: 1,
      title: 'Soil Testing Workshop',
      description:
        'Learn the importance of soil testing for better crop yields.',
      date: '2024-12-10',
      time: '10:00 AM - 12:00 PM',
    },
    {
      id: 2,
      title: 'Irrigation Techniques',
      description:
        'Explore efficient irrigation methods to conserve water.',
      date: '2024-12-12',
    },
    {
      id: 3,
      title: 'Organic Farming Practices',
      description:
        'Discover organic methods to grow healthier crops.',
      date: '2024-12-14',
      time: '11:00 AM - 1:00 PM',
    },
    {
      id: 4,
      title: 'Planting Season Start',
      description:
        'The planting season begins in July for certain crops.',
      date: '2024-07-01',
      endDate: '2024-07-31',
    },
    {
      id: 5,
      title: 'Crop Rotation Strategies',
      description:
        'Enhance soil fertility with effective crop rotation plans.',
      date: '2024-12-18',
      time: '9:00 AM - 10:30 AM',
    },
    {
      id: 6,
      title: 'Greenhouse Farming',
      description:
        'A session on setting up and maintaining greenhouses.',
      date: '2024-12-20',
    },
    {
      id: 7,
      title: 'Harvesting Best Practices',
      description:
        'Tips on harvesting crops to maximize quality and yield.',
      date: '2024-12-22',
      time: '10:00 AM - 12:00 PM',
    },
    {
      id: 8,
      title: 'Farm Machinery Maintenance',
      description:
        'Learn how to maintain and care for your farming equipment.',
      date: '2024-12-24',
      time: '2:00 PM - 4:00 PM',
    },
  ];

  return (
    <div className='flex flex-col w-full max-w-7xl mx-auto items-center gap-10 mb-16'>
      <HeaderText
        title='Upcoming Farming Events'
        subtitle='Join Workshops and Seminars to Enhance Your Farming Skills'
      />

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
        {events.map((event) => (
          <EventCard
            key={event.id}
            title={event.title}
            description={event.description}
            date={event.date}
            endDate={event.endDate}
            time={event.time}
          />
        ))}
      </div>
    </div>
  );
};

export default EventCalendar;

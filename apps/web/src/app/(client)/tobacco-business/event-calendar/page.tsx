import EventCalendar from '@/modules/client/event-calendar';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Event Calendar - TAMA Farmers Trust',
  description:
    'Stay updated with the latest events and activities at TAMA Farmers Trust.',
};

const EventCalendarPage = () => {
  return <EventCalendar />;
};

export default EventCalendarPage;

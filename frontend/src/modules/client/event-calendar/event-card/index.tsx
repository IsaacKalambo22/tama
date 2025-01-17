import { Card } from '@/components/ui/card';
import {
  formatDate,
  formatTime,
} from '@/lib/utils';
import { Calendar, Clock } from 'lucide-react';
import { EventProps } from '../../../../lib/api';

interface EventCardProps {
  event: EventProps;
}

const generateRandomColor = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
};

// Format the date range if `endDate` is provided
const formatEventDate = (
  startDate: string,
  endDate?: string
) => {
  if (endDate) {
    return `${formatDate(
      startDate
    )} - ${formatDate(endDate)}`;
  }
  return formatDate(startDate);
};

const EventCard = ({ event }: EventCardProps) => {
  const {
    title,
    description,
    location,
    date,
    endDate,
    time,
  } = event;

  return (
    <Card className='relative shadow-lg flex items-start p-6 rounded-xl'>
      {/* Vertical Color Bar */}
      <div
        style={{
          backgroundColor: generateRandomColor(),
        }}
        className='w-2 h-full absolute left-0 top-0 rounded-l-xl'
      ></div>

      {/* Event Details */}
      <div className=''>
        <h3 className='text-lg text-left font-semibold'>
          {title}
        </h3>
        <p className='text-gray-700 text-left mt-2 line-clamp-3'>
          {description}
        </p>
        {location && (
          <p className='text-sm text-left text-gray-600 mt-2'>
            <strong>Location:</strong> {location}
          </p>
        )}
        <div className='flex flex-col sm:flex-row sm:items-center gap-4 mt-4 text-sm text-gray-600'>
          <div className='flex items-center gap-1'>
            <Calendar className='w-5 h-5 text-gray-700' />
            <span className='mt-1'>
              {formatEventDate(
                date.toString(),
                endDate?.toString()
              )}
            </span>
          </div>
          {time && (
            <div className='flex items-center gap-1'>
              <Clock className='w-5 h-5 text-gray-700' />
              <span className='mt-1'>
                {formatTime(time)}
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default EventCard;

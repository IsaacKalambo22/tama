'use client';
import { Button } from '@/components/ui/button';
import { EventProps } from '@/lib/api';
import Modal from '../../modal';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  event: EventProps;
};

const ModalViewEvent = ({
  isOpen,
  onClose,
  event,
}: Props) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      name={event.title || 'Event Details'}
    >
      <div className='space-y-6'>
        {/* Event Title */}
        <div>
          <h2 className='text-xl font-semibold'>
            {event.title}
          </h2>
          <p className='text-gray-600 text-sm mt-2'>
            {event.description}
          </p>
        </div>

        {/* Event Date and Time */}
        <div className='space-y-2'>
          <p className='text-sm'>
            <span className='font-medium'>
              Date:
            </span>{' '}
            {event.date}
            {event.endDate &&
              ` - ${event.endDate}`}
          </p>
          {event.time && (
            <p className='text-sm'>
              <span className='font-medium'>
                Time:
              </span>{' '}
              {event.time}
            </p>
          )}
        </div>

        {/* Event Location */}
        {event.location && (
          <div>
            <h3 className='text-sm font-medium'>
              Location
            </h3>
            <p className='text-sm text-gray-800'>
              {event.location}
            </p>
          </div>
        )}
      </div>

      {/* Close Button */}
      <div className='mt-6 flex justify-end'>
        <Button variant='ghost' onClick={onClose}>
          Close
        </Button>
      </div>
    </Modal>
  );
};

export default ModalViewEvent;

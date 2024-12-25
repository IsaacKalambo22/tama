import { Card } from '@/components/ui/card';
import { formatDateTime } from '@/lib/utils';
import Image from 'next/image';
import React from 'react';

export interface FacebookPostProps {
  id: string;
  message?: string;
  created_time: string;
  attachments?: {
    data: {
      media?: {
        image?: {
          src: string;
        };
      };
    }[];
  };
}

const PostCard: React.FC<FacebookPostProps> = ({
  message,
  created_time,
  attachments,
}) => {
  return (
    <Card className='p-6 shadow-none rounded-3xl hover:shadow-lg transition-shadow'>
      {attachments?.data[0]?.media?.image
        ?.src && (
        <Image
          src={
            attachments.data[0].media.image.src
          }
          alt='Post Attachment'
          width={400}
          height={250}
          className='rounded-2xl w-full mb-4 h-[20rem]'
        />
      )}
      <p className='text-gray-700 mb-4 line-clamp-3'>
        {message || 'No content available'}
      </p>
      <span className='text-sm text-gray-500'>
        {formatDateTime(created_time)}
      </span>
    </Card>
  );
};

export default PostCard;

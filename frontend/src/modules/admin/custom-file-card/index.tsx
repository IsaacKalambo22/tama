import { Card } from '@/components/ui/card';
import { convertFileSize } from '@/lib/utils';
import { FileCardProps } from '@/modules/client/file-card';
import FormattedDateTime from '@/modules/common/formatted-date-time';
import Thumbnail from '@/modules/common/thumbnail';
import Link from 'next/link';
import ActionDropdown from './action-drop-down';

const CustomFileCard = ({
  file,
}: FileCardProps) => {
  return (
    <Link href={file.url} target='_blank'>
      <Card className='file-card'>
        <div className='flex justify-between'>
          <Thumbnail
            type={file.type}
            extension={file.extension}
            url={file.url}
            className='!size-20'
            imageClassName='!size-11'
          />

          <div className='flex flex-col items-end justify-between'>
            <ActionDropdown file={file} />
          </div>
        </div>
        <div className='file-card-details gap-2'>
          <p className='subtitle-2 line-clamp-1'>
            {file.name}
          </p>
          <div className='flex justify-between w-full'>
            <FormattedDateTime
              date={file.createdAt}
              className='body-2 text-light-100'
            />
            <p className='body-2 align-bottom'>
              {convertFileSize(file.size)}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
};
export default CustomFileCard;

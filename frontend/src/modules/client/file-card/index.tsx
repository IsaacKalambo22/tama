import { Card } from '@/components/ui/card';
import { convertFileSize } from '@/lib/utils';
import DownloadButton from '@/modules/common/download-button';
import FormattedDateTime from '@/modules/common/formatted-date-time';
import Thumbnail from '@/modules/common/thumbnail';
import Link from 'next/link';

export interface FileCardProps {
  file: {
    id: string;
    url: string;
    type: string;
    extension: string;
    size: number;
    name: string;
    createdAt: string;
    owner: {
      fullName: string;
    };
  };
}

const FileCard = ({ file }: FileCardProps) => {
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

          <div className='flex h-full flex-col items-end justify-between'>
            <DownloadButton
              fileName={file.name}
              fileExtension={file.extension}
            />
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
export default FileCard;

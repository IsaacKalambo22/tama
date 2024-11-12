'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  constructDownloadUrl,
  convertFileSize,
} from '@/lib/utils';
import Thumbnail from '@/modules/common/thumbnail';
import Image from 'next/image';

export interface FileCardProps {
  file: {
    url: string;
    type: string;
    extension: string;
    size: number;
    name: string;
    $createdAt: string;
    owner: {
      fullName: string;
    };
  };
}
const handleDownload = (
  fileName: string,
  fileExtension: string
) => {
  const fullFileName = `${fileName}.${fileExtension}`; // Combine filename and extension

  const downloadLink =
    document.createElement('a');
  downloadLink.href =
    constructDownloadUrl(fullFileName); // Use the full file name with extension
  downloadLink.download = fullFileName; // Set the combined file name for download
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);

  console.log(
    `Downloading file: ${fullFileName}`
  ); // Log the full file name
};
const FileCard = ({ file }: FileCardProps) => {
  return (
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
          <Button
            size='icon'
            onClick={() =>
              handleDownload(
                file.name,
                file.extension
              )
            }
            variant='ghost'
            className='rounded-full'
          >
            <Image
              src='/assets/icons/download.svg'
              alt='dots'
              width={35}
              height={35}
            />
          </Button>
          {/* <ActionDropdown file={file} /> */}
          <p className='body-1'>
            {convertFileSize(file.size)}
          </p>
        </div>
      </div>

      <div className='file-card-details'>
        <p className='subtitle-2 line-clamp-1'>
          {file.name}
        </p>
        {/* <FormattedDateTime
          date={file.$createdAt}
          className='body-2 text-light-100'
        /> */}
        {/* <p className='caption line-clamp-1 text-light-200'>
          By: {file.owner.fullName}
        </p> */}
      </div>
    </Card>
  );
};
export default FileCard;

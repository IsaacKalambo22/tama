'use client';

import { Button } from '@/components/ui/button';
import { constructFileUrl } from '@/lib/utils';
import Image from 'next/image';

interface DownloadButtonProps {
  fileName: string;
  fileExtension: string;
}

const DownloadButton = ({
  fileName,
  fileExtension,
}: DownloadButtonProps) => {
  // lib/utils.ts
  const handleDownload = async () => {
    const fullFileName = `${fileName}`;
    const downloadLink =
      document.createElement('a');
    downloadLink.href =
      constructFileUrl(fullFileName);
    downloadLink.download = fullFileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    console.log(
      `Downloading file: ${fullFileName}`
    ); // Log the full file name
  };

  return (
    <Button
      size='icon'
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleDownload();
      }} // Handle download when clicked
      variant='ghost'
      className='rounded-full'
    >
      <Image
        src='/assets/icons/download.svg'
        alt='Download'
        width={35}
        height={35}
      />
    </Button>
  );
};

export default DownloadButton;

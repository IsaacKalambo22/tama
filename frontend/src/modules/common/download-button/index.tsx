'use client';

import { Button } from '@/components/ui/button';
import { constructDownloadUrl } from '@/lib/utils';
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

  return (
    <Button
      size='icon'
      onClick={() =>
        handleDownload(fileName, fileExtension)
      } // Handle download when clicked
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

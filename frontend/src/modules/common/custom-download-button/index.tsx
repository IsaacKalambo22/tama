'use client';

import { constructFileUrl } from '@/lib/utils';
import Image from 'next/image';

interface CustomDownloadButtonProps {
  fileUrl: string;
}

const CustomDownloadButton = ({
  fileUrl,
}: CustomDownloadButtonProps) => {
  // lib/utils.ts
  const handleDownload = async () => {
    const fullFileName = `${fileUrl}`;
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
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleDownload();
      }}
      className='flex items-center gap-2'
    >
      <Image
        src='/assets/icons/download.svg'
        alt='Download'
        width={30}
        height={30}
      />
      Download{' '}
    </div>
  );
};

export default CustomDownloadButton;

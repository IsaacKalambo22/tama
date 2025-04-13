'use client';

import { constructFileUrl } from '@/lib/utils';
import Image from 'next/image';

interface CustomDownloadButtonProps {
  fileUrl: string;
  fileName: string;
}

const CustomDownloadButton = ({
  fileUrl,
  fileName,
}: CustomDownloadButtonProps) => {
  const handleDownload = async () => {
    try {
      const fullFileUrl =
        constructFileUrl(fileUrl);

      // Fetch the file blob to handle download properly
      const response = await fetch(fullFileUrl);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch file: ${response.statusText}`
        );
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const downloadLink =
        document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = fileName; // Explicitly set the file name
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      // Revoke the object URL to free up memory
      URL.revokeObjectURL(url);

      console.log(
        `Downloading file: ${fileName}`
      );
    } catch (error) {
      console.error(
        'Error downloading file:',
        error
      );
    }
  };

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleDownload();
      }}
      className='flex items-center gap-2 cursor-pointer'
    >
      <Image
        src='/assets/icons/download.svg'
        alt='Download'
        width={30}
        height={30}
      />
      Download
    </div>
  );
};

export default CustomDownloadButton;

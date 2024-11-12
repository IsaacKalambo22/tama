'use client';

import { Dialog } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { constructDownloadUrl } from '@/lib/utils';
import Image from 'next/image';
import { useState } from 'react';
import { actionsDropdownItems } from '../constants/nav-items/action-dropdown';
import { FileCardProps } from '../reports-publications/file-card';

const ActionDropdown = ({
  file,
}: FileCardProps) => {
  const [isModalOpen, setIsModalOpen] =
    useState(false);
  const [isDropdownOpen, setIsDropdownOpen] =
    useState(false);

  // Function to trigger file download
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
    <Dialog
      open={isModalOpen}
      onOpenChange={setIsModalOpen}
    >
      <DropdownMenu
        open={isDropdownOpen}
        onOpenChange={setIsDropdownOpen}
      >
        <DropdownMenuTrigger className='shad-no-focus'>
          <Image
            src='/assets/icons/dots.svg'
            alt='dots'
            width={24}
            height={24}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className='max-w-[200px] truncate'>
            {file.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {actionsDropdownItems.map(
            (actionItem) => (
              <DropdownMenuItem
                key={actionItem.value}
                className='shad-dropdown-item'
              >
                {actionItem.value ===
                'download' ? (
                  <div
                    className='flex items-center gap-2 cursor-pointer'
                    onClick={() =>
                      handleDownload(
                        file.name,
                        file.extension
                      )
                    }
                  >
                    <Image
                      src={actionItem.icon}
                      alt={actionItem.label}
                      width={30}
                      height={30}
                    />
                    {actionItem.label}
                  </div>
                ) : (
                  <div className='flex items-center gap-2'>
                    <Image
                      src={actionItem.icon}
                      alt={actionItem.label}
                      width={30}
                      height={30}
                    />
                    {actionItem.label}
                  </div>
                )}
              </DropdownMenuItem>
            )
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </Dialog>
  );
};

export default ActionDropdown;

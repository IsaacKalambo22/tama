'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { FileProps } from '@/lib/api';
import {
  constructDownloadUrl,
  getFileType,
} from '@/lib/utils';
import Image from 'next/image';
import { useState } from 'react';

import { clientActionsDropdownItems } from '@/modules/admin/constants';
import { FileDetails } from '../actions-modal-content';
type Props = {
  file: FileProps;
};
const ActionDropdown = ({ file }: Props) => {
  const fileProps = getFileType(file.fileUrl);
  const [isModalOpen, setIsModalOpen] =
    useState(false);
  const [isDropdownOpen, setIsDropdownOpen] =
    useState(false);
  const [action, setAction] =
    useState<ActionType | null>(null);

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

  const renderDialogContent = () => {
    if (!action) return null;

    const { value, label } = action;

    return (
      <DialogContent className='shad-dialog button'>
        <DialogHeader className='flex flex-col gap-3'>
          <DialogTitle className='text-center text-light-100'>
            {label}
          </DialogTitle>

          {value === 'details' && (
            <FileDetails file={file} />
          )}
        </DialogHeader>
      </DialogContent>
    );
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
            width={22}
            height={22}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className='max-w-[200px] truncate'>
            {file.filename}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {clientActionsDropdownItems.map(
            (actionItem) => (
              <DropdownMenuItem
                key={actionItem.value}
                className='shad-dropdown-item'
                onClick={() => {
                  setAction(actionItem);

                  if (
                    [
                      'rename',
                      'share',
                      'delete',
                      'details',
                    ].includes(actionItem.value)
                  ) {
                    setIsModalOpen(true);
                  }
                }}
              >
                {actionItem.value ===
                'download' ? (
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDownload(
                        file.filename,
                        fileProps.extension
                      );
                    }}
                    className='flex items-center gap-2'
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

      {renderDialogContent()}
    </Dialog>
  );
};
export default ActionDropdown;

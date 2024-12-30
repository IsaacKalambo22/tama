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

import { FileProps } from '@/lib/api';
import CustomDownloadButton from '@/modules/common/custom-download-button';
import Image from 'next/image';
import { useState } from 'react';
import { actionsDropdownItems } from '../../constants';
import ModalDeleteForms from '../modal-delete-forms';
import ModalEditForms from '../modal-edit-forms';
import ModalViewForms from '../modal-view-forms';
type Props = {
  file: FileProps;
};
const FormsActionDropdown = ({ file }: Props) => {
  const [isModalOpen, setIsModalOpen] =
    useState(false);
  const [isDropdownOpen, setIsDropdownOpen] =
    useState(false);
  const [action, setAction] =
    useState<ActionType | null>(null);

  const renderDialogContent = () => {
    if (!action) return null;

    const { value } = action;

    if (value === 'edit') {
      return (
        <ModalEditForms
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          file={file}
        />
      );
    }
    if (value === 'details') {
      return (
        <ModalViewForms
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          file={file}
        />
      );
    }
    if (value === 'delete') {
      return (
        <ModalDeleteForms
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          file={file}
        />
      );
    }
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
          <div className='rounded-full bg-white/80 hover:bg-white/90 backdrop-blur-md shadow-md p-2'>
            <Image
              src='/assets/icons/dots.svg'
              alt='dots'
              width={18}
              height={18}
            />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className='max-w-[200px] truncate'>
            {file.filename}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {actionsDropdownItems.map(
            (actionItem) => (
              <DropdownMenuItem
                key={actionItem.value}
                className='shad-dropdown-item'
                onClick={() => {
                  setAction(actionItem);

                  if (
                    [
                      'edit',
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
                  <CustomDownloadButton
                    fileUrl={file.fileUrl}
                  />
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
export default FormsActionDropdown;

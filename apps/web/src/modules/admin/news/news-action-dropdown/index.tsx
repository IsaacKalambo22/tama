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

import { NewsProps } from '@/lib/api';
import Image from 'next/image';
import { useState } from 'react';
import { adminActionsDropdownItems } from '../../constants';
import ModalDeleteNews from '../modal-delete-news';
import ModalEditNews from '../modal-edit-news';
import ModalViewNews from '../modal-view-news';
type Props = {
  news: NewsProps;
};
const NewsActionDropdown = ({ news }: Props) => {
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
        <ModalEditNews
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          news={news}
        />
      );
    }
    if (value === 'details') {
      return (
        <ModalViewNews
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          news={news}
        />
      );
    }
    if (value === 'delete') {
      return (
        <ModalDeleteNews
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          news={news}
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
            {news.title}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {adminActionsDropdownItems.map(
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
                {actionItem.value && (
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
export default NewsActionDropdown;

'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
import { Input } from '@/components/ui/input';

import { FileProps } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import {
  deleteFile,
  renameFile,
} from '../../actions';
import { actionsDropdownItems } from '../../constants';
import { FileDetails } from '../actions-modal-content';
type Props = {
  file: FileProps;
};
const ActionDropdown = ({ file }: Props) => {
  const [isModalOpen, setIsModalOpen] =
    useState(false);
  const [isDropdownOpen, setIsDropdownOpen] =
    useState(false);
  const [action, setAction] =
    useState<ActionType | null>(null);
  const [name, setName] = useState(file.name);
  const [isLoading, setIsLoading] =
    useState(false);

  const closeAllModals = () => {
    setIsModalOpen(false);
    setIsDropdownOpen(false);
    setAction(null);
    setName(file.filename);
    //   setEmails([]);
  };

  const handleAction = async () => {
    if (!action) return;
    setIsLoading(true);
    let success = false;

    const actions = {
      rename: () => renameFile(),

      delete: () => deleteFile(),
    };

    success = await actions[
      action.value as keyof typeof actions
    ]();

    if (success) closeAllModals();

    setIsLoading(false);
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
          {value === 'rename' && (
            <Input
              type='text'
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />
          )}
          {value === 'details' && (
            <FileDetails file={file} />
          )}

          {value === 'delete' && (
            <p className='delete-confirmation'>
              Are you sure you want to delete{` `}
              <span className='delete-file-name'>
                {file.filename}
              </span>
              ?
            </p>
          )}
        </DialogHeader>
        {['rename', 'delete', 'share'].includes(
          value
        ) && (
          <DialogFooter className='flex flex-col gap-3 md:flex-row'>
            <Button
              onClick={closeAllModals}
              className='modal-cancel-button'
            >
              Cancel
            </Button>
            <Button
              onClick={handleAction}
              className='modal-submit-button'
            >
              <p className='capitalize'>
                {value}
              </p>
              {isLoading && (
                <Image
                  src='/assets/icons/loader.svg'
                  alt='loader'
                  width={24}
                  height={24}
                  className='animate-spin'
                />
              )}
            </Button>
          </DialogFooter>
        )}
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
          {actionsDropdownItems.map(
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
                  <Link
                    href='/'
                    // {constructDownloadUrl(
                    //   file.name
                    // )}
                    download={file.filename}
                    className='flex items-center gap-2'
                  >
                    <Image
                      src={actionItem.icon}
                      alt={actionItem.label}
                      width={30}
                      height={30}
                    />
                    {actionItem.label}
                  </Link>
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

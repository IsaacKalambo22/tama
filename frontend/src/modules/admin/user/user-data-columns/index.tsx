'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { UserProps } from '@/lib/api';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Pencil, Trash } from 'lucide-react';
import { useState } from 'react';
import ModalEditUser from '../modal-edit-user';

export const userColumns: ColumnDef<UserProps>[] =
  [
    {
      header: '#',
      cell: ({ row }) => {
        return (
          <p className='text-14-medium'>
            {row.index + 1}
          </p>
        );
      },
    },
    {
      accessorKey: 'name',
      header: 'User Info',
      cell: ({ row }) => {
        const userName = row.original.name;
        const firstLetter = userName
          .charAt(0)
          .toUpperCase(); // Get the first letter of the name

        return (
          <div className='flex items-center gap-4'>
            {/* Avatar with First Letter */}
            <Card
              className='flex justify-center items-center rounded-full w-10 h-10 bg-gray-200 text-gray-800 font-bold text-lg'
              title={userName} // Tooltip with the full name
            >
              {firstLetter}
            </Card>
            {/* User Info */}
            <div>
              <p>{userName}</p>
              <p className='text-muted-foreground text-sm'>
                {row.original.email}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => (
        <div>{row.getValue('role')}</div>
      ),
    },
    {
      accessorKey: 'phoneNumber',
      header: 'Phone number',
      cell: ({ row }) => (
        <div>{row.getValue('phoneNumber')}</div>
      ),
    },
    {
      accessorKey: 'isVerified',
      header: 'Verified',
      cell: ({ row }) => (
        <div>
          {row.getValue('isVerified') ? (
            <span className='text-green-600'>
              ✔ Verified
            </span>
          ) : (
            <span className='text-red-600'>
              ✘ Not Verified
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'action',
      header: 'Actions',
      cell: ({ row }) => {
        const user = row.original; // Get the user data for this row
        const [isModalOpen, setModalOpen] =
          useState(false);

        const handleEditClick = () => {
          setModalOpen(true);
        };

        const handleCloseModal = () => {
          setModalOpen(false);
        };

        return (
          <div className='h-8 flex gap-1'>
            <Button
              variant='ghost'
              className='px-[0.4rem] h-8 text-gray-500'
            >
              <Eye className='h-4 w-4' />
            </Button>

            <Button
              variant='ghost'
              className='px-[0.4rem] h-8 text-gray-500'
              onClick={handleEditClick}
            >
              <Pencil className='h-4 w-4' />
            </Button>

            <Button
              variant='ghost'
              className='px-[0.4rem] h-8'
            >
              <Trash className='h-4 w-4 text-red-600' />
            </Button>

            {/* Update User Modal */}
            {isModalOpen && (
              <ModalEditUser
                isOpen={isModalOpen}
                user={user} // Pass the selected user data
                onClose={handleCloseModal} // Callback to close the modal
              />
            )}
          </div>
        );
      },
    },
  ];

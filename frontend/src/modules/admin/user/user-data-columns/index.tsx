'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { UserProps } from '@/lib/api';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Pencil, Trash } from 'lucide-react';
import { useState } from 'react';
import ModalDeleteUser from '../modal-delete-user';
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
        const [
          isEditModalOpen,
          setEditModalOpen,
        ] = useState(false);
        const [
          isDeleteModalOpen,
          setDeleteModalOpen,
        ] = useState(false);

        // Handlers to toggle modals
        const handleEditClick = () =>
          setEditModalOpen((prev) => !prev);
        const handleDeleteClick = () =>
          setDeleteModalOpen((prev) => !prev);

        const handleCloseEditModal = () =>
          setEditModalOpen((prev) => !prev);
        const handleCloseDeleteModal = () =>
          setDeleteModalOpen((prev) => !prev);

        return (
          <div className='h-8 flex gap-1'>
            {/* View Button */}
            <Button
              onClick={handleEditClick}
              variant='ghost'
              className='px-[0.4rem] h-8 text-gray-500'
            >
              <Eye className='h-4 w-4' />
            </Button>

            {/* Edit Button */}
            <Button
              onClick={handleEditClick}
              variant='ghost'
              className='px-[0.4rem] h-8 text-gray-500'
            >
              <Pencil className='h-4 w-4' />
            </Button>

            {/* Delete Button */}
            <Button
              onClick={handleDeleteClick}
              variant='ghost'
              className='px-[0.4rem] h-8'
            >
              <Trash className='h-4 w-4 text-red-600' />
            </Button>

            {/* Edit Modal */}
            {isEditModalOpen && (
              <ModalEditUser
                isOpen={isEditModalOpen}
                user={user} // Pass the selected user data
                onClose={handleCloseEditModal} // Callback to close the modal
              />
            )}

            {/* Delete Modal */}
            {isDeleteModalOpen && (
              <ModalDeleteUser
                isOpen={isDeleteModalOpen}
                user={user} // Pass the selected user data
                onClose={handleCloseDeleteModal} // Callback to close the modal
              />
            )}
          </div>
        );
      },
    },
  ];

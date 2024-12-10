'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { UserProps } from '@/lib/api';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Pencil, Trash } from 'lucide-react';

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
      cell: ({}) => {
        // const user = row.original;
        // const [isDialogOpen, setIsDialogOpen] =
        //   useState(false);

        // // Function to toggle the dialog open/close state
        // const handleOpenDialog = () => {
        //   setIsDialogOpen((prev) => !prev); // Toggle state
        // };

        // const [
        //   deleteProduct,
        //   { isLoading, isError, isSuccess },
        // ] = useDeleteProductMutation();

        // const onConfirm = async () => {
        //   console.log(
        //     'Deleting product:',
        //     product.id
        //   );
        //   try {
        //     await deleteProduct(
        //       product.id
        //     ).unwrap();

        //     toast({
        //       variant: 'default',
        //       title: 'Product deleted successfully',
        //       className: 'bg-green-500 text-white',
        //     });
        //     handleOpenDialog();
        //   } catch (error) {
        //     console.log(error);
        //     toast({
        //       variant: 'destructive',
        //       title: 'Failed to delete product',
        //       description:
        //         'There was a problem updating the product',
        //     });
        //   }
        // };
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
            >
              <Pencil className='h-4 w-4' />
            </Button>
            <Button
              // onClick={handleOpenDialog} // Toggle the dialog
              variant='ghost'
              className='px-[0.4rem] h-8'
            >
              <Trash className='h-4 w-4 text-red-600' />
            </Button>
            {/* <CustomDialog
            isOpen={isDialogOpen}
            isLoading={isLoading}
            onOpenChange={handleOpenDialog} // Close dialog on change
            title='Confirm Deletion'
            description={`${product.productName} product`}
            onConfirm={onConfirm} // Confirm delete action
          /> */}
          </div>
        );
      },
    },
  ];

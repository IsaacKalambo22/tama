'use client';

import { Button } from '@/components/ui/button';
import { CouncilListProps } from '@/lib/api';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

export const councilListDataColumns: ColumnDef<CouncilListProps>[] =
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
      accessorKey: 'councilArea',
      header: ({ column }) => {
        return (
          <Button
            className='h-8 max-sm:hidden'
            variant='ghost'
            onClick={() =>
              column.toggleSorting(
                column.getIsSorted() === 'asc'
              )
            }
          >
            Council Area
            <ArrowUpDown className='ml-2 h-4 w-4 ' />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className='flex ml-4 gap-2 items-center'>
            <div className='capitalize'>
              {row.getValue('councilArea')}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'demarcation',
      header: ({ column }) => {
        return (
          <Button
            className='h-8'
            variant='ghost'
            onClick={() =>
              column.toggleSorting(
                column.getIsSorted() === 'asc'
              )
            }
          >
            Demarcation
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className='flex ml-4 gap-2 items-center'>
            <div className='capitalize'>
              {row.getValue('demarcation')}
            </div>
          </div>
        );
      },
    },

    {
      accessorKey: 'council',
      header: ({ column }) => {
        return (
          <Button
            className='h-8'
            variant='ghost'
            onClick={() =>
              column.toggleSorting(
                column.getIsSorted() === 'asc'
              )
            }
          >
            Council
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className='flex ml-4 gap-2 items-center'>
            <div className='capitalize'>
              {row.getValue('council')}
            </div>
          </div>
        );
      },
    },

    {
      accessorKey: 'firstAlternateCouncillor',
      header: ({ column }) => {
        return (
          <Button
            className='h-8 max-sm:hidden'
            variant='ghost'
            onClick={() =>
              column.toggleSorting(
                column.getIsSorted() === 'asc'
              )
            }
          >
            First Alternate Councillor
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className='flex ml-4 gap-2 items-center'>
            <div className='capitalize'>
              {row.getValue(
                'firstAlternateCouncillor'
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'secondAlternateCouncillor',
      header: ({ column }) => {
        return (
          <Button
            className='h-8 max-sm:hidden'
            variant='ghost'
            onClick={() =>
              column.toggleSorting(
                column.getIsSorted() === 'asc'
              )
            }
          >
            Second Alternate Councillor
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className='flex ml-4 gap-2 items-center'>
            <div className='capitalize'>
              {row.getValue(
                'secondAlternateCouncillor'
              )}
            </div>
          </div>
        );
      },
    },
  ];

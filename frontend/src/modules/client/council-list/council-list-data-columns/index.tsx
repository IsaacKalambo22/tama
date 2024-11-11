'use client';

import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

export interface CouncilListProps {
  demarcation: string;
  tobaccoType: string;
  councillor: string;
  firstAlternateCouncillor: string;
  secondAlternateCouncillor: string;
}

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
      accessorKey: 'tobaccoType',
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
            Tobacco Type
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className='flex ml-4 gap-2 items-center'>
            <div className='capitalize'>
              {row.getValue('tobaccoType')}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'councillor',
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
            Councillor
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className='flex ml-4 gap-2 items-center'>
            <div className='capitalize'>
              {row.getValue('councillor')}
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
            className='h-8'
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
            className='h-8'
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

'use client';

import { CustomDataTable } from '@/modules/common/custom-data-table';
import CustomError from '@/modules/common/custom-error';
import CustomLoader from '@/modules/common/custom-loader';
import { useEffect, useState } from 'react';
import {
  councilListDataColumns,
  CouncilListProps,
} from '../council-list-data-columns';

const initialCouncilListData: CouncilListProps[] =
  [
    {
      demarcation: 'Zone A1',
      tobaccoType: 'Virginia',
      councillor: 'John Doe',
      firstAlternateCouncillor: 'Alice Smith',
      secondAlternateCouncillor: 'Robert Brown',
    },
    {
      demarcation: 'Zone B3',
      tobaccoType: 'Burley',
      councillor: 'Emily Johnson',
      firstAlternateCouncillor: 'David Williams',
      secondAlternateCouncillor: 'Linda White',
    },
    {
      demarcation: 'Zone C2',
      tobaccoType: 'Dark Fired',
      councillor: 'Michael Clark',
      firstAlternateCouncillor: 'Jessica Lee',
      secondAlternateCouncillor: 'James Taylor',
    },
    {
      demarcation: 'Zone D4',
      tobaccoType: 'Oriental',
      councillor: 'Patricia Martinez',
      firstAlternateCouncillor: 'Thomas Anderson',
      secondAlternateCouncillor: 'Nancy Lewis',
    },
    {
      demarcation: 'Zone E5',
      tobaccoType: 'Perique',
      councillor: 'Charles Harris',
      firstAlternateCouncillor: 'Barbara King',
      secondAlternateCouncillor: 'Daniel Wright',
    },
  ];

export function CouncilListDataTable() {
  const [data, setData] = useState<
    CouncilListProps[]
  >([]);
  const [isLoading, setIsLoading] =
    useState(true);
  const [error, setError] = useState<
    string | null
  >(null);

  useEffect(() => {
    // Simulating data fetch with a delay
    setTimeout(() => {
      try {
        setData(initialCouncilListData);
        setIsLoading(false);
      } catch (err) {
        console.log({ err });
        setError(
          'Failed to load council list data.'
        );
        setIsLoading(false);
      }
    }, 1000);
  }, []);

  if (isLoading) return <CustomLoader />;

  if (error)
    return (
      <CustomError message='council list data' />
    );

  return (
    <div className='w-full min-w-full'>
      <CustomDataTable
        data={data}
        columns={councilListDataColumns}
        filterPlaceholder='Filter council list...'
        filterColumn='demarcation'
      />
    </div>
  );
}

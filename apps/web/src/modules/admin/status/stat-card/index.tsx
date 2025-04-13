

import { Card } from '@/components/ui/card';
import { StatProps } from '@/lib/api';
import { BASE_URL } from '@/lib/utils';
import Image from 'next/image';
import StatActionDropdown from '../stat-action-dropdown';

interface Props {
 stat:StatProps
}




const StatCard = ({
 stat
}: Props) => {

  return <Card className='p-6 shadow-none rounded-3xl hover:shadow-lg cursor-pointer transition-shadow relative'>
    <div
            className="absolute top-5 right-5" 

    >
    <StatActionDropdown stat={stat}/>

    </div>
   
    <h2 className='text-[1rem] font-semibold mb-2'>
      {stat.id}
    </h2>
    <p className='text-gray-700'>{stat.registeredCustomers}</p>
    <p className='text-gray-500'>
      {stat.shops}
    </p>
    <p className='text-gray-500'>
      {stat.councilors}
    </p>
    <p className='text-gray-500'>
      {stat.cooperatives}
    </p>
    <p className='text-gray-500'>
      {stat.createdAt}
    </p>
    <p className='text-gray-500'>
      {stat.updatedAt}
    </p>
  </Card>
}

export default StatCard;

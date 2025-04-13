

import { Card } from '@/components/ui/card';
import { StatProps } from '@/lib/api';
import { BASE_URL } from '@/lib/utils';
import Image from 'next/image';
import StatActionDropdown from '../stat-action-dropdown';
import StatisticBlock from "@/modules/client/home/statistic-block";
import { FaStore, FaUsers, FaUsersCog, FaWarehouse } from "react-icons/fa";

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
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 '>
          <StatisticBlock
            count={stat.registeredCustomers}
            label='Registered Growers'
            icon={<FaUsers />}
          />
          <StatisticBlock
            count={stat.councilors}
            label='Councilors'
            icon={<FaUsersCog />}
          />
          <StatisticBlock
            count={stat.cooperatives}
            label='Tobacco Grading Centers'
            icon={<FaWarehouse />}
          />
          <StatisticBlock
            count={stat.shops}
            label='Hessian & Tobacco Satellite Depots'
            icon={<FaStore />}
          />
        </div>
    
  </Card>
}

export default StatCard;

import HeaderText from '@/modules/common/header-text';
import { CouncilListDataTable } from './council-list-data-table';

const CouncilList = () => {
  return (
    <div className='w-full flex flex-col items-center gap-16 mb-16'>
      <HeaderText
        title='Council Members'
        subtitle='View the list of Councilors, 1st and 2nd Alternate Councilors'
      />
      <CouncilListDataTable />
    </div>
  );
};

export default CouncilList;

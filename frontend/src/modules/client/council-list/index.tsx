import HeaderText from '@/modules/common/header-text';
import CouncilListDataTable from './council-list-data-table';

const CouncilList = () => {
  return (
    <div className='w-full text-center mb-16'>
      <HeaderText
        title='Council Members'
        subtitle='View the list of councilors & alternate councilors'
      />
      <CouncilListDataTable />
    </div>
  );
};

export default CouncilList;

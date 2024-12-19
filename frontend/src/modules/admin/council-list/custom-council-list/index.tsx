import CouncilListDataTable from '@/modules/client/council-list/council-list-data-table';
import AddNewHeader from '@/modules/common/add-new-header';

const CustomCouncilList = () => {
  return (
    <div className='w-full flex flex-col items-center mb-16'>
      <AddNewHeader
        name='Council List'
        buttonName='New Council List'
      />
      <CouncilListDataTable />
    </div>
  );
};

export default CustomCouncilList;

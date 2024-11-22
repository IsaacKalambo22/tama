import { fetchReportsAndPublications } from '@/lib/api';
import CustomForm from '@/modules/admin/custom-form';
import AddNewHeader from '@/modules/common/add-new-header';

const ReportsAndPublicationsPage = async () => {
  let reports = [];
  try {
    reports = await fetchReportsAndPublications(); // Fetch the data directly
  } catch (error) {
    console.error(
      'Failed to fetch reports:',
      error
    );
    return (
      <div>
        <AddNewHeader
          name='Reports and Publications'
          buttonName='New Report or Publication'
        />
        <p className='text-red-500'>
          Failed to load reports and publications.
        </p>
      </div>
    );
  }

  return (
    <div>
      <AddNewHeader
        name='Reports and Publications'
        buttonName='New Report or Publication'
      />
      <CustomForm files={reports} />
    </div>
  );
};

export default ReportsAndPublicationsPage;

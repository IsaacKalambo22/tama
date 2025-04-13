import { fetchReportsAndPublications } from '@/lib/api';
import AddNewHeader from '@/modules/admin/add-new-header';
import ReportsAndPublicationsList from './reports-publications-list';

const ReportsAndPublications = async () => {
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
          Failed to load reports and documents.
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
      <ReportsAndPublicationsList
        files={reports}
      />
    </div>
  );
};

export default ReportsAndPublications;

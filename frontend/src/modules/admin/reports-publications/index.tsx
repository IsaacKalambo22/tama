import { fetchReportsAndPublications } from '@/lib/api';
import AddNewHeader from '@/modules/common/add-new-header';
import ReportsAndPublicationsList from './reports-publications-list';

const ReportsAndPublications = async () => {
  let forms = [];
  try {
    forms = await fetchReportsAndPublications(); // Fetch the data directly
  } catch (error) {
    console.error(
      'Failed to fetch forms:',
      error
    );
    return (
      <div>
        <AddNewHeader
          name='Forms and Documents'
          buttonName='New Form'
        />
        <p className='text-red-500'>
          Failed to load forms and documents.
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
      <ReportsAndPublicationsList files={forms} />
    </div>
  );
};

export default ReportsAndPublications;

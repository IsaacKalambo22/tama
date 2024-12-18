import { fetchReportsAndPublications } from '@/lib/api';
import HeaderText from '@/modules/common/header-text';
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
      <div className='flex flex-col w-full items-center gap-10 mb-16'>
        <HeaderText
          title='Reports and Publications'
          subtitle='Explore our latest research and insights.'
        />

        <p className='text-red-500'>
          Failed to load forms and documents.
        </p>
      </div>
    );
  }
  return (
    <div className='w-full text-center mb-16'>
      <HeaderText
        title='Reports and Publications'
        subtitle='Explore our latest research and insights.'
      />

      {/* Render the files */}
      {reports?.length > 0 ? (
        <ReportsAndPublicationsList
          files={reports}
        />
      ) : (
        <p className='text-gray-500 text-lg mt-5'>
          No reports & publications are currently
          available.
        </p>
      )}
    </div>
  );
};

export default ReportsAndPublications;

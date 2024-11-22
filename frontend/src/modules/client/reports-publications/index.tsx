import {
  fetchReportsAndPublications,
  FileProps,
} from '@/lib/api';
import FileCard from '@/modules/client/file-card';
import HeaderText from '@/modules/common/header-text';

const ReportsAndPublicationsTemplate =
  async () => {
    let reports = [];
    try {
      reports =
        await fetchReportsAndPublications(); // Fetch the data directly
    } catch (error) {
      console.error(
        'Failed to fetch reports:',
        error
      );
      return (
        <div className='flex flex-col w-full max-w-7xl mx-auto items-center gap-16 mb-16'>
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
      <div className='flex flex-col items-center gap-16 mb-16'>
        <HeaderText
          title='Reports and Publications'
          subtitle='Explore our latest research and insights.'
        />

        {/* Render the files */}
        {reports.length > 0 ? (
          <div className='file-list w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {reports.map((file: FileProps) => (
              <FileCard
                key={file.id}
                file={file}
              />
            ))}
          </div>
        ) : (
          <p className='empty-list'>
            No Reports and Publications
          </p>
        )}
      </div>
    );
  };

export default ReportsAndPublicationsTemplate;

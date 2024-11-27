import {
  fetchFormsAndDocuments,
  FileProps,
} from '@/lib/api';
import HeaderText from '@/modules/common/header-text';
import FileCard from '../file-card';

const Forms = async () => {
  let forms = [];
  try {
    forms = await fetchFormsAndDocuments(); // Fetch the data directly
  } catch (error) {
    console.error(
      'Failed to fetch forms:',
      error
    );
    return (
      <div className='flex flex-col w-full items-center gap-10 mb-16'>
        <HeaderText
          title='Forms and Documents'
          subtitle='Access and download important forms for your needs.'
        />

        <p className='text-red-500'>
          Failed to load forms and documents.
        </p>
      </div>
    );
  }

  return (
    <div className='flex flex-col w-full gap-10 mb-16'>
      <HeaderText
        title='Forms and Documents'
        subtitle='Access and download important forms for your needs.'
      />

      {/* Render the files */}
      {forms.length > 0 ? (
        <div className='file-list w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          {forms.map((file: FileProps) => (
            <FileCard key={file.id} file={file} />
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

export default Forms;

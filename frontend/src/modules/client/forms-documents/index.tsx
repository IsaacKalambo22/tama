import { fetchFormsAndDocuments } from '@/lib/api';
import HeaderText from '@/modules/common/header-text';
import FormsAndDocumentsList from './forms-documents-list';

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
        <FormsAndDocumentsList files={forms} />
      ) : (
        <p className='empty-list'>
          No Reports and Publications
        </p>
      )}
    </div>
  );
};

export default Forms;

import { fetchFormsAndDocuments } from '@/lib/api';
import AddNewHeader from '@/modules/admin/add-new-header';
import FormsAndDocumentsList from './forms-documents-list';

const FormsAndDocuments = async () => {
  let forms = [];
  try {
    forms = await fetchFormsAndDocuments(); // Fetch the data directly
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
        name='Forms and Documents'
        buttonName='New Form'
      />
      <FormsAndDocumentsList files={forms} />
    </div>
  );
};

export default FormsAndDocuments;

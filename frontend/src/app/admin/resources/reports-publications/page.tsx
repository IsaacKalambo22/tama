import CustomForm from '@/modules/admin/custom-form';
import AddNewHeader from '@/modules/common/add-new-header';
import { files } from '../forms/page';

const ReportsAndPublicationsPage = () => {
  return (
    <div>
      <AddNewHeader
        name='Reports and Publications'
        buttonName='New Report or Publication'
      />
      <CustomForm files={files} />;
    </div>
  );
};

export default ReportsAndPublicationsPage;

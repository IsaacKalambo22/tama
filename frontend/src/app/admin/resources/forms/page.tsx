import CustomForm from '@/modules/admin/custom-form';
import { FileCardProps } from '@/modules/client/file-card';
import AddNewHeader from '@/modules/common/add-new-header';

export const files: FileCardProps[] = [
  {
    file: {
      id: 'file1',
      url: '/assets/files/The Ultimate Nextjs Crash Course.pdf',
      type: 'document',
      extension: 'pdf',
      size: 1500000, // 1.5 MB
      name: 'The Ultimate Nextjs Crash Course',
      createdAt: new Date(
        Date.now() - 10000000
      ).toISOString(),
      owner: { fullName: 'John Doe' },
    },
  },
  {
    file: {
      id: 'file2',
      url: '/assets/files/The Ultimate Nextjs Crash Course.pdf',
      type: 'document',
      extension: 'pdf',
      size: 1500000, // 1.5 MB
      name: 'The Ultimate Nextjs Crash Course',
      createdAt: new Date(
        Date.now() - 10000000
      ).toISOString(),
      owner: { fullName: 'John Doe' },
    },
  },
  {
    file: {
      id: 'file2',
      url: '/assets/files/The Ultimate Nextjs Crash Course.pdf',
      type: 'document',
      extension: 'pdf',
      size: 1500000, // 1.5 MB
      name: 'The Ultimate Nextjs Crash Course',
      createdAt: new Date(
        Date.now() - 10000000
      ).toISOString(),
      owner: { fullName: 'John Doe' },
    },
  },
  {
    file: {
      id: 'file2',
      url: '/assets/files/The Ultimate Nextjs Crash Course.pdf',
      type: 'document',
      extension: 'pdf',
      size: 1500000, // 1.5 MB
      name: 'The Ultimate Nextjs Crash Course',
      createdAt: new Date(
        Date.now() - 10000000
      ).toISOString(),
      owner: { fullName: 'John Doe' },
    },
  },
];
const FormsPage = () => {
  return (
    <div>
      <AddNewHeader
        name='Forms and Documents'
        buttonName='New Form'
      />
      <CustomForm files={files} />;
    </div>
  );
};

export default FormsPage;

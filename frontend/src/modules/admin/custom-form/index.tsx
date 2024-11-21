import { FileCardProps } from '@/modules/client/file-card';
import AddNewHeader from '@/modules/common/add-new-header';
import CustomFileCard from '../custom-file-card';

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
];

const CustomForm = () => {
  return (
    <div className='flex flex-col items-center gap-4 mb-16'>
      <AddNewHeader
        name='Forms and Documents'
        buttonName='New Form'
      />
      {files.length > 0 ? (
        <div className='file-list w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5  gap-4'>
          {files.map((file: FileCardProps) => (
            <CustomFileCard
              key={file.file.id}
              file={file.file}
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

export default CustomForm;

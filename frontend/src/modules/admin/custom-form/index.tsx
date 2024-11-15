import { Button } from '@/components/ui/button';
import { FileCardProps } from '@/modules/client/file-card';
import Header from '@/modules/common/header';
import { PlusSquare } from 'lucide-react';
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
  {
    file: {
      id: 'file2',
      url: '/assets/files/file2.pdf',
      type: 'document',
      extension: 'pdf',
      size: 500000, // 500 KB
      name: 'Company_Event',
      createdAt: new Date(
        Date.now() - 5000000
      ).toISOString(),
      owner: { fullName: 'Jane Smith' },
    },
  },
  {
    file: {
      id: 'file3',
      url: '/assets/files/file3.pdf',
      type: 'document',
      extension: 'csv',
      size: 30000000, // 30 MB
      name: 'Product_Launch',
      createdAt: new Date(
        Date.now() - 15000000
      ).toISOString(),
      owner: { fullName: 'Alex Johnson' },
    },
  },
  {
    file: {
      id: 'file4',
      url: '/assets/files/file_4.mp3',
      type: 'document',
      extension: 'doc',
      size: 4000000, // 4 MB
      name: 'Theme_Song',
      createdAt: new Date(
        Date.now() - 7000000
      ).toISOString(),
      owner: { fullName: 'Chris Lee' },
    },
  },
  {
    file: {
      id: 'file5',
      url: '/assets/files/file_5.xlsx',
      type: 'document',
      extension: 'xlsx',
      size: 250000, // 250 KB
      name: 'Budget_2024',
      createdAt: new Date(
        Date.now() - 12000000
      ).toISOString(),
      owner: { fullName: 'Morgan Green' },
    },
  },
  {
    file: {
      id: 'file6',
      url: '/assets/files/file_6.svg',
      type: 'document',
      extension: 'docx',
      size: 200000, // 200 KB
      name: 'Logo_Variant',
      createdAt: new Date(
        Date.now() - 9000000
      ).toISOString(),
      owner: { fullName: 'Taylor Brown' },
    },
  },
  {
    file: {
      id: 'file7',
      url: '/assets/files/file_7.mov',
      type: 'video',
      extension: 'mov',
      size: 50000000, // 50 MB
      name: 'Tutorial_Video',
      createdAt: new Date(
        Date.now() - 20000000
      ).toISOString(),
      owner: { fullName: 'Jordan Gray' },
    },
  },
  {
    file: {
      id: 'file8',
      url: '/assets/files/file_8.docx',
      type: 'document',
      extension: 'docx',
      size: 800000, // 800 KB
      name: 'Project_Plan',
      createdAt: new Date(
        Date.now() - 2500000
      ).toISOString(),
      owner: { fullName: 'Jamie White' },
    },
  },
];

const CustomForm = () => {
  return (
    <div className='flex flex-col items-center gap-4 mb-16'>
      <Header
        name='Forms and Documents'
        buttonComponent={
          <Button>
            <PlusSquare className='h-4 w-4' /> New
            Form
          </Button>
        }
      />

      {/* Render the files */}
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

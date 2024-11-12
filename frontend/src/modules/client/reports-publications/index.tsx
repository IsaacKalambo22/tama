import HeaderText from '@/modules/common/header-text';
import FileCard, {
  FileCardProps,
} from './file-card';

const ReportsAndPublicationsTemplate = () => {
  const files: FileCardProps[] = [
    {
      file: {
        url: '/assets/files/The Ultimate Nextjs Crash Course.pdf',
        type: 'document',
        extension: 'pdf',
        size: 1500000, // 1.5 MB
        name: 'The Ultimate Nextjs Crash Course',
        $createdAt: new Date(
          Date.now() - 10000000
        ).toISOString(),
        owner: { fullName: 'John Doe' },
      },
    },
    {
      file: {
        url: '/assets/files/file2.pdf',
        type: 'document',
        extension: 'pdf',
        size: 500000, // 500 KB
        name: 'Company_Event',
        $createdAt: new Date(
          Date.now() - 5000000
        ).toISOString(),
        owner: { fullName: 'Jane Smith' },
      },
    },
    {
      file: {
        url: '/assets/files/file3.pdf',
        type: 'document',
        extension: 'csv',
        size: 30000000, // 30 MB
        name: 'Product_Launch',
        $createdAt: new Date(
          Date.now() - 15000000
        ).toISOString(),
        owner: { fullName: 'Alex Johnson' },
      },
    },
    {
      file: {
        url: '/assets/files/file_4.mp3',
        type: 'document',
        extension: 'doc',
        size: 4000000, // 4 MB
        name: 'Theme_Song',
        $createdAt: new Date(
          Date.now() - 7000000
        ).toISOString(),
        owner: { fullName: 'Chris Lee' },
      },
    },
    {
      file: {
        url: '/assets/files/file_5.xlsx',
        type: 'document',
        extension: 'xlsx',
        size: 250000, // 250 KB
        name: 'Budget_2024',
        $createdAt: new Date(
          Date.now() - 12000000
        ).toISOString(),
        owner: { fullName: 'Morgan Green' },
      },
    },
    {
      file: {
        url: '/assets/files/file_6.svg',
        type: 'document',
        extension: 'docx',
        size: 200000, // 200 KB
        name: 'Logo_Variant',
        $createdAt: new Date(
          Date.now() - 9000000
        ).toISOString(),
        owner: { fullName: 'Taylor Brown' },
      },
    },
    {
      file: {
        url: '/assets/files/file_7.mov',
        type: 'video',
        extension: 'mov',
        size: 50000000, // 50 MB
        name: 'Tutorial_Video',
        $createdAt: new Date(
          Date.now() - 20000000
        ).toISOString(),
        owner: { fullName: 'Jordan Gray' },
      },
    },
    {
      file: {
        url: '/assets/files/file_8.docx',
        type: 'document',
        extension: 'docx',
        size: 800000, // 800 KB
        name: 'Project_Plan',
        $createdAt: new Date(
          Date.now() - 2500000
        ).toISOString(),
        owner: { fullName: 'Jamie White' },
      },
    },
  ];

  return (
    <div className='flex flex-col items-center gap-16 mb-16'>
      <HeaderText
        title='Reports and Publications'
        subtitle='Explore our latest research and insights.'
      />

      {/* Render the files */}
      {files.length > 0 ? (
        <section className='file-list grid grid-cols-1 md:grid-cols-5 lg:grid-cols-6 gap-4'>
          {files.map((file: FileCardProps) => (
            <FileCard
              key={file.file.url}
              file={file.file}
            />
          ))}
        </section>
      ) : (
        <p className='empty-list'>
          No files uploaded
        </p>
      )}
    </div>
  );
};

export default ReportsAndPublicationsTemplate;

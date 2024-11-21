import { FileCardProps } from '@/modules/client/file-card';
import CustomFileCard from '../custom-file-card';

type Props = {
  files: FileCardProps[];
};

const CustomForm = ({ files }: Props) => {
  return (
    <div className='flex flex-col items-center gap-4 mb-16'>
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

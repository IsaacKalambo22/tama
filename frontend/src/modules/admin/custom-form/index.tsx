import { FileProps } from '@/lib/api';
import CustomFileCard from '../custom-file-card';

type Props = {
  files: FileProps[];
};

const CustomForm = ({ files }: Props) => {
  return (
    <div className='flex flex-col items-center mb-16'>
      {files.length > 0 ? (
        <div className='file-list w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5  gap-8'>
          {files.map((file: FileProps) => (
            <CustomFileCard
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

export default CustomForm;

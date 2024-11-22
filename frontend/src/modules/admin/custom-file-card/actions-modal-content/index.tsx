import { FileProps } from '@/lib/api';
import {
  convertFileSize,
  formatDateTime,
  getFileType,
} from '@/lib/utils';
import FormattedDateTime from '@/modules/common/formatted-date-time';
import Thumbnail from '@/modules/common/thumbnail';

type Props = {
  file: FileProps;
};
const ImageThumbnail = ({ file }: Props) => {
  const fileProps = getFileType(file.fileUrl);

  return (
    <div className='file-details-thumbnail'>
      <Thumbnail
        type={fileProps.type}
        extension={fileProps.extension}
        url={file.fileUrl}
      />
      <div className='flex flex-col'>
        <p className='subtitle-2 mb-1'>
          {file.filename}
        </p>
        <FormattedDateTime
          date={file.createdAt}
          className='caption'
        />
      </div>
    </div>
  );
};

const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div className='flex'>
    <p className='file-details-label text-left'>
      {label}
    </p>
    <p className='file-details-value text-left'>
      {value}
    </p>
  </div>
);

export const FileDetails = ({ file }: Props) => {
  const fileProps = getFileType(file.fileUrl);

  return (
    <>
      <ImageThumbnail file={file} />
      <div className='space-y-4 px-2 pt-2'>
        <DetailRow
          label='Format:'
          value={fileProps.extension}
        />
        <DetailRow
          label='Size:'
          value={convertFileSize(file.size)}
        />

        <DetailRow
          label='Last edit:'
          value={formatDateTime(file.updatedAt)}
        />
      </div>
    </>
  );
};

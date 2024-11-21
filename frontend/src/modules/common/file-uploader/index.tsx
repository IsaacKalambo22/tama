'use client';

import Image from 'next/image';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

import {
  convertFileToUrl,
  getFileType,
} from '@/lib/utils';
import Thumbnail from '../thumbnail';

type FileUploaderProps = {
  files: File[] | undefined;
  onChange: (files: File[]) => void;
};

export const FileUploader = ({
  files,
  onChange,
}: FileUploaderProps) => {
  const handleRemoveFile = (
    e: React.MouseEvent<
      HTMLImageElement,
      MouseEvent
    >,
    fileName: string
  ) => {
    e.stopPropagation();
    onChange((prevFiles) =>
      prevFiles.filter(
        (file) => file.name !== fileName
      )
    );
  };
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onChange(acceptedFiles);
    },
    []
  );

  const { getRootProps, getInputProps } =
    useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className='file-upload'
    >
      <input {...getInputProps()} />
      {files && files?.length > 0 ? (
        <>
          {files.length > 0 && (
            <ul className='uploader-preview-list'>
              {/* <h4 className='h4 text-light-100'>
                Uploading
              </h4> */}

              {files.map((file, index) => {
                const { type, extension } =
                  getFileType(file.name);

                return (
                  <li
                    key={`${file.name}-${index}`}
                    className='uploader-preview-item'
                  >
                    <div className='flex items-center gap-2'>
                      <Thumbnail
                        type={type}
                        extension={extension}
                        url={convertFileToUrl(
                          file
                        )}
                      />

                      <div className='preview-item-name'>
                        {file.name}
                      </div>
                    </div>

                    <Image
                      src='/assets/icons/remove.svg'
                      width={24}
                      height={24}
                      alt='Remove'
                      onClick={(e) =>
                        handleRemoveFile(
                          e,
                          file.name
                        )
                      }
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </>
      ) : (
        <>
          <Image
            src='/assets/icons/upload.svg'
            width={40}
            height={40}
            alt='upload'
          />
          <div className='file-upload_label'>
            <p className='text-14-regular '>
              <span className='text-green-500'>
                Click to upload{' '}
              </span>
              or drag and drop your file
            </p>
          </div>
        </>
      )}
    </div>
  );
};

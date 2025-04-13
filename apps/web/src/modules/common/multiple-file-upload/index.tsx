'use client';

import { Button } from '@/components/ui/button';
import {
  convertFileToUrl,
  getFileType,
} from '@/lib/utils';
import {
  CheckCircleIcon,
  LucideFileWarning,
  Trash2Icon,
  UploadCloudIcon,
} from 'lucide-react';
import * as React from 'react';
import {
  DropzoneOptions,
  useDropzone,
} from 'react-dropzone';
import { twMerge } from 'tailwind-merge';
import Thumbnail from '../thumbnail';

const variants = {
  base: 'relative rounded-md h-[6rem] p-4 w-full flex justify-center items-center flex-col cursor-pointer border border-[2.5px] border-dashed border-gray-400 transition-colors duration-200 ease-in-out',
  active: 'border border-[2.5px]',
  disabled:
    'bg-gray-700 border-gray-900/20 cursor-default pointer-events-none bg-opacity-30',
  accept:
    'border border-[2.5px] border-blue-900 bg-blue-900 bg-opacity-10',
  reject:
    'border border-[2.5px] border-red-600 bg-red-600 bg-opacity-10',
};

export type FileState = {
  file: File;
  key: string; // Used to identify the file in progress callback
  progress:
    | 'PENDING'
    | 'COMPLETE'
    | 'ERROR'
    | number;
};

type InputProps = {
  className?: string;
  value?: FileState[];
  onChange?: (
    files: FileState[]
  ) => void | Promise<void>;
  onFilesAdded?: (
    addedFiles: FileState[]
  ) => void | Promise<void>;
  disabled?: boolean;
  fileType?: string | string[]; // Acceptable file types
  maxFiles?: number; // Maximum number of files
  dropzoneOptions?: Omit<
    DropzoneOptions,
    'disabled' | 'accept' | 'maxFiles'
  >;
};

// MIME types for audio, image, and video
const ACCEPTED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml', // Image files
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
  'audio/webm',
  'audio/flac', // Audio files
  'video/mp4',
  'video/webm',
  'video/ogg', // Video files
];

const ERROR_MESSAGES = {
  fileTooLarge(maxSize: number) {
    return `The file is too large. Max size is ${formatFileSize(
      maxSize
    )}.`;
  },
  fileInvalidType() {
    return 'Invalid file type.';
  },
  tooManyFiles(maxFiles: number) {
    return `You can only add ${maxFiles} file(s).`;
  },
  fileNotSupported() {
    return 'The file is not supported.';
  },
};

const MultiFileDropzone = React.forwardRef<
  HTMLInputElement,
  InputProps
>(
  (
    {
      fileType = ACCEPTED_FILE_TYPES,
      maxFiles,
      dropzoneOptions,
      value,
      className,
      disabled,
      onFilesAdded,
      onChange,
    },
    ref
  ) => {
    const [customError, setCustomError] =
      React.useState<string>();

    if (maxFiles && value?.length) {
      disabled =
        disabled ?? value.length >= maxFiles;
    }

    // Dropzone configuration
    const {
      getRootProps,
      getInputProps,
      fileRejections,
      isFocused,
      isDragAccept,
      isDragReject,
    } = useDropzone({
      disabled,
      accept: Array.isArray(fileType)
        ? fileType.reduce((acc, type) => {
            acc[type] = [];
            return acc;
          }, {} as Record<string, string[]>)
        : { [fileType]: [] }, // Enforce file type restrictions
      maxFiles, // Enforce file limit
      onDrop: (acceptedFiles) => {
        setCustomError(undefined);

        if (
          maxFiles &&
          (value?.length ?? 0) +
            acceptedFiles.length >
            maxFiles
        ) {
          setCustomError(
            ERROR_MESSAGES.tooManyFiles(maxFiles)
          );
          return;
        }

        const addedFiles =
          acceptedFiles.map<FileState>(
            (file) => ({
              file,
              key: Math.random()
                .toString(36)
                .slice(2),
              progress: 'PENDING',
            })
          );

        void onFilesAdded?.(addedFiles);
        void onChange?.([
          ...(value ?? []),
          ...addedFiles,
        ]);
      },
      ...dropzoneOptions,
    });

    // Styling
    const dropZoneClassName = React.useMemo(
      () =>
        twMerge(
          variants.base,
          isFocused && variants.active,
          disabled && variants.disabled,
          (isDragReject ?? fileRejections[0]) &&
            variants.reject,
          isDragAccept && variants.accept,
          className
        ).trim(),
      [
        isFocused,
        fileRejections,
        isDragAccept,
        isDragReject,
        disabled,
        className,
      ]
    );

    // Error validation messages
    const errorMessage = React.useMemo(() => {
      if (fileRejections[0]) {
        const { errors } = fileRejections[0];

        if (
          errors[0]?.code === 'file-too-large'
        ) {
          return ERROR_MESSAGES.fileTooLarge(
            dropzoneOptions?.maxSize ?? 0
          );
        } else if (
          errors[0]?.code === 'file-invalid-type'
        ) {
          return ERROR_MESSAGES.fileInvalidType();
        } else if (
          errors[0]?.code === 'too-many-files'
        ) {
          return ERROR_MESSAGES.tooManyFiles(
            maxFiles ?? 0
          );
        } else {
          return ERROR_MESSAGES.fileNotSupported();
        }
      }
      return undefined;
    }, [
      fileRejections,
      dropzoneOptions,
      maxFiles,
    ]);

    return (
      <div className='w-full'>
        <div className='flex flex-col gap-2 w-full'>
          {value &&
            value?.length <
              (maxFiles ?? Infinity) && (
              <div className='w-full'>
                {/* Main File Input */}
                <div
                  {...getRootProps({
                    className: dropZoneClassName,
                  })}
                >
                  <input
                    ref={ref}
                    {...getInputProps()}
                  />
                  <div className='w-full flex flex-col items-center justify-center text-xs text-gray-400'>
                    <UploadCloudIcon className='mb-1 h-7 w-7' />
                    <div className='text-gray-400'>
                      Drag & drop or click to
                      upload
                    </div>
                  </div>
                </div>

                {/* Error Text */}
                <div className='mt-1 text-xs text-red-900'>
                  {customError ?? errorMessage}
                </div>
              </div>
            )}
          {/* Selected Files */}
          {value?.map(({ file, progress }, i) => {
            const { type, extension } =
              getFileType(file.name);
            return (
              <div
                key={i}
                className='flex h-24 w-full flex-col justify-center rounded border border-solid border-gray-500 px-4 py-2'
              >
                <div className='flex items-center gap-2 text-gray-900'>
                  <Thumbnail
                    type={type}
                    extension={extension}
                    url={convertFileToUrl(file)}
                    imageClassName='h-10 w-10'
                  />
                  <div className='min-w-0 text-sm'>
                    <div className='overflow-hidden overflow-ellipsis gray-900 space-nowrap line-clamp-1'>
                      {file.name}
                    </div>
                    <div className='text-xs text-gray-900'>
                      {formatFileSize(file.size)}
                    </div>
                  </div>
                  <div className='grow' />
                  <div className='flex w-12 justify-end text-xs'>
                    {progress === 'PENDING' ? (
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => {
                          void onChange?.(
                            value.filter(
                              (_, index) =>
                                index !== i
                            )
                          );
                        }}
                      >
                        <Trash2Icon className='shrink-0 h-4 w-4' />
                      </Button>
                    ) : progress === 'ERROR' ? (
                      <LucideFileWarning className='shrink-0 text-red-400' />
                    ) : progress !==
                      'COMPLETE' ? (
                      <div>
                        {Math.round(progress)}%
                      </div>
                    ) : (
                      <CheckCircleIcon className='shrink-0' />
                    )}
                  </div>
                </div>
                {typeof progress === 'number' && (
                  <div className='relative h-0'>
                    <div className='absolute top-1 h-[0.3rem] w-full overflow-clip rounded-full bg-gray-500'>
                      <div
                        className='h-full bg-green-500 transition-all duration-300 ease-in-out'
                        style={{
                          width: progress
                            ? `${progress}%`
                            : '0%',
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);
MultiFileDropzone.displayName =
  'MultiFileDropzone';

function formatFileSize(bytes?: number) {
  if (!bytes) return '0 Bytes';
  bytes = Number(bytes);
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = 2;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(
    Math.log(bytes) / Math.log(k)
  );
  return `${parseFloat(
    (bytes / Math.pow(k, i)).toFixed(dm)
  )} ${sizes[i]}`;
}

export { MultiFileDropzone };

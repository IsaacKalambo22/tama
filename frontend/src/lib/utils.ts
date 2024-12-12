import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { FileProps } from './api';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL;

export const formatContent = (
  content: string
): string[] => {
  const sentences = content
    .split(/(?<=\.)\s+/) // Split content into sentences after periods.
    .map((sentence) => sentence.trim());
  const chunks = [];
  for (let i = 0; i < sentences.length; i += 5) {
    chunks.push(
      sentences.slice(i, i + 5).join(' ')
    ); // Group 5 sentences together.
  }
  return chunks;
};
export function formatDate(date: string) {
  return new Date(date).toLocaleDateString(
    'en-US',
    {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }
  );
}

export const formatCount = (
  count: string | number
) => {
  const number =
    typeof count === 'string'
      ? parseInt(count, 10)
      : count;
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(number);
};
export function parseServerActionResponse<T>(
  response: T
) {
  return JSON.parse(JSON.stringify(response));
}

export const parseStringify = (value: unknown) =>
  JSON.parse(JSON.stringify(value));

export const convertFileToUrl = (file: File) =>
  URL.createObjectURL(file);

export const convertFileSize = (
  sizeInBytes: number,
  digits?: number
) => {
  if (sizeInBytes < 1024) {
    return sizeInBytes + ' Bytes'; // Less than 1 KB, show in Bytes
  } else if (sizeInBytes < 1024 * 1024) {
    const sizeInKB = sizeInBytes / 1024;
    return sizeInKB.toFixed(digits || 1) + ' KB'; // Less than 1 MB, show in KB
  } else if (sizeInBytes < 1024 * 1024 * 1024) {
    const sizeInMB = sizeInBytes / (1024 * 1024);
    return sizeInMB.toFixed(digits || 1) + ' MB'; // Less than 1 GB, show in MB
  } else {
    const sizeInGB =
      sizeInBytes / (1024 * 1024 * 1024);
    return sizeInGB.toFixed(digits || 1) + ' GB'; // 1 GB or more, show in GB
  }
};

export const getFileType = (fileName: string) => {
  const extension = fileName
    .split('.')
    .pop()
    ?.toLowerCase();

  if (!extension)
    return { type: 'other', extension: '' };

  const documentExtensions = [
    'pdf',
    'doc',
    'docx',
    'txt',
    'xls',
    'xlsx',
    'csv',
    'rtf',
    'ods',
    'ppt',
    'odp',
    'md',
    'html',
    'htm',
    'epub',
    'pages',
    'fig',
    'psd',
    'ai',
    'indd',
    'xd',
    'sketch',
    'afdesign',
    'afphoto',
    'afphoto',
  ];
  const imageExtensions = [
    'jpg',
    'jpeg',
    'png',
    'gif',
    'bmp',
    'svg',
    'webp',
  ];
  const videoExtensions = [
    'mp4',
    'avi',
    'mov',
    'mkv',
    'webm',
  ];
  const audioExtensions = [
    'mp3',
    'wav',
    'ogg',
    'flac',
  ];

  if (documentExtensions.includes(extension))
    return { type: 'document', extension };
  if (imageExtensions.includes(extension))
    return { type: 'image', extension };
  if (videoExtensions.includes(extension))
    return { type: 'video', extension };
  if (audioExtensions.includes(extension))
    return { type: 'audio', extension };

  return { type: 'other', extension };
};

export const formatDateTime = (
  isoString: string | null | undefined
) => {
  if (!isoString) return '—';

  const date = new Date(isoString);

  // Get hours and adjust for 12-hour format
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? 'pm' : 'am';

  // Convert hours to 12-hour format
  hours = hours % 12 || 12;

  // Format the time and date parts
  const time = `${hours}:${minutes
    .toString()
    .padStart(2, '0')}${period}`;
  const day = date.getDate();
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const month = monthNames[date.getMonth()];

  return `${time}, ${day} ${month}`;
};

export const getFileIcon = (
  extension: string | undefined,
  type: File | string
) => {
  switch (extension) {
    // Document
    case 'pdf':
      return '/assets/icons/file-pdf.svg';
    case 'doc':
      return '/assets/icons/file-doc.svg';
    case 'docx':
      return '/assets/icons/file-docx.svg';
    case 'csv':
      return '/assets/icons/file-csv.svg';
    case 'txt':
      return '/assets/icons/file-txt.svg';
    case 'xls':
    case 'xlsx':
      return '/assets/icons/file-document.svg';
    // Image
    case 'svg':
      return '/assets/icons/file-image.svg';
    // Video
    case 'mkv':
    case 'mov':
    case 'avi':
    case 'wmv':
    case 'mp4':
    case 'flv':
    case 'webm':
    case 'm4v':
    case '3gp':
      return '/assets/icons/file-video.svg';
    // Audio
    case 'mp3':
    case 'mpeg':
    case 'wav':
    case 'aac':
    case 'flac':
    case 'ogg':
    case 'wma':
    case 'm4a':
    case 'aiff':
    case 'alac':
      return '/assets/icons/file-audio.svg';

    default:
      switch (type) {
        case 'image':
          return '/assets/icons/file-image.svg';
        case 'document':
          return '/assets/icons/file-document.svg';
        case 'video':
          return '/assets/icons/file-video.svg';
        case 'audio':
          return '/assets/icons/file-audio.svg';
        default:
          return '/assets/icons/file-other.svg';
      }
  }
};

export const constructFileUrl = (
  filename: string
) => {
  return `${BASE_URL}/uploads/${filename}`;
};

export const constructDownloadUrl = (
  fileName: string
) => {
  // Reference the file directly in the local assets directory
  return `/assets/files/${fileName}`;
};

export const handleDownload = (
  file: FileProps
) => {
  const downloadLink =
    document.createElement('a');

  downloadLink.href = constructFileUrl(
    file.fileUrl
  );
  downloadLink.download = file.fileUrl; // Set the combined file name for download
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
};

export const getFileTypesParams = (
  type: string
) => {
  switch (type) {
    case 'documents':
      return ['document'];
    case 'images':
      return ['image'];
    case 'media':
      return ['video', 'audio'];
    case 'others':
      return ['other'];
    default:
      return ['document'];
  }
};

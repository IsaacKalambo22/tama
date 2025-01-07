'use server';

import { auth } from '@/auth';
import {
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const allowedFileTypes = [
  'image/jpeg',
  'image/png',
  'image/jpg',
  'video/mp4',
  'video/quicktime',
  'application/pdf', // PDF
  'application/msword', // DOC
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
  'text/plain', // TXT
  'application/vnd.ms-excel', // XLS
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
  'text/csv', // CSV
  'application/rtf', // RTF
  'application/vnd.oasis.opendocument.spreadsheet', // ODS
  'application/vnd.ms-powerpoint', // PPT
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // PPTX
  'text/markdown', // MD
  'text/html', // HTML
  'text/html', // HTM
  'application/epub+zip', // EPUB
  'application/vnd.apple.pages', // Pages
  'application/fig', // FIG (Figma)
  'application/postscript', // PS
  'application/illustrator', // AI
  'application/vnd.adobe.indesign', // INDD
  'application/vnd.adobe.xd', // XD
  'application/x-sketch', // Sketch
  'application/x-photoshop', // PSD
  'application/x-afdesign', // AFDesign
  'application/x-afphoto', // AFPhoto
  'image/gif', // GIF
  'image/bmp', // BMP
  'image/svg+xml', // SVG
  'image/webp', // WEBP
  'video/avi', // AVI
  'video/mkv', // MKV
  'video/webm', // WEBM
  'audio/mp3', // MP3
  'audio/wav', // WAV
  'audio/ogg', // OGG
  'audio/flac', // FLAC
];

const maxFileSize = 1048576 * 1000; // 1 MB

const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey:
      process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const generateFileName = (length = 32) => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(
      Math.floor(Math.random() * chars.length)
    );
  }
  return result;
};

type SignedURLResponse = Promise<
  | {
      failure?: undefined;
      success: { url: string };
    }
  | { failure: string; success?: undefined }
>;

type GetSignedURLParams = {
  fileType: string;
  fileSize: number;
  checksum: string;
};
export const getSignedURL = async ({
  fileType,
  fileSize,
  checksum,
}: GetSignedURLParams): Promise<SignedURLResponse> => {
  try {
    const session = await auth();

    if (!session) {
      return { failure: 'not authenticated' };
    }

    if (!allowedFileTypes.includes(fileType)) {
      return { failure: 'File type not allowed' };
    }

    if (fileSize > maxFileSize) {
      return { failure: 'File size too large' };
    }

    const fileName = generateFileName();

    // Modify the key to include the 'tama' folder path
    const folderPath = 'tama'; // This is the folder within your S3 bucket
    const s3Key = `${folderPath}/${fileName}`; // Full path in S3: tama/filename

    const putObjectCommand = new PutObjectCommand(
      {
        Bucket: process.env.AWS_BUCKET_NAME!, // Your S3 bucket name
        Key: s3Key, // The object key that includes the folder path
        ContentType: fileType,
        ContentLength: fileSize,
        ChecksumSHA256: checksum,
      }
    );
    const url = await getSignedUrl(
      s3Client,
      putObjectCommand,
      { expiresIn: 180 } // 60 seconds
    );

    return { success: { url: url } }; // Ensure the value is correctly returned
  } catch (error) {
    console.error(
      'Error generating signed URL:',
      error
    );
    return { failure: 'An error occurred' };
  }
};

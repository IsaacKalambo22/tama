'use server';
import { auth } from '@/auth';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import config from './config';

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
  region: config.env.aws.bucketRegion,
  credentials: {
    accessKeyId: config.env.aws.accessKey,
    secretAccessKey:
      config.env.aws.secretAccessKey,
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
  fileName: string;
};
export const getSignedURL = async ({
  fileType,
  fileSize,
  checksum,
  fileName,
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

    const uniqueFileName = uuidv4();
    const sanitizedFileName = fileName.replace(
      /\s*-\s*|\s+/g,
      '-'
    );
    const folderPath = config.env.aws.folderPath; // This is the folder within your S3 bucket
    const s3Key = `${folderPath}/${uniqueFileName}-${sanitizedFileName}`;

    const putObjectCommand = new PutObjectCommand(
      {
        Bucket: config.env.aws.bucketName, // Your S3 bucket name
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
export const removeFromS3 = async (
  urls: string | string[]
) => {
  try {
    const session = await auth();

    if (!session) {
      return {
        success: false,
        error: 'Not signed in',
      };
    }

    const bucketName = config.env.aws.bucketName;

    // Ensure urls is an array
    const urlList = Array.isArray(urls)
      ? urls
      : [urls];

    const deleteResponses = await Promise.all(
      urlList.map(async (url) => {
        try {
          const key = url.split('.net/')[1]; // Extract everything after the domain

          if (!key) {
            throw new Error(
              `Invalid URL format: ${url}`
            );
          }

          console.log(
            'Attempting to delete file:',
            key
          );
          console.log({ url });

          const deleteParams = {
            Bucket: bucketName,
            Key: key,
          };

          const response = await s3Client.send(
            new DeleteObjectCommand(deleteParams)
          );

          console.log(
            `Deleted: ${key}`,
            response
          );
          return { url, success: true };
        } catch (error) {
          console.error(
            `Error deleting ${url}:`,
            error
          );
          return {
            url,
            success: false,
            error:
              error instanceof Error
                ? error.message
                : error,
          };
        }
      })
    );

    return {
      success: deleteResponses.every(
        (res) => res.success
      ),
      details: deleteResponses,
    };
  } catch (error) {
    console.error(
      'Unknown error occurred while deleting from S3:',
      error
    );
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : error,
    };
  }
};

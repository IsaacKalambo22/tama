'use server';

import { auth } from '@/auth';
import {
  BASE_URL,
  parseServerActionResponse,
} from '@/lib/utils';
import {
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { revalidatePath } from 'next/cache';

export const serverAction = async (
  endpoint: string,
  method:
    | 'GET'
    | 'POST'
    | 'PATCH'
    | 'PUT'
    | 'DELETE',
  payload: Record<string, any> | null = null,
  revalidatePaths: string[] = []
) => {
  try {
    const session = await auth();

    if (!session) {
      return parseServerActionResponse({
        error: 'Not signed in',
        status: 'ERROR',
      });
    }

    const token = session.accessToken;
    const options: RequestInit = {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    if (payload) {
      options.body = JSON.stringify(payload);
    }

    const response = await fetch(
      `${BASE_URL}/${endpoint}`,
      options
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        'Server action failed:',
        errorText
      );
      throw new Error(
        `Server action failed. Status: ${response.status}, Error: ${errorText}`
      );
    }

    const result = await response.json();

    // Revalidate specified paths
    for (const path of revalidatePaths) {
      revalidatePath(path);
    }

    return parseServerActionResponse({
      ...result,
      error: '',
      status: 'SUCCESS',
    });
  } catch (error) {
    console.error(
      'Error during server action:',
      error
    );
    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: 'ERROR',
    });
  }
};

// EVENTS SERVER ACTIONS
export const createEvent = async (
  payload: object,
  fullPath: string,
  pathWithoutAdmin: string,
  layout: string
) => {
  return await serverAction(
    'events',
    'POST',
    payload,
    [fullPath, layout, pathWithoutAdmin] // Revalidate paths
  );
};

export const updateEvent = async (
  payload: object,
  eventId: string,
  fullPath: string,
  pathWithoutAdmin: string
) => {
  return await serverAction(
    `events/${eventId}`,
    'PATCH',
    payload,
    [fullPath, pathWithoutAdmin]
  );
};

export const deleteEvent = async (
  id: string,
  fullPath: string,
  pathWithoutAdmin: string,
  layout: string
) => {
  return await serverAction(
    `events/${id}`,
    'DELETE',
    null,
    [fullPath, pathWithoutAdmin, layout]
  );
};

// USERS SERVER ACTIONS
export const createUser = async (
  payload: object,
  fullPath: string,
  layout: string
) => {
  return await serverAction(
    'users',
    'POST',
    payload,
    [fullPath, layout] // Revalidate paths
  );
};

export const updateUser = async (
  payload: object,
  userId: string,
  fullPath: string
) => {
  return await serverAction(
    `users/${userId}`,
    'PATCH',
    payload,
    [fullPath]
  );
};

export const deleteUser = async (
  id: string,
  fullPath: string,
  layout: string
) => {
  return await serverAction(
    `users/${id}`,
    'DELETE',
    null,
    [fullPath, layout]
  );
};
// COUNCIL LISTS SERVER ACTIONS
export const createCouncilList = async (
  payload: object,
  fullPath: string,
  pathWithoutAdmin: string,
  layout: string
) => {
  return await serverAction(
    'council-lists',
    'POST',
    payload,
    [fullPath, layout, pathWithoutAdmin] // Revalidate paths
  );
};

export const updateCouncilList = async (
  payload: object,
  councilListId: string,
  fullPath: string,
  pathWithoutAdmin: string
) => {
  return await serverAction(
    `council-lists/${councilListId}`,
    'PATCH',
    payload,
    [fullPath, pathWithoutAdmin]
  );
};

export const deleteCouncilList = async (
  id: string,
  fullPath: string,
  pathWithoutAdmin: string,
  layout: string
) => {
  return await serverAction(
    `council-lists/${id}`,
    'DELETE',
    null,
    [fullPath, pathWithoutAdmin, layout]
  );
};

// SHOPS SERVER ACTIONS
export const createShop = async (
  payload: object,
  fullPath: string,
  pathWithoutAdmin: string,
  layout: string
) => {
  return await serverAction(
    'shops',
    'POST',
    payload,
    [fullPath, layout, pathWithoutAdmin] // Revalidate paths
  );
};

export const updateShop = async (
  payload: object,
  shopId: string,
  fullPath: string,
  pathWithoutAdmin: string
) => {
  return await serverAction(
    `shops/${shopId}`,
    'PATCH',
    payload,
    [fullPath, pathWithoutAdmin]
  );
};

export const deleteShop = async (
  id: string,
  fullPath: string,
  pathWithoutAdmin: string,
  layout: string
) => {
  return await serverAction(
    `shops/${id}`,
    'DELETE',
    null,
    [fullPath, pathWithoutAdmin, layout]
  );
};
// VACANCIES SERVER ACTIONS
export const createVacancy = async (
  payload: object,
  fullPath: string,
  pathWithoutAdmin: string,
  layout: string
) => {
  return await serverAction(
    'vacancies',
    'POST',
    payload,
    [fullPath, layout, pathWithoutAdmin] // Revalidate paths
  );
};

export const updateVacancy = async (
  payload: object,
  vacancyId: string,
  fullPath: string,
  pathWithoutAdmin: string
) => {
  return await serverAction(
    `vacancies/${vacancyId}`,
    'PATCH',
    payload,
    [fullPath, pathWithoutAdmin]
  );
};

export const deleteVacancy = async (
  id: string,
  fullPath: string,
  pathWithoutAdmin: string,
  layout: string
) => {
  return await serverAction(
    `vacancies/${id}`,
    'DELETE',
    null,
    [fullPath, pathWithoutAdmin, layout]
  );
};

// FORMS & DOCUMENTS SERVER ACTIONS
export const createForm = async (
  payload: object,
  fullPath: string,
  pathWithoutAdmin: string,
  layout: string
) => {
  return await serverAction(
    'forms',
    'POST',
    payload,
    [fullPath, layout, pathWithoutAdmin] // Revalidate paths
  );
};

export const updateForm = async (
  payload: object,
  formId: string,
  fullPath: string,
  pathWithoutAdmin: string
) => {
  return await serverAction(
    `forms/${formId}`,
    'PATCH',
    payload,
    [fullPath, pathWithoutAdmin]
  );
};

export const deleteForm = async (
  id: string,
  fullPath: string,
  pathWithoutAdmin: string,
  layout: string
) => {
  return await serverAction(
    `forms/${id}`,
    'DELETE',
    null,
    [fullPath, pathWithoutAdmin, layout]
  );
};

// REPORTS & PUBLICATIONS SERVER ACTIONS
export const createReportAndPublication = async (
  payload: object,
  fullPath: string,
  pathWithoutAdmin: string,
  layout: string
) => {
  return await serverAction(
    'reports-publication',
    'POST',
    payload,
    [fullPath, layout, pathWithoutAdmin] // Revalidate paths
  );
};

export const updateReportAndPublication = async (
  payload: object,
  reportId: string,
  fullPath: string,
  pathWithoutAdmin: string
) => {
  return await serverAction(
    `reports-publication/${reportId}`,
    'PATCH',
    payload,
    [fullPath, pathWithoutAdmin]
  );
};

export const deleteReportAndPublication = async (
  id: string,
  fullPath: string,
  pathWithoutAdmin: string,
  layout: string
) => {
  return await serverAction(
    `reports-publication/${id}`,
    'DELETE',
    null,
    [fullPath, pathWithoutAdmin, layout]
  );
};

// NEWS SERVER ACTIONS
export const createNews = async (
  payload: object,
  fullPath: string,
  pathWithoutAdmin: string,
  layout: string
) => {
  return await serverAction(
    'news',
    'POST',
    payload,
    [fullPath, layout, pathWithoutAdmin] // Revalidate paths
  );
};

export const updateNews = async (
  payload: object,
  newsId: string,
  fullPath: string,
  pathWithoutAdmin: string
) => {
  return await serverAction(
    `news/${newsId}`,
    'PATCH',
    payload,
    [fullPath, pathWithoutAdmin]
  );
};

export const deleteNews = async (
  id: string,
  fullPath: string,
  pathWithoutAdmin: string,
  layout: string
) => {
  return await serverAction(
    `news/${id}`,
    'DELETE',
    null,
    [fullPath, pathWithoutAdmin, layout]
  );
};

// BLOGS SERVER ACTIONS
export const createBlog = async (
  payload: object,
  fullPath: string,
  pathWithoutAdmin: string,
  layout: string
) => {
  return await serverAction(
    'blogs',
    'POST',
    payload,
    [fullPath, layout, pathWithoutAdmin] // Revalidate paths
  );
};

export const updateBlog = async (
  payload: object,
  blogsId: string,
  fullPath: string,
  pathWithoutAdmin: string
) => {
  return await serverAction(
    `blogs/${blogsId}`,
    'PATCH',
    payload,
    [fullPath, pathWithoutAdmin]
  );
};

export const deleteBlog = async (
  id: string,
  fullPath: string,
  pathWithoutAdmin: string,
  layout: string
) => {
  return await serverAction(
    `blogs/${id}`,
    'DELETE',
    null,
    [fullPath, pathWithoutAdmin, layout]
  );
};

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

    console.log('Generated Signed URL:', url);

    return { success: { url: url } }; // Ensure the value is correctly returned
  } catch (error) {
    console.error(
      'Error generating signed URL:',
      error
    );
    return { failure: 'An error occurred' };
  }
};

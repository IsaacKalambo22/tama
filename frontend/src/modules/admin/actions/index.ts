'use server';

import { auth } from '@/auth';
import { parseServerActionResponse } from '@/lib/utils';
import { revalidatePath } from 'next/cache';

export const uploadFile = async () => {};
export const createForm = async (
  formData: FormData
) => {
  try {
    const session = await auth();
    console.log('Action!!!!!!!!!!!!!');
    if (!session)
      return parseServerActionResponse({
        error: 'Not signed in',
        status: 'ERROR',
      });
    // Make a POST request to the Next.js API route
    // Extract the token from session (assuming your session object contains it)
    const token = session?.accessToken; // Adjust if your token is stored differently

    // Make a POST request to the API with the Bearer token in the Authorization header
    const response = await fetch(
      'http://localhost:8000/api/v1/forms',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`, // Include Bearer token
          //   'Content-Type': 'multipart/form-data', // Content type for file uploads
        },
        body: formData, // Send FormData with files
      }
    );

    if (!response.ok) {
      throw new Error('Failed to upload files');
    }

    const result = await response.json();
    revalidatePath('/');
    return result; // You can return the result or handle it based on your needs
  } catch (error) {
    console.error(
      'Error during file upload:',
      error
    );
    throw error;
  }
};
export const createShop = async (
  formData: FormData
) => {
  try {
    const session = await auth();
    console.log('Action!!!!!!!!!!!!!');
    if (!session)
      return parseServerActionResponse({
        error: 'Not signed in',
        status: 'ERROR',
      });
    // Make a POST request to the Next.js API route
    // Extract the token from session (assuming your session object contains it)
    const token = session?.accessToken; // Adjust if your token is stored differently

    // Make a POST request to the API with the Bearer token in the Authorization header
    const response = await fetch(
      'http://localhost:8000/api/v1/shops',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`, // Include Bearer token
          //   'Content-Type': 'multipart/form-data', // Content type for file uploads
        },
        body: formData, // Send FormData with files
      }
    );

    if (!response.ok) {
      throw new Error('Failed to upload files');
    }

    const result = await response.json();
    revalidatePath('/');
    return result; // You can return the result or handle it based on your needs
  } catch (error) {
    console.error(
      'Error during file upload:',
      error
    );
    throw error;
  }
};
export const createReportAndPublication = async (
  formData: FormData
) => {
  try {
    const session = await auth();
    console.log('Action!!!!!!!!!!!!!');
    if (!session)
      return parseServerActionResponse({
        error: 'Not signed in',
        status: 'ERROR',
      });
    // Make a POST request to the Next.js API route
    // Extract the token from session (assuming your session object contains it)
    const token = session?.accessToken; // Adjust if your token is stored differently

    // Make a POST request to the API with the Bearer token in the Authorization header
    const response = await fetch(
      'http://localhost:8000/api/v1/reports-publications',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`, // Include Bearer token
          //   'Content-Type': 'multipart/form-data', // Content type for file uploads
        },
        body: formData, // Send FormData with files
      }
    );

    if (!response.ok) {
      throw new Error('Failed to upload files');
    }

    const result = await response.json();
    revalidatePath('/');
    return result; // You can return the result or handle it based on your needs
  } catch (error) {
    console.error(
      'Error during file upload:',
      error
    );
    throw error;
  }
};

export const getFiles = async () => {};

export const renameFile = async () => {};

export const updateFileUsers = async () => {};

export const deleteFile = async () => {};

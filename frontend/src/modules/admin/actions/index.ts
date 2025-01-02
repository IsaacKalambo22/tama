'use server';

import { auth } from '@/auth';
import {
  BASE_URL,
  parseServerActionResponse,
} from '@/lib/utils';
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

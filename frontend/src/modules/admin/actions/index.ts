'use server';
import { getPlaiceholder } from 'plaiceholder';

import { auth } from '@/auth';
import { BASE_URL } from '@/lib/utils';
import { revalidatePath } from 'next/cache';

export async function getImage(src: string) {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    30000
  ); // 30 seconds timeout

  const response = await fetch(src, {
    signal: controller.signal,
  });
  const buffer = Buffer.from(
    await response.arrayBuffer()
  );

  clearTimeout(timeout);

  const {
    metadata: { height, width },
    ...plaiceholder
  } = await getPlaiceholder(buffer, { size: 10 });

  return {
    ...plaiceholder,
    img: { src, height, width },
  };
}

export const serverAction = async (
  endpoint: string,
  method:
    | 'GET'
    | 'POST'
    | 'PATCH'
    | 'PUT'
    | 'DELETE',
  payload: Record<string, any> | null = null,
  revalidatePaths: string[] = [],
  useSession: boolean = true // Default to true
) => {
  try {
    let token: string | undefined = undefined;

    if (useSession) {
      const session = await auth();

      if (!session) {
        return {
          success: false,
          error: 'Not signed in',
        };
      }

      token = session.accessToken;
    }

    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token && {
          Authorization: `Bearer ${token}`,
        }), // Include token only if available
      },
    };

    if (payload) {
      options.body = JSON.stringify(payload);
    }

    const response = await fetch(
      `${BASE_URL}/${endpoint}`,
      options
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error:
          result.message ||
          'Something went wrong',
      };
    }

    // Revalidate specified paths
    for (const path of revalidatePaths) {
      revalidatePath(path);
    }

    return { success: true };
  } catch (error) {
    // General error handling
    console.log(error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred',
    };
  }
};

export const sendContactMessage = async (
  payload: object
) => {
  return await serverAction(
    'users/contact-email',
    'POST',
    payload,
    [],
    false
  );
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
    'auth/register',
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

// SERVICES SERVER ACTIONS
export const createService = async (
  payload: object,
  fullPath: string,
  pathWithoutAdmin: string,
  layout: string
) => {
  return await serverAction(
    'services',
    'POST',
    payload,
    [fullPath, layout, pathWithoutAdmin] // Revalidate paths
  );
};

export const updateService = async (
  payload: object,
  serviceId: string,
  fullPath: string,
  pathWithoutAdmin: string
) => {
  return await serverAction(
    `services/${serviceId}`,
    'PATCH',
    payload,
    [fullPath, pathWithoutAdmin]
  );
};

export const deleteService = async (
  id: string,
  fullPath: string,
  pathWithoutAdmin: string,
  layout: string
) => {
  return await serverAction(
    `services/${id}`,
    'DELETE',
    null,
    [fullPath, pathWithoutAdmin, layout]
  );
};

// SERVICES SERVER ACTIONS
export const createHomeCarousel = async (
  payload: object,
  fullPath: string,
  pathWithoutAdmin: string,
  layout: string
) => {
  return await serverAction(
    'home/carousel',
    'POST',
    payload,
    [fullPath, layout, pathWithoutAdmin] // Revalidate paths
  );
};

export const updateHomeCarousel = async (
  payload: object,
  id: string,
  fullPath: string,
  pathWithoutAdmin: string
) => {
  return await serverAction(
    `home/carousel/${id}`,
    'PATCH',
    payload,
    [fullPath, pathWithoutAdmin]
  );
};

export const deleteHomeCarousel = async (
  id: string,
  fullPath: string,
  pathWithoutAdmin: string,
  layout: string
) => {
  return await serverAction(
    `home/carousel/${id}`,
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
    'reports-publications',
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
    `reports-publications/${reportId}`,
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
    `reports-publications/${id}`,
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

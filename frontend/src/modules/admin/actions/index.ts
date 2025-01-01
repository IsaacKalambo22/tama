'use server';

import { auth } from '@/auth';
import { CouncilListProps } from '@/lib/api';
import {
  BASE_URL,
  parseServerActionResponse,
  parseStringify,
} from '@/lib/utils';
import {
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { revalidatePath } from 'next/cache';

const handleError = (
  error: unknown,
  message: string
) => {
  console.log(error, message);
  throw error;
};

export const deleteFile = async (
  id: string,
  path: string
) => {
  try {
    console.log('Deleted file');
    console.log({ id });

    revalidatePath(path);
    return parseStringify({ status: 'success' });
  } catch (error) {
    handleError(error, 'Failed to rename file');
  }
};
export const uploadFile = async () => {};
export const createForm = async (
  payload: Record<string, any>, // Use a JSON object as the payload
  fullPath: string,
  pathWithoutAdmin: string
) => {
  try {
    const session = await auth();

    if (!session)
      return parseServerActionResponse({
        error: 'Not signed in',
        status: 'ERROR',
      });

    const token = session?.accessToken;

    const response = await fetch(
      `${BASE_URL}/forms`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload), // Serialize the JSON object
      }
    );

    if (!response.ok) {
      throw new Error('Failed to upload files');
    }

    const result = await response.json();

    revalidatePath(fullPath);
    revalidatePath('/resources/forms');
    revalidatePath('/admin/resources/forms');
    revalidatePath(pathWithoutAdmin);
    return result;
  } catch (error) {
    console.error(
      'Error during file upload:',
      error
    );
    throw error;
  }
};

export const createShop = async (
  payload: Record<string, any>, // Use a JSON object as the payload
  fullPath: string,
  pathWithoutAdmin: string
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

    // Send JSON payload
    const response = await fetch(
      `${BASE_URL}/shops`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload), // Serialize the JSON object
      }
    );

    if (!response.ok) {
      throw new Error('Failed to upload files');
    }

    const result = await response.json();

    revalidatePath(fullPath);
    revalidatePath(pathWithoutAdmin);

    return result;
  } catch (error) {
    console.error(
      'Error during file upload:',
      error
    );
    throw error;
  }
};

export const createUser = async (
  name: string,
  email: string,
  password: string,
  phoneNumber: string,
  role: string,
  fullPath: string,
  pathWithoutAdmin: string
) => {
  try {
    const session = await auth();

    if (!session)
      return parseServerActionResponse({
        error: 'Not signed in',
        status: 'ERROR',
      });

    const token = session?.accessToken;
    const response = await fetch(
      `${BASE_URL}/auth/register`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          phoneNumber,
          role,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to create genre');
    }

    const result = await response.json();
    revalidatePath(fullPath);
    revalidatePath(pathWithoutAdmin);
    return result;
  } catch (error) {
    console.error(
      'Error during genre creation:',
      error
    );
    throw error;
  }
};
export const updateUser = async (
  userId: string,
  data: {
    name?: string;
    email?: string;
    password?: string;
    phoneNumber?: string;
    role?: string;
  },
  fullPath: string,
  pathWithoutAdmin: string
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

    const response = await fetch(
      `${BASE_URL}/users/${userId}`,
      {
        method: 'PATCH', // PATCH is used for partial updates
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        'Update user failed:',
        errorText
      );
      throw new Error(
        `Failed to update user. Server responded with status ${response.status}.`
      );
    }

    const result = await response.json();

    // Revalidate the relevant paths
    revalidatePath(fullPath);
    revalidatePath(pathWithoutAdmin);

    return result;
  } catch (error) {
    console.error(
      'Error during user update:',
      error
    );
    throw error;
  }
};

export const updateShop = async (
  payload: Record<string, any>, // Use a JSON object as the payload
  id: string,
  fullPath: string,
  pathWithoutAdmin: string
) => {
  try {
    const session = await auth();
    if (!session)
      return parseServerActionResponse({
        error: 'Not signed in',
        status: 'ERROR',
      });

    const token = session?.accessToken;
    const response = await fetch(
      `${BASE_URL}/shops/${id}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload), // Serialize the JSON object
      }
    );

    if (!response.ok) {
      throw new Error('Failed to upload files');
    }

    const result = await response.json();
    revalidatePath(fullPath);
    revalidatePath(pathWithoutAdmin);
    return parseServerActionResponse({
      ...result,
      error: '',
      status: 'SUCCESS',
    });
  } catch (error) {
    console.log(error);

    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: 'ERROR',
    });
  }
};
export const updateForms = async (
  payload: Record<string, any>, // Use a JSON object as the payload
  id: string,
  fullPath: string,
  pathWithoutAdmin: string
) => {
  try {
    const session = await auth();
    if (!session)
      return parseServerActionResponse({
        error: 'Not signed in',
        status: 'ERROR',
      });

    const token = session?.accessToken;
    const response = await fetch(
      `${BASE_URL}/forms/${id}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload), // Serialize the JSON object
      }
    );

    if (!response.ok) {
      throw new Error('Failed to upload files');
    }

    const result = await response.json();
    revalidatePath(fullPath);
    revalidatePath(pathWithoutAdmin);
    return parseServerActionResponse({
      ...result,
      error: '',
      status: 'SUCCESS',
    });
  } catch (error) {
    console.log(error);

    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: 'ERROR',
    });
  }
};
export const updateReports = async (
  payload: Record<string, any>, // Use a JSON object as the payload
  id: string,
  fullPath: string,
  pathWithoutAdmin: string
) => {
  try {
    const session = await auth();
    if (!session)
      return parseServerActionResponse({
        error: 'Not signed in',
        status: 'ERROR',
      });

    const token = session?.accessToken;
    const response = await fetch(
      `${BASE_URL}/reports-publications/${id}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload), // Serialize the JSON object
      }
    );

    if (!response.ok) {
      throw new Error('Failed to upload files');
    }

    const result = await response.json();
    revalidatePath(fullPath);
    revalidatePath(pathWithoutAdmin);
    return parseServerActionResponse({
      ...result,
      error: '',
      status: 'SUCCESS',
    });
  } catch (error) {
    console.log(error);

    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: 'ERROR',
    });
  }
};
export const updateBlog = async (
  formData: FormData,
  id: string,
  fullPath: string,
  pathWithoutAdmin: string
) => {
  try {
    const session = await auth();
    if (!session)
      return parseServerActionResponse({
        error: 'Not signed in',
        status: 'ERROR',
      });

    const token = session?.accessToken;
    const response = await fetch(
      `${BASE_URL}/blogs/${id}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Failed to upload files');
    }

    const result = await response.json();

    revalidatePath(fullPath);
    revalidatePath(pathWithoutAdmin);

    return parseServerActionResponse({
      ...result,
      error: '',
      status: 'SUCCESS',
    });
  } catch (error) {
    console.log(error);

    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: 'ERROR',
    });
  }
};

export const updateNews = async (
  formData: FormData,
  id: string,
  fullPath: string,
  pathWithoutAdmin: string
) => {
  try {
    const session = await auth();
    if (!session)
      return parseServerActionResponse({
        error: 'Not signed in',
        status: 'ERROR',
      });

    const token = session?.accessToken;
    const response = await fetch(
      `${BASE_URL}/news/${id}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Failed to upload files');
    }

    const result = await response.json();
    revalidatePath(fullPath);
    revalidatePath(pathWithoutAdmin);
    return parseServerActionResponse({
      ...result,
      error: '',
      status: 'SUCCESS',
    });
  } catch (error) {
    console.log(error);

    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: 'ERROR',
    });
  }
};

export const deleteShop = async (
  id: string,
  fullPath: string,
  pathWithoutAdmin: string
) => {
  try {
    const session = await auth();
    if (!session)
      return parseServerActionResponse({
        error: 'Not signed in',
        status: 'ERROR',
      });

    const token = session?.accessToken;
    const response = await fetch(
      `${BASE_URL}/shops/${id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to upload files');
    }

    const result = await response.json();
    revalidatePath(fullPath);
    revalidatePath(pathWithoutAdmin);
    return parseServerActionResponse({
      ...result,
      error: '',
      status: 'SUCCESS',
    });
  } catch (error) {
    console.log(error);

    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: 'ERROR',
    });
  }
};
export const deleteUser = async (
  id: string,
  fullPath: string,
  pathWithoutAdmin: string
) => {
  try {
    const session = await auth();
    if (!session)
      return parseServerActionResponse({
        error: 'Not signed in',
        status: 'ERROR',
      });

    const token = session?.accessToken;
    const response = await fetch(
      `${BASE_URL}/users/${id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to upload files');
    }

    const result = await response.json();
    revalidatePath(fullPath);
    revalidatePath(pathWithoutAdmin);
    return parseServerActionResponse({
      ...result,
      error: '',
      status: 'SUCCESS',
    });
  } catch (error) {
    console.log(error);

    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: 'ERROR',
    });
  }
};
export const deleteForms = async (
  id: string,
  fullPath: string,
  pathWithoutAdmin: string
) => {
  try {
    const session = await auth();
    if (!session)
      return parseServerActionResponse({
        error: 'Not signed in',
        status: 'ERROR',
      });

    const token = session?.accessToken;
    const response = await fetch(
      `${BASE_URL}/forms/${id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to upload files');
    }

    const result = await response.json();
    revalidatePath(fullPath);
    revalidatePath(pathWithoutAdmin);
    return parseServerActionResponse({
      ...result,
      error: '',
      status: 'SUCCESS',
    });
  } catch (error) {
    console.log(error);

    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: 'ERROR',
    });
  }
};
export const deleteReports = async (
  id: string,
  fullPath: string,
  pathWithoutAdmin: string
) => {
  try {
    const session = await auth();
    if (!session)
      return parseServerActionResponse({
        error: 'Not signed in',
        status: 'ERROR',
      });

    const token = session?.accessToken;
    const response = await fetch(
      `${BASE_URL}/reports-publications/${id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to upload files');
    }

    const result = await response.json();
    revalidatePath(fullPath);
    revalidatePath(pathWithoutAdmin);
    return parseServerActionResponse({
      ...result,
      error: '',
      status: 'SUCCESS',
    });
  } catch (error) {
    console.log(error);

    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: 'ERROR',
    });
  }
};
export const deleteBlog = async (
  id: string,
  fullPath: string,
  pathWithoutAdmin: string
) => {
  try {
    const session = await auth();
    if (!session)
      return parseServerActionResponse({
        error: 'Not signed in',
        status: 'ERROR',
      });

    const token = session?.accessToken;
    const response = await fetch(
      `${BASE_URL}/blogs/${id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to upload files');
    }

    const result = await response.json();
    revalidatePath(fullPath);
    revalidatePath(pathWithoutAdmin);
    return parseServerActionResponse({
      ...result,
      error: '',
      status: 'SUCCESS',
    });
  } catch (error) {
    console.log(error);

    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: 'ERROR',
    });
  }
};

export const deleteCouncilList = async (
  id: string,
  fullPath: string,
  pathWithoutAdmin: string
) => {
  try {
    const session = await auth();
    if (!session)
      return parseServerActionResponse({
        error: 'Not signed in',
        status: 'ERROR',
      });

    const token = session?.accessToken;
    const response = await fetch(
      `${BASE_URL}/council-lists/${id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to upload files');
    }

    const result = await response.json();
    revalidatePath(fullPath);
    revalidatePath(pathWithoutAdmin);
    return parseServerActionResponse({
      ...result,
      error: '',
      status: 'SUCCESS',
    });
  } catch (error) {
    console.log(error);

    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: 'ERROR',
    });
  }
};
export const deleteEvent = async (
  id: string,
  fullPath: string,
  pathWithoutAdmin: string
) => {
  try {
    const session = await auth();
    if (!session)
      return parseServerActionResponse({
        error: 'Not signed in',
        status: 'ERROR',
      });

    const token = session?.accessToken;
    const response = await fetch(
      `${BASE_URL}/events/${id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to upload files');
    }

    const result = await response.json();
    revalidatePath(fullPath);
    revalidatePath(pathWithoutAdmin);
    return parseServerActionResponse({
      ...result,
      error: '',
      status: 'SUCCESS',
    });
  } catch (error) {
    console.log(error);

    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: 'ERROR',
    });
  }
};
export const deleteVacancy = async (
  id: string,
  fullPath: string,
  pathWithoutAdmin: string
) => {
  try {
    const session = await auth();
    if (!session)
      return parseServerActionResponse({
        error: 'Not signed in',
        status: 'ERROR',
      });

    const token = session?.accessToken;
    const response = await fetch(
      `${BASE_URL}/vacancies/${id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to upload files');
    }

    const result = await response.json();
    revalidatePath(fullPath);
    revalidatePath(pathWithoutAdmin);
    return parseServerActionResponse({
      ...result,
      error: '',
      status: 'SUCCESS',
    });
  } catch (error) {
    console.log(error);

    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: 'ERROR',
    });
  }
};
export const deleteNews = async (
  id: string,
  fullPath: string,
  pathWithoutAdmin: string
) => {
  try {
    const session = await auth();
    if (!session)
      return parseServerActionResponse({
        error: 'Not signed in',
        status: 'ERROR',
      });

    const token = session?.accessToken;
    const response = await fetch(
      `${BASE_URL}/news/${id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to upload files');
    }

    const result = await response.json();
    revalidatePath(fullPath);
    revalidatePath(pathWithoutAdmin);
    return parseServerActionResponse({
      ...result,
      error: '',
      status: 'SUCCESS',
    });
  } catch (error) {
    console.log(error);

    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: 'ERROR',
    });
  }
};
export const createBlog = async (
  payload: Record<string, any>, // Use a JSON object as the payload
  fullPath: string,
  pathWithoutAdmin: string
) => {
  try {
    const session = await auth();
    console.log({ payload });
    if (!session)
      return parseServerActionResponse({
        error: 'Not signed in',
        status: 'ERROR',
      });

    const token = session?.accessToken;

    const response = await fetch(
      `${BASE_URL}/blogs`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload), // Serialize the JSON object
      }
    );

    if (!response.ok) {
      throw new Error('Failed to upload files');
    }

    const result = await response.json();
    revalidatePath(fullPath);
    revalidatePath(pathWithoutAdmin);
    return result;
  } catch (error) {
    console.error(
      'Error during file upload:',
      error
    );
    throw error;
  }
};
export const createNews = async (
  payload: Record<string, any>, // Use a JSON object as the payload
  fullPath: string,
  pathWithoutAdmin: string
) => {
  try {
    const session = await auth();
    console.log({ payload });
    if (!session)
      return parseServerActionResponse({
        error: 'Not signed in',
        status: 'ERROR',
      });

    const token = session?.accessToken;

    const response = await fetch(
      `${BASE_URL}/news`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload), // Serialize the JSON object
      }
    );

    if (!response.ok) {
      throw new Error('Failed to upload files');
    }

    const result = await response.json();
    revalidatePath(fullPath);
    revalidatePath(pathWithoutAdmin);
    return result;
  } catch (error) {
    console.error(
      'Error during file upload:',
      error
    );
    throw error;
  }
};

export const createEvent = async (
  payload: object,
  fullPath: string,
  pathWithoutAdmin: string
) => {
  try {
    const session = await auth();

    if (!session) {
      return parseServerActionResponse({
        error: 'Not signed in',
        status: 'ERROR',
      });
    }

    const token = session?.accessToken;

    const response = await fetch(
      `${BASE_URL}/events`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error(
        'Failed to upload event data'
      );
    }

    const result = await response.json();
    revalidatePath(fullPath);
    revalidatePath(pathWithoutAdmin);
    return result;
  } catch (error) {
    console.error(
      'Error during event creation:',
      error
    );
    throw error;
  }
};
export const createVacancy = async (
  payload: object,
  fullPath: string,
  pathWithoutAdmin: string
) => {
  try {
    const session = await auth();

    if (!session) {
      return parseServerActionResponse({
        error: 'Not signed in',
        status: 'ERROR',
      });
    }

    const token = session?.accessToken;

    const response = await fetch(
      `${BASE_URL}/vacancies`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error(
        'Failed to upload vacancy data'
      );
    }

    const result = await response.json();
    revalidatePath(fullPath);
    revalidatePath(pathWithoutAdmin);
    return result;
  } catch (error) {
    console.error(
      'Error during vacancy creation:',
      error
    );
    throw error;
  }
};

export const updateVacancy = async (
  payload: object,
  vacancyId: string, // Add vacancy ID for identifying the resource to update
  fullPath: string,
  pathWithoutAdmin: string
) => {
  try {
    const session = await auth();

    if (!session) {
      return parseServerActionResponse({
        error: 'Not signed in',
        status: 'ERROR',
      });
    }

    const token = session?.accessToken;

    const response = await fetch(
      `${BASE_URL}/vacancies/${vacancyId}`, // URL updated to include the vacancy ID
      {
        method: 'PUT', // Use PUT method for updates
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload), // Pass the payload with the updated data
      }
    );

    if (!response.ok) {
      throw new Error(
        'Failed to update vacancy data'
      );
    }

    const result = await response.json();

    // Revalidate the paths after successful update
    revalidatePath(fullPath);
    revalidatePath(pathWithoutAdmin);

    return result; // Return the result of the update
  } catch (error) {
    console.error(
      'Error during vacancy update:',
      error
    );
    throw error; // Re-throw the error after logging it
  }
};

export const updateEvent = async (
  payload: object,
  eventId: string, // The ID of the event to update
  fullPath: string,
  pathWithoutAdmin: string
) => {
  try {
    const session = await auth();

    if (!session) {
      return parseServerActionResponse({
        error: 'Not signed in',
        status: 'ERROR',
      });
    }

    const token = session?.accessToken;

    const response = await fetch(
      `${BASE_URL}/events/${eventId}`, // Use the eventId in the URL for updating
      {
        method: 'PATCH', // Use PUT for update
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error(
        'Failed to update event data'
      );
    }

    const result = await response.json();
    revalidatePath(fullPath);
    revalidatePath(pathWithoutAdmin);
    return result;
  } catch (error) {
    console.error(
      'Error during event update:',
      error
    );
    throw error;
  }
};

export const updateCouncilList = async (
  payload: object,
  councilListId: string, // The ID of the council list to update
  fullPath: string,
  pathWithoutAdmin: string
) => {
  try {
    const session = await auth();

    if (!session) {
      return parseServerActionResponse({
        error: 'Not signed in',
        status: 'ERROR',
      });
    }

    const token = session?.accessToken;

    const response = await fetch(
      `${BASE_URL}/council-lists/${councilListId}`, // Use the councilListId in the URL for updating
      {
        method: 'PATCH', // Use PUT for update
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error(
        'Failed to update council list data'
      );
    }

    const result = await response.json();
    revalidatePath(fullPath);
    revalidatePath(pathWithoutAdmin);
    return result;
  } catch (error) {
    console.error(
      'Error during council list update:',
      error
    );
    throw error;
  }
};

export const createCouncilList = async (
  councilData: Partial<CouncilListProps>,
  fullPath: string,
  pathWithoutAdmin: string
) => {
  try {
    const session = await auth();

    if (!session) {
      return parseServerActionResponse({
        error: 'Not signed in',
        status: 'ERROR',
      });
    }

    const token = session?.accessToken;
    const requestBody =
      JSON.stringify(councilData);

    const response = await fetch(
      `${BASE_URL}/council-lists`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: requestBody,
      }
    );

    console.log(
      'Response status:',
      response.status
    );

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error(
        'Failed to upload data:',
        errorDetails
      );
      throw new Error('Failed to upload data');
    }

    const result = await response.json();
    revalidatePath(fullPath);
    revalidatePath(pathWithoutAdmin);
    return result;
  } catch (error) {
    console.error(
      'Error during data upload:',
      error
    );
    throw error;
  }
};

export const createReportAndPublication = async (
  payload: Record<string, any>, // Use a JSON object as the payload
  fullPath: string,
  pathWithoutAdmin: string
) => {
  try {
    const session = await auth();
    if (!session)
      return parseServerActionResponse({
        error: 'Not signed in',
        status: 'ERROR',
      });

    const token = session?.accessToken;
    const response = await fetch(
      `${BASE_URL}/reports-publications`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload), // Serialize the JSON object
      }
    );

    if (!response.ok) {
      throw new Error('Failed to upload files');
    }

    const result = await response.json();
    revalidatePath(fullPath);
    revalidatePath(pathWithoutAdmin);
    return result;
  } catch (error) {
    console.error(
      'Error during file upload:',
      error
    );
    throw error;
  }
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
// export const getSignedURL = async ({
//   fileType,
//   fileSize,
//   checksum,
// }: GetSignedURLParams): SignedURLResponse => {
//   const session = await auth();

//   if (!session) {
//     return { failure: 'not authenticated' };
//   }

//   if (!allowedFileTypes.includes(fileType)) {
//     return { failure: 'File type not allowed' };
//   }

//   if (fileSize > maxFileSize) {
//     return { failure: 'File size too large' };
//   }

//   const fileName = generateFileName();

//   const putObjectCommand = new PutObjectCommand({
//     Bucket: process.env.AWS_BUCKET_NAME!,
//     Key: fileName,
//     ContentType: fileType,
//     ContentLength: fileSize,
//     ChecksumSHA256: checksum,
//   });

//   const url = await getSignedUrl(
//     s3Client,
//     putObjectCommand,
//     { expiresIn: 60 } // 60 seconds
//   );

//   console.log({ success: url });

//   // const results = await db
//   //   .insert(mediaTable)
//   //   .values({
//   //     type: fileType.startsWith('image')
//   //       ? 'image'
//   //       : 'video',
//   //     url: url.split('?')[0],
//   //     width: 0,
//   //     height: 0,
//   //     userId: session.user.id,
//   //   })
//   //   .returning();

//   return { success: { url: url } };
// };
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

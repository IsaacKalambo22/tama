'use server';

import { auth } from '@/auth';
import { CouncilListProps } from '@/lib/api';
import {
  BASE_URL,
  parseServerActionResponse,
  parseStringify,
} from '@/lib/utils';
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
  formData: FormData,
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

export const createShop = async (
  formData: FormData,
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
      `${BASE_URL}/shops`,
      {
        method: 'POST',
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
    return result;
  } catch (error) {
    console.error(
      'Error during file upload:',
      error
    );
    throw error;
  }
};
export const updateShop = async (
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
      `${BASE_URL}/shops/${id}`,
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
export const updateForms = async (
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
      `${BASE_URL}/forms/${id}`,
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
export const updateReports = async (
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
      `${BASE_URL}/reports-publications/${id}`,
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
  formData: FormData,
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
      `${BASE_URL}/blogs`,
      {
        method: 'POST',
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
  formData: FormData,
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
      `${BASE_URL}/news`,
      {
        method: 'POST',
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
    return result;
  } catch (error) {
    console.error(
      'Error during file upload:',
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
  formData: FormData,
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
    return result;
  } catch (error) {
    console.error(
      'Error during file upload:',
      error
    );
    throw error;
  }
};

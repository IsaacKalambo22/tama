import { auth } from '@/auth';
import { BASE_URL } from './utils';

// Shared interfaces
export interface CouncilListProps {
  id: string;
  demarcation: string;
  tobaccoType: string;
  councillor: string;
  firstAlternateCouncillor: string;
  secondAlternateCouncillor: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewsProps {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  author: string;
  readingTime: number; // in minutes
  createdAt: string; // ISO date string
  updatedAt: string; // optional ISO date string
}

export interface BlogProps {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export interface FileProps {
  id: string;
  fileUrl: string;
  filename: string;
  size: number;
  createdAt: string;
  updatedAt: string;
}

export interface ShopProps {
  id: string;
  name: string;
  imageUrl: string;
  address: string;
  openHours: string;
  createdAt: string;
  updatedAt: string;
}
export enum Role {
  ADMIN,
  MANAGER,
  USER,
}
export interface UserProps {
  id: string;
  email: string;
  password: string;
  name: string;
  role: Role;
  lastLogin: string | null; // ISO date string or null if never logged in
  isVerified: boolean;
  resetPasswordToken: string | null;
  resetPasswordExpiresAt: string | null;
  verificationToken: string | null;
  verificationTokenExpiresAt: string | null;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Utility function for API requests
// Utility function for API requests
async function handleFetch<T>(
  endpoint: string,
  token?: string
): Promise<T> {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Only add Authorization header if token is available
    if (token) {
      headers[
        'Authorization'
      ] = `Bearer ${token}`;
    }

    const response = await fetch(endpoint, {
      method: 'GET',
      headers,
    });

    // Handle non-OK HTTP responses
    if (!response.ok) {
      const errorDetails = await response.text();
      console.error(
        `HTTP error! Status: ${response.status}, Details: ${errorDetails}`
      );
      throw new Error(
        `HTTP error! Status: ${response.status}`
      );
    }

    // Parse the response JSON
    const data: {
      success: boolean;
      data: T;
      message?: string;
    } = await response.json();

    // Check for API-level success
    if (data.success) {
      console.log(
        `Data fetched successfully from ${endpoint}:`,
        data.data
      );
      return data.data;
    } else {
      console.error(
        `API Error at ${endpoint}: ${data.message}`
      );
      throw new Error(
        data.message || 'Unknown API error'
      );
    }
  } catch (error: any) {
    console.error(
      `Error fetching data from ${endpoint}:`,
      error.message || error
    );
    throw new Error(
      `Failed to fetch data: ${error.message}`
    );
  }
}

// Fetch functions using the utility
export const fetchReportsAndPublications =
  async (): Promise<FileProps[]> => {
    return handleFetch<FileProps[]>(
      `${BASE_URL}/reports-publications`
    );
  };
// Fetch functions using the utility
export const fetchUsers = async (): Promise<
  UserProps[]
> => {
  try {
    // Fetch user session for authentication
    const session = await auth();
    const token = session?.accessToken; // Token is optional, might be undefined if not signed in.

    const API_URL = `${BASE_URL}/users`;

    // Use the handleFetch utility for making the API call
    return handleFetch<UserProps[]>(
      API_URL,
      token
    );
  } catch (error: any) {
    console.error(
      'Error during fetchUsers:',
      error.message || error
    );
    throw new Error(
      'Unable to fetch users. Please try again later.'
    );
  }
};

export const fetchFormsAndDocuments =
  async (): Promise<FileProps[]> => {
    return handleFetch<FileProps[]>(
      `${BASE_URL}/forms`
    );
  };

export const fetchShops = async (): Promise<
  ShopProps[]
> => {
  return handleFetch<ShopProps[]>(
    `${BASE_URL}/shops`
  );
};

export const fetchBlogs = async (): Promise<
  BlogProps[]
> => {
  return handleFetch<BlogProps[]>(
    `${BASE_URL}/blogs`
  );
};

export const fetchBlogById = async (
  id: string
): Promise<BlogProps> => {
  return handleFetch<BlogProps>(
    `${BASE_URL}/blogs/${id}`
  );
};

export const fetchNews = async (): Promise<
  NewsProps[]
> => {
  return handleFetch<NewsProps[]>(
    `${BASE_URL}/news`
  );
};

export const fetchNewsById = async (
  id: string
): Promise<NewsProps> => {
  return handleFetch<NewsProps>(
    `${BASE_URL}/news/${id}`
  );
};

export const fetchCouncilList = async (): Promise<
  CouncilListProps[]
> => {
  return handleFetch<CouncilListProps[]>(
    `${BASE_URL}/council-lists`
  );
};

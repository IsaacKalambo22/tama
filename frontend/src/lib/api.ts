import { BASE_URL } from './utils';

// Shared interfaces
export interface CouncilListProps {
  id: string;
  demarcation: string;
  councilArea: string;
  council: string;
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
  size: number;
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
  size: number;
  createdAt: string;
  updatedAt: string;
}

export interface FileProps {
  id: string;
  fileUrl: string;
  filename: string;
  size: number;
  type: string;
  extension: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShopProps {
  id: string;
  name: string;
  imageUrl: string;
  address: string;
  size: number;
  openHours: string;
  createdAt: string;
  updatedAt: string;
}
export enum Role {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  USER = 'USER',
}

export interface UserProps {
  id: string;
  email: string;
  phoneNumber: string;
  name: string;
  avatar?: string;
  district?: string;
  about?: string;
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

export interface EventProps {
  id: string; // Optional for new events, required for existing ones
  title: string; // Event title
  description: string; // Event description
  location?: string; // Optional event location
  date: Date; // Start date of the event
  endDate?: Date; // Optional end date of the event
  time?: string; // Optional event time
  createdAt?: string; // Automatically set during creation
  updatedAt?: string; // Automatically updated on modification
}
// Enum for Vacancy Status
export enum VacancyStatus {
  OPEN = 'Open',
  CLOSED = 'Closed',
}

// VacancyProps interface for the vacancy model
export interface VacancyProps {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  status: VacancyStatus; // Enum for status field
  applicationDeadline: Date; // Consider using Date type if required
  salary?: string; // Optional salary field
  duties?: string; // Optional field: List of job duties
  qualifications?: string; // Optional field: List of qualifications
  howToApply?: string; // Optional field: How to apply for the position
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Utility function for API requests
async function handleFetch<T>(
  endpoint: string,
  token?: string
): Promise<T> {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      // 'Cache-Control':
      //   'no-cache, no-store, must-revalidate',
      // Pragma: 'no-cache',
      // Expires: '0',
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
      next: { revalidate: 1 },
    });
    if (!response.ok) {
      console.log(
        `HTTP error! Status: ${response.status} | Endpoint: ${endpoint}`
      );
      throw new Error(
        `HTTP error! Status: ${response.status}`
      );
    }

    const data: ApiResponse<T> =
      await response.json();

    if (data.success) {
      return data.data;
    } else {
      console.log(
        `API Error at ${endpoint}: ${data.message}`
      );
      throw new Error(data.message);
    }
  } catch (error) {
    console.log(
      `Error fetching data from ${endpoint}:`,
      error
    );
  }
}

export const fetchReportsAndPublications =
  async (): Promise<FileProps[]> => {
    return handleFetch<FileProps[]>(
      `${BASE_URL}/reports-publications`
    );
  };
export const fetchUsers = async (): Promise<
  UserProps[]
> => {
  try {
    const API_URL = `${BASE_URL}/users`;

    return handleFetch<UserProps[]>(API_URL);
  } catch (error: any) {
    console.log(
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

export const fetchEvents = async (): Promise<
  EventProps[]
> => {
  return handleFetch<EventProps[]>(
    `${BASE_URL}/events`
  );
};
export const fetchVacancies = async (): Promise<
  VacancyProps[]
> => {
  return handleFetch<VacancyProps[]>(
    `${BASE_URL}/vacancies`
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
export const fetchVacancyById = async (
  id: string
): Promise<VacancyProps> => {
  return handleFetch<VacancyProps>(
    `${BASE_URL}/vacancies/${id}`
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

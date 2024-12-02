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

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Utility function for API requests
async function handleFetch<T>(
  endpoint: string
): Promise<T> {
  try {
    const response = await fetch(endpoint);

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
      console.log(
        `Data fetched successfully from ${endpoint}:`,
        data.data
      );
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
      error.message
    );
    // return Promise.reject(
    //   new Error(
    //     `Failed to fetch data: ${error.message}`
    //   )
    // );
  }
}

// Fetch functions using the utility
export const fetchReportsAndPublications =
  async (): Promise<FileProps[]> => {
    return handleFetch<FileProps[]>(
      `${BASE_URL}/reports-publications`
    );
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

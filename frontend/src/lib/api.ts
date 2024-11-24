import { BASE_URL } from './utils';

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
  id: string; // Unique identifier for the blog
  title: string; // Title of the blog
  content: string; // Content or body of the blog
  imageUrl: string; // URL for the blog's image
  author: string; // Author's name
  createdAt: string; // Timestamp of when the blog was created
  updatedAt: string; // Timestamp of the last update to the blog
}

// Define the type for a report/publication
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

// Function to fetch reports and publications
export const fetchReportsAndPublications =
  async (): Promise<FileProps[]> => {
    const endpoint = `${BASE_URL}/reports-publications`;

    try {
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(
          `HTTP error! Status: ${response.status}`
        );
      }

      const data: ApiResponse<FileProps[]> =
        await response.json();

      if (data.success) {
        console.log(
          'Reports and Publications fetched successfully:',
          data.data
        );
        return data.data;
      } else {
        console.error(
          'Error fetching reports and publications:',
          data.message
        );
        throw new Error(data.message);
      }
    } catch (error) {
      console.error(
        'An error occurred while fetching reports and publications:',
        error
      );
      throw error;
    }
  };

// Function to fetch forms and documents
export const fetchFormsAndDocuments =
  async (): Promise<FileProps[]> => {
    const endpoint = `${BASE_URL}/forms`;

    try {
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(
          `HTTP error! Status: ${response.status}`
        );
      }

      const data: ApiResponse<FileProps[]> =
        await response.json();

      if (data.success) {
        console.log(
          'Forms and documents fetched successfully:',
          data.data
        );
        return data.data;
      } else {
        console.error(
          'Error fetching forms and documents:',
          data.message
        );
        throw new Error(data.message);
      }
    } catch (error) {
      console.error(
        'An error occurred while fetching forms and documents:',
        error
      );
      throw error;
    }
  };

// Function to fetch shops
export const fetchShops = async (): Promise<
  ShopProps[]
> => {
  const endpoint = `${BASE_URL}/shops`;

  try {
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(
        `HTTP error! Status: ${response.status}`
      );
    }

    const data: ApiResponse<ShopProps[]> =
      await response.json();

    if (data.success) {
      console.log(
        'Shops fetched successfully:',
        data.data
      );
      return data.data;
    } else {
      console.error(
        'Error fetching shops:',
        data.message
      );
      throw new Error(data.message);
    }
  } catch (error) {
    console.error(
      'An error occurred while fetching shops:',
      error
    );
    throw error;
  }
};
export const fetchBlogs = async (): Promise<
  BlogProps[]
> => {
  const endpoint = `${BASE_URL}/blogs`;

  try {
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(
        `HTTP error! Status: ${response.status}`
      );
    }

    const data: ApiResponse<BlogProps[]> =
      await response.json();

    if (data.success) {
      console.log(
        'Blogs fetched successfully:',
        data.data
      );
      return data.data;
    } else {
      console.error(
        'Error fetching blogs:',
        data.message
      );
      throw new Error(data.message);
    }
  } catch (error) {
    console.error(
      'An error occurred while fetching blogs:',
      error
    );
    throw error;
  }
};
export const fetchNews = async (): Promise<
  NewsProps[]
> => {
  const endpoint = `${BASE_URL}/news`;

  try {
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(
        `HTTP error! Status: ${response.status}`
      );
    }

    const data: ApiResponse<NewsProps[]> =
      await response.json();

    if (data.success) {
      console.log(
        'News fetched successfully:',
        data.data
      );
      return data.data;
    } else {
      console.error(
        'Error fetching news:',
        data.message
      );
      throw new Error(data.message);
    }
  } catch (error) {
    console.error(
      'An error occurred while fetching news:',
      error
    );
    throw error;
  }
};
export const fetchCouncilList = async (): Promise<
  CouncilListProps[]
> => {
  const endpoint = `${BASE_URL}/council-lists`;

  try {
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(
        `HTTP error! Status: ${response.status}`
      );
    }

    const data: ApiResponse<CouncilListProps[]> =
      await response.json();

    if (data.success) {
      console.log(
        'News fetched successfully:',
        data.data
      );
      return data.data;
    } else {
      console.error(
        'Error fetching news:',
        data.message
      );
      throw new Error(data.message);
    }
  } catch (error) {
    console.error(
      'An error occurred while fetching news:',
      error
    );
    throw error;
  }
};

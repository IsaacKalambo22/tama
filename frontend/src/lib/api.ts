import { BASE_URL } from './utils';

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

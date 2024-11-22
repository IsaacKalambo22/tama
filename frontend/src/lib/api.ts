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

// Define the API response structure
interface ApiResponse {
  success: boolean;
  message: string;
  data: FileProps[];
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

      const data: ApiResponse =
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

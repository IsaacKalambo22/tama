// ../../types/index.ts
export interface APIResponse {
  success: boolean;
  message: string;
  [key: string]: any; // Optional additional data
}

export interface TokenPayloadProps {
  id: string;
  email: string;
  role: string;
}

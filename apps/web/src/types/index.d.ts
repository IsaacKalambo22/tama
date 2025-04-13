declare global {
  interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
  }

  interface AuthCredentials {
    fullName: string;
    email: string;
    password?: string;
    verificationToken?: string;
  }
  type FileState = {
    file: File;
    key: string; // Used to identify the file in progress callback
    progress:
      | 'PENDING'
      | 'COMPLETE'
      | 'ERROR'
      | number;
  };

  interface Blog {
    id: string;
    title: string;
    author: string;
    content: string;
    description: string;
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
  }

  interface Service {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
  }
  interface HomeCarousel {
    id: string;
    title: string;
    description: string;
    coverUrl: string;
  }
  interface HomeImageText {
    id: string;
    heading: string;
    description: string;
    imageUrl: string;
  }
  interface Product {
    id: string;
    productName: string;
    description?: string;
    imageUrls: string[];
  }

  enum Role {
    ADMIN = 'ADMIN',
    MANAGER = 'MANAGER',
    USER = 'USER',
  }

  interface User {
    id: string;
    email: string;
    phoneNumber: string;
    name: string;
    avatar?: string;
    district?: string;
    about?: string;
    role: Role;
    lastLogin?: string;
    isVerified?: boolean;
    resetPasswordToken?: string;
    resetPasswordExpiresAt?: string;
    verificationToken?: string;
    verificationTokenExpiresAt?: string;
    createdAt: string;
    updatedAt: string;
  }

  interface Gallery {
    id: string;
    caption: string;
    imageUrls: string[];
    createdAt: string;
    updatedAt: string;
  }

  interface ActionType {
    label: string;
    icon: string;
    value: string;
  }
}

export {};

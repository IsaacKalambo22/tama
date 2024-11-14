import { Role } from '@prisma/client';
import jwt from 'jsonwebtoken';

interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

export const generateTokens = (
  id: string,
  email: string,
  role: Role
): TokenResponse => {
  const access_token = jwt.sign(
    {
      id: id,
      email: email,
      role: role,
    },
    process.env.JWT_ACCESS_SECRET_KEY as string,
    {
      expiresIn: '30min',
      algorithm: 'HS256', // Correct algorithm here
    }
  );

  const refresh_token = jwt.sign(
    {
      id: id,
      email: email,
      role: role,
    },
    process.env.JWT_REFRESH_SECRET_KEY as string,
    {
      expiresIn: '1d',
      algorithm: 'HS256', // Correct algorithm here
    }
  );

  return { access_token, refresh_token };
};

import { Role } from '@prisma/client';
import {
  NextFunction,
  Request,
  Response,
} from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { TokenPayloadProps } from '../../types';

// Extend Express Request interface to include user information
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayloadProps;
    }
  }
}

// Middleware to verify JWT and add user information to the request object
export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authorizationHeader =
    req.headers['authorization'] ||
    req.headers['Authorization'] ||
    '';

  const authHeader =
    authorizationHeader.toString();

  if (!authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      message:
        'Unauthorized: Invalid token format',
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(
    token,
    process.env.JWT_ACCESS_SECRET_KEY as string,
    (err, decoded) => {
      if (err) {
        return res.status(403).json({
          message:
            'Forbidden: Invalid or expired token',
        });
      }

      const { id, email, role } =
        decoded as JwtPayload & {
          payload: TokenPayloadProps;
        };

      req.user = { id, email, role };
      next();
    }
  );
};

// Middleware to check if the user is an Admin
export const verifyAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.role === Role.ADMIN) {
    return next();
  } else {
    res.status(403).json({
      message:
        'You are not authorized to access this resource',
    });
    return;
  }
};

// Middleware to check if the user is a Manager
export const verifyManager = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.role === Role.MANAGER) {
    return next();
  } else {
    res.status(403).json({
      message:
        'You are not authorized to access this resource',
    });
    return;
  }
};

// Middleware to check if the user is authenticated but does not require a specific role
export const verifyUser = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  if (req.user) {
    return next();
  } else {
    return res.status(401).json({
      message:
        'You need to be logged in to access this resource',
    });
  }
};

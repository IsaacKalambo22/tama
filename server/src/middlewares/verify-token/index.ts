import { Role } from '@prisma/client';
import {
  NextFunction,
  Request,
  Response,
} from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { TokenPayloadProps } from '../../types';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayloadProps; // Add user to the request object
    }
  }
}

export const verifyJWT = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  // Retrieve the authorization header or assign an empty string if it's null/undefined
  const authorizationHeader =
    req.headers['authorization'] ||
    req.headers['Authorization'] ||
    '';

  const authHeader =
    authorizationHeader.toString();

  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message:
        'Unauthorized: Invalid token format',
    });
  }

  // Extract the token from the authorization header
  const token = authHeader.split(' ')[1];

  // Verify the token with JWT
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

      // Extract user information from the decoded payload
      const { id, email, role } =
        decoded as JwtPayload & {
          payload: TokenPayloadProps;
        };

      // Attach user information to the request object
      req.user = { id, email, role };
      next();
    }
  );
};

export const verifyAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  // Ensure the token is verified first
  verifyJWT(req, res, () => {
    if (req.user?.role === Role.ADMIN) {
      // Proceed if the user is an admin
      return next();
    } else {
      // Directly return a 403 Forbidden response if the user is not an admin
      return res.status(403).json({
        message:
          'You are not authorized to access this resource',
      });
    }
  });
};
export const verifyManager = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  // Ensure the token is verified first
  verifyJWT(req, res, () => {
    if (req.user?.role === Role.MANAGER) {
      // Proceed if the user is an admin
      return next();
    } else {
      // Directly return a 403 Forbidden response if the user is not an admin
      return res.status(403).json({
        message:
          'You are not authorized to access this resource',
      });
    }
  });
};

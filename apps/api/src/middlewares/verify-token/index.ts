import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import { Role } from "../../../prisma/generated/prisma"
import { TokenPayloadProps } from "../../types"

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayloadProps
    }
  }
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authorizationHeader =
    req.headers["authorization"] || req.headers["Authorization"] || ""

  const authHeader = authorizationHeader.toString()
  if (!authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      message: "Unauthorized: Invalid token format",
    })
    return
  }

  const token = authHeader.split(" ")[1]

  jwt.verify(
    token,
    process.env.JWT_ACCESS_SECRET_KEY as string,
    (err, decoded) => {
      if (err) {
        return res.status(403).json({
          message: "Forbidden: Invalid or expired token",
        })
      }
      const { id, email, role, councilId, districtId } =
        decoded as TokenPayloadProps

      req.user = { id, email, role, councilId, districtId }
      next()
    }
  )
}

export const verifySuperAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  verifyToken(req, res, () => {
    if (req.user?.role === Role.SUPER_ADMIN) {
      return next()
    } else {
      return res.status(403).json({
        message: "Forbidden: Super Admin access required",
      })
    }
  })
}

export const verifyCouncilAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  verifyToken(req, res, () => {
    if (
      req.user?.role === Role.COUNCIL_ADMIN ||
      req.user?.role === Role.SUPER_ADMIN
    ) {
      return next()
    } else {
      return res.status(403).json({
        message: "Forbidden: Council Admin access required",
      })
    }
  })
}

export const verifyDistrictAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  verifyToken(req, res, () => {
    if (
      req.user?.role === Role.DISTRICT_ADMIN ||
      req.user?.role === Role.COUNCIL_ADMIN ||
      req.user?.role === Role.SUPER_ADMIN
    ) {
      return next()
    } else {
      return res.status(403).json({
        message: "Forbidden: District Admin access required",
      })
    }
  })
}

export const verifyFarmer = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  verifyToken(req, res, () => {
    if (
      req.user?.role === Role.FARMER ||
      req.user?.role === Role.DISTRICT_ADMIN ||
      req.user?.role === Role.COUNCIL_ADMIN ||
      req.user?.role === Role.SUPER_ADMIN
    ) {
      return next()
    } else {
      return res.status(403).json({
        message: "Forbidden: Farmer access required",
      })
    }
  })
}

export const verifyRole = (roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    verifyToken(req, res, () => {
      if (roles.includes(req.user?.role as Role)) {
        return next()
      } else {
        return res.status(403).json({
          message: `Forbidden: One of [${roles.join(", ")}] roles required`,
        })
      }
    })
  }
}

// Backward-compatible aliases for existing routes
export const verifyAdmin = verifySuperAdmin
export const verifyManager = verifyCouncilAdmin
export const verifyAdminAndManager = verifySuperAdmin

// Gate for composing/sending messages — SUPER_ADMIN, COUNCIL_ADMIN and
// DISTRICT_ADMIN may compose; FARMER is receive-only. (verifyDistrictAdmin
// already admits exactly those three roles.)
export const verifyMessageSender = verifyDistrictAdmin

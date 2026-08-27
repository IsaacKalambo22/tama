import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import { TokenPayloadProps } from "../../types"

export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authorizationHeader =
    req.headers["authorization"] || req.headers["Authorization"] || ""

  const authHeader = authorizationHeader.toString()
  if (!authHeader.startsWith("Bearer ") || !authHeader.split(" ")[1]) {
    return next()
  }

  const token = authHeader.split(" ")[1]

  jwt.verify(
    token,
    process.env.JWT_ACCESS_SECRET_KEY as string,
    (err, decoded) => {
      if (err) {
        return next()
      }
      const { id, email, role, councilId, districtId } =
        decoded as TokenPayloadProps
      req.user = { id, email, role, councilId, districtId }
      next()
    }
  )
}

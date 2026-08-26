import jwt from "jsonwebtoken"
import { Role } from "../../../prisma/generated/prisma/client"

interface TokenResponse {
  access_token: string
  refresh_token: string
}

export const generateTokens = (
  id: string,
  email: string,
  role: Role,
  councilId?: string | null,
  districtId?: string | null
): TokenResponse => {
  const payload = {
    id,
    email,
    role,
    councilId: councilId || undefined,
    districtId: districtId || undefined,
  }

  const access_token = jwt.sign(
    payload,
    process.env.JWT_ACCESS_SECRET_KEY as string,
    {
      expiresIn: "7d",
      algorithm: "HS256",
    }
  )

  const refresh_token = jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET_KEY as string,
    {
      expiresIn: "1d",
      algorithm: "HS256",
    }
  )

  return { access_token, refresh_token }
}

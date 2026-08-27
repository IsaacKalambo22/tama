import { NextFunction, Request, Response } from "express"
import { Role } from "../../../prisma/generated/prisma"
import prisma from "../../config"

/**
 * Scope-aware middleware that verifies the logged-in user has access
 * to the requested resource based on their role and assigned scope.
 *
 * For COUNCIL_ADMIN: checks the resource belongs to their councilId
 * For DISTRICT_ADMIN: checks the resource belongs to their districtId
 * For FARMER: checks the resource is their own record
 * For SUPER_ADMIN: full access, no scope check
 */

type ResourceType = "council" | "district" | "user" | "councilList"

interface ScopeCheckOptions {
  resourceType: ResourceType
  paramName?: string
  allowOwnRecord?: boolean
}

async function getResourceScope(
  resourceType: ResourceType,
  resourceId: string
): Promise<{ councilId?: string; districtId?: string; userId?: string }> {
  switch (resourceType) {
    case "council": {
      const council = await prisma.council.findUnique({
        where: { id: resourceId },
        select: { id: true },
      })
      return council ? { councilId: council.id } : {}
    }
    case "district": {
      const district = await prisma.district.findUnique({
        where: { id: resourceId },
        select: { councilId: true, id: true },
      })
      return district
        ? { councilId: district.councilId, districtId: district.id }
        : {}
    }
    case "user": {
      const user = await prisma.user.findUnique({
        where: { id: resourceId },
        select: { councilId: true, districtId: true, id: true },
      })
      return user
        ? {
            councilId: user.councilId ?? undefined,
            districtId: user.districtId ?? undefined,
            userId: user.id,
          }
        : {}
    }
    case "councilList": {
      const entry = await prisma.councilList.findUnique({
        where: { id: resourceId },
        select: { councilId: true },
      })
      return entry ? { councilId: entry.councilId ?? undefined } : {}
    }
    default:
      return {}
  }
}

export const verifyScope = (options: ScopeCheckOptions) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const user = req.user

    if (!user) {
      res.status(401).json({ message: "Unauthorized" })
      return
    }

    if (user.role === Role.SUPER_ADMIN) {
      return next()
    }

    const resourceId = String(
      req.params[options.paramName || "id"] || req.params.id || ""
    )

    if (!resourceId) {
      return next()
    }

    try {
      const scope = await getResourceScope(options.resourceType, resourceId)

      if (!scope.councilId && !scope.districtId && !scope.userId) {
        res.status(404).json({ message: "Resource not found" })
        return
      }

      if (user.role === Role.COUNCIL_ADMIN) {
        if (scope.councilId && scope.councilId === user.councilId) {
          return next()
        }
        res.status(403).json({
          message: "Forbidden: Resource outside your council scope",
        })
        return
      }

      if (user.role === Role.DISTRICT_ADMIN) {
        if (scope.districtId && scope.districtId === user.districtId) {
          return next()
        }
        if (scope.councilId && scope.councilId === user.councilId) {
          return next()
        }
        res.status(403).json({
          message: "Forbidden: Resource outside your district scope",
        })
        return
      }

      if (user.role === Role.FARMER) {
        if (options.allowOwnRecord && scope.userId === user.id) {
          return next()
        }
        res.status(403).json({
          message: "Forbidden: You can only access your own records",
        })
        return
      }

      res.status(403).json({ message: "Forbidden" })
    } catch (error) {
      console.error("Scope verification error:", error)
      res.status(500).json({ message: "Internal server error" })
    }
  }
}

export const filterByScope = async (
  user: {
    id?: string
    role: string
    councilId?: string | null
    districtId?: string | null
  },
  where: Record<string, any> = {}
) => {
  if (user.role === Role.SUPER_ADMIN) {
    return where
  }

  if (user.role === Role.COUNCIL_ADMIN && user.councilId) {
    return { ...where, councilId: user.councilId }
  }

  if (user.role === Role.DISTRICT_ADMIN) {
    if (user.districtId) {
      return { ...where, districtId: user.districtId }
    }
    if (user.councilId) {
      return { ...where, councilId: user.councilId }
    }
  }

  if (user.role === Role.FARMER) {
    return { ...where, id: user.id }
  }

  return where
}

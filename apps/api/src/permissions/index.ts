import { Role } from "../../prisma/generated/prisma"

export interface ScopeUser {
  id: string
  role: Role
  councilId?: string | null
  districtId?: string | null
}

export interface TargetUser {
  id: string
  role: Role
  councilId?: string | null
  districtId?: string | null
}

export const ROLE_HIERARCHY: Record<Role, number> = {
  [Role.SUPER_ADMIN]: 4,
  [Role.COUNCIL_ADMIN]: 3,
  [Role.DISTRICT_ADMIN]: 2,
  [Role.FARMER]: 1,
}

const CREATABLE_ROLES: Record<Role, Role[]> = {
  [Role.SUPER_ADMIN]: [
    Role.SUPER_ADMIN,
    Role.COUNCIL_ADMIN,
    Role.DISTRICT_ADMIN,
    Role.FARMER,
  ],
  [Role.COUNCIL_ADMIN]: [Role.DISTRICT_ADMIN, Role.FARMER],
  [Role.DISTRICT_ADMIN]: [Role.FARMER],
  [Role.FARMER]: [],
}

export function canAssignRole(actor: ScopeUser, role: Role): boolean {
  return CREATABLE_ROLES[actor.role]?.includes(role) ?? false
}

/**
 * A user is readable by the actor when the target lives inside the actor's
 * own scope (or is the actor's own record for a FARMER).
 */
export function canReadUser(actor: ScopeUser, target: TargetUser): boolean {
  if (actor.role === Role.SUPER_ADMIN) return true
  if (actor.role === Role.COUNCIL_ADMIN) {
    return Boolean(
      target.councilId &&
      actor.councilId &&
      target.councilId === actor.councilId
    )
  }
  if (actor.role === Role.DISTRICT_ADMIN) {
    if (
      target.districtId &&
      actor.districtId &&
      target.districtId === actor.districtId
    ) {
      return true
    }
    return Boolean(
      target.councilId &&
      actor.councilId &&
      target.councilId === actor.councilId
    )
  }
  if (actor.role === Role.FARMER) {
    return target.id === actor.id
  }
  return false
}

/**
 * A target can be managed (updated/deleted) by the actor when it is within
 * their scope AND the actor is allowed to manage that target role.
 */
export function canManageUser(actor: ScopeUser, target: TargetUser): boolean {
  if (actor.role === Role.SUPER_ADMIN) return true

  if (actor.role === Role.COUNCIL_ADMIN) {
    if (!(target.role === Role.FARMER || target.role === Role.DISTRICT_ADMIN)) {
      return false
    }
    return Boolean(
      target.councilId &&
      actor.councilId &&
      target.councilId === actor.councilId
    )
  }

  if (actor.role === Role.DISTRICT_ADMIN) {
    if (target.role !== Role.FARMER) return false
    return Boolean(
      target.districtId &&
      actor.districtId &&
      target.districtId === actor.districtId
    )
  }

  return false
}

/** Manageable user ids for the actor (for scoped update/delete lookups). */
export function scopeWhereForUsers(actor: ScopeUser): {
  councilId?: string
  districtId?: string
  id?: string
} {
  if (actor.role === Role.SUPER_ADMIN) return {}
  if (actor.role === Role.COUNCIL_ADMIN)
    return { councilId: actor.councilId ?? undefined }
  if (actor.role === Role.DISTRICT_ADMIN)
    return { districtId: actor.districtId ?? undefined }
  return { id: actor.id }
}

import { MessageTargetType, User } from "../../prisma/generated/prisma"
import prisma from "../config"
import { normalizeMany } from "../messaging/phone"

export interface ResolveAudienceInput {
  targetType: MessageTargetType
  /**
   * RecipientGroup id (GROUP), a district name (DISTRICT), or a
   * council/district name (COUNCIL). Unused for INDIVIDUALS.
   */
  targetRef?: string | null
  /** User ids to target directly. Only used when targetType is INDIVIDUALS. */
  individualIds?: string[]
}

/**
 * Resolves a message target — individuals, a saved group, or an existing
 * district/council — to the current list of recipient users.
 *
 * This is the single source of truth for "who does 'send to district X' mean"
 * so the in-app, email and SMS channels never diverge. Call it at send/fire
 * time (not at compose time) so a scheduled send picks up membership changes
 * that happen before it fires — see apps/api/src/messaging/scheduler.ts.
 *
 *
 * There is no FK between User and District/Council yet — User.district is a
 * free-text field the user sets on their profile. So, until that relation
 * exists, DISTRICT and COUNCIL both match User.district against the given
 * district/council name (case-insensitive).
 */
export async function resolveAudience(
  input: ResolveAudienceInput
): Promise<User[]> {
  switch (input.targetType) {
    case "INDIVIDUALS": {
      const ids = (input.individualIds ?? []).filter(Boolean)
      if (ids.length === 0) return []
      return prisma.user.findMany({ where: { id: { in: ids } } })
    }

    case "GROUP": {
      if (!input.targetRef) return []
      const members = await prisma.recipientGroupMember.findMany({
        where: { groupId: input.targetRef },
        include: { user: true },
      })
      return members.map((member) => member.user)
    }

    case "DISTRICT": {
      if (!input.targetRef) return []
      return prisma.user.findMany({
        where: {
          district: { equals: input.targetRef, mode: "insensitive" },
        },
      })
    }

    case "COUNCIL": {
      if (!input.targetRef) return []
      return prisma.user.findMany({
        where: {
          district: { equals: input.targetRef, mode: "insensitive" },
        },
      })
    }

    default:
      return []
  }
}

/** Count-only variant, cheaper than resolveAudience for preview/estimate UI. */
export async function countAudience(
  input: ResolveAudienceInput
): Promise<number> {
  switch (input.targetType) {
    case "INDIVIDUALS":
      return (input.individualIds ?? []).filter(Boolean).length
    case "GROUP": {
      if (!input.targetRef) return 0
      return prisma.recipientGroupMember.count({
        where: { groupId: input.targetRef },
      })
    }
    case "DISTRICT": {
      if (!input.targetRef) return 0
      return prisma.user.count({
        where: {
          district: { equals: input.targetRef, mode: "insensitive" },
        },
      })
    }
    case "COUNCIL": {
      if (!input.targetRef) return 0
      return prisma.user.count({
        where: {
          district: { equals: input.targetRef, mode: "insensitive" },
        },
      })
    }
    default:
      return 0
  }
}

export interface AudienceContacts {
  users: User[]
  /** De-duplicated, lower-cased email addresses. */
  emails: string[]
  /** De-duplicated E.164 phone numbers. */
  phones: string[]
  /** Raw phone strings that could not be normalized to E.164. */
  invalidPhones: string[]
}

/**
 * resolveAudience plus channel-ready contact lists — used by the multi-channel
 * dispatch layer so it doesn't re-walk the user list per channel.
 */
export async function resolveAudienceContacts(
  input: ResolveAudienceInput
): Promise<AudienceContacts> {
  const users = await resolveAudience(input)

  const emails = Array.from(
    new Set(
      users
        .map((u) => u.email?.trim().toLowerCase())
        .filter((e): e is string => !!e)
    )
  )

  const { valid: phones, invalid: invalidPhones } = normalizeMany(
    users.map((u) => u.phoneNumber).filter((p): p is string => !!p)
  )

  return { users, emails, phones, invalidPhones }
}

import { NotificationTargetType, User } from "../../prisma/generated/prisma"
import prisma from "../config"

export interface ResolveAudienceInput {
  targetType: NotificationTargetType
  /**
   * RecipientGroup id (GROUP), a district name (DISTRICT), or a
   * CouncilList id (COUNCIL). Unused for INDIVIDUALS.
   */
  targetRef?: string | null
  /** User ids to target directly. Only used when targetType is INDIVIDUALS. */
  individualIds?: string[]
}

/**
 * Resolves a notification target — individuals, a saved group, or an
 * existing district/council — to the current list of recipient users.
 *
 * This is the single source of truth for "who does 'send to district X'
 * mean" so the in-app and email notification modules never diverge. Call it
 * at send/fire time (not at compose time) so a scheduled send picks up
 * membership changes that happen before it fires — see
 * apps/api/src/notifications/scheduler.ts.
 *
 * Districts and councils reuse the existing CouncilList table rather than
 * inventing a parallel concept, but there is no FK between User and
 * CouncilList yet — User.district is a free-text field the user sets on
 * their profile. So, until that relation exists:
 *   - DISTRICT matches User.district against the given district name
 *     (case-insensitive).
 *   - COUNCIL resolves the given CouncilList row, then matches
 *     User.district against that row's `council` name (case-insensitive).
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
      const council = await prisma.councilList.findUnique({
        where: { id: input.targetRef },
      })
      if (!council) return []
      return prisma.user.findMany({
        where: {
          district: { equals: council.council, mode: "insensitive" },
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
      const council = await prisma.councilList.findUnique({
        where: { id: input.targetRef },
      })
      if (!council) return 0
      return prisma.user.count({
        where: {
          district: { equals: council.council, mode: "insensitive" },
        },
      })
    }
    default:
      return 0
  }
}

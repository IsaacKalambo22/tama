import { Request, Response } from "express"
import { Role } from "../../../prisma/generated/prisma"
import prisma from "../../config"
import { APIResponse } from "../../types"

/**
 * Farmer support / help desk.
 *
 * Deliberately reuses the existing messaging tables rather than a new model:
 *   - Each support conversation is a `MessageBatch` whose sender is a FARMER.
 *     Farmers never compose batches anywhere else, so "sender.role === FARMER"
 *     is a reliable marker for a support thread.
 *   - Every post (the opening question and each reply) fans out to one
 *     `InAppMessage` per other participant, so it also lands in their normal
 *     Inbox + bell with zero extra plumbing.
 *   - `MessageBatch.status` tracks the ticket state: SENT = open,
 *     RESOLVED = handled. A farmer reply reopens a RESOLVED thread.
 *
 * Rows that belong to the same logical post share an identical `createdAt`
 * (set explicitly on the createMany), which is how the thread view regroups
 * the per-recipient rows back into posts.
 */

const OPEN = "SENT" as const
const RESOLVED = "RESOLVED" as const

interface Actor {
  id: string
  role: string
  councilId?: string
  districtId?: string
}

/** The managers who should receive a given farmer's support requests. */
async function resolveManagers(farmer: Actor) {
  const or: Record<string, unknown>[] = [{ role: Role.SUPER_ADMIN }]
  if (farmer.districtId)
    or.push({ role: Role.DISTRICT_ADMIN, districtId: farmer.districtId })
  if (farmer.councilId)
    or.push({ role: Role.COUNCIL_ADMIN, councilId: farmer.councilId })

  return prisma.user.findMany({
    where: { OR: or, id: { not: farmer.id } },
    select: { id: true, name: true },
  })
}

/** Whether `actor` (a manager) is allowed to see/answer `batch`. */
function managerCanAccess(
  actor: Actor,
  batch: {
    individualIds: string[]
    sender: { councilId: string | null; districtId: string | null }
  }
): boolean {
  if (actor.role === Role.SUPER_ADMIN) return true
  if (batch.individualIds.includes(actor.id)) return true
  if (
    actor.role === Role.COUNCIL_ADMIN &&
    actor.councilId &&
    batch.sender.councilId === actor.councilId
  )
    return true
  if (
    actor.role === Role.DISTRICT_ADMIN &&
    actor.districtId &&
    batch.sender.districtId === actor.districtId
  )
    return true
  return false
}

/** Scope filter for a manager listing farmers' support threads. */
function managerScopeWhere(actor: Actor): Record<string, unknown> {
  if (actor.role === Role.SUPER_ADMIN) return {}
  if (actor.role === Role.COUNCIL_ADMIN && actor.councilId)
    return { councilId: actor.councilId }
  if (actor.role === Role.DISTRICT_ADMIN && actor.districtId)
    return { districtId: actor.districtId }
  if (actor.role === Role.DISTRICT_ADMIN && actor.councilId)
    return { councilId: actor.councilId }
  // A manager with no scope assigned sees nothing rather than everything.
  return { id: "__none__" }
}

const isManager = (role: string) =>
  role === Role.SUPER_ADMIN ||
  role === Role.COUNCIL_ADMIN ||
  role === Role.DISTRICT_ADMIN

/**
 * POST /support
 * A farmer opens a new support request.
 */
export const createSupportRequest = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const actor = req.user as Actor
  const subject = String(req.body.subject ?? "").trim()
  const message = String(req.body.message ?? "").trim()

  if (subject.length < 3 || message.length < 3) {
    res.status(400).json({
      success: false,
      message: "A subject and a message (min. 3 characters) are required.",
    })
    return
  }

  try {
    const managers = await resolveManagers(actor)

    if (managers.length === 0) {
      res.status(409).json({
        success: false,
        message:
          "No manager is available to receive your request right now. Please try again later.",
      })
      return
    }

    const postedAt = new Date()

    const batch = await prisma.messageBatch.create({
      data: {
        senderId: actor.id,
        targetType: "INDIVIDUALS",
        individualIds: managers.map((m) => m.id),
        channels: ["IN_APP"],
        inAppTitle: subject,
        inAppBody: message,
        status: OPEN,
      },
    })

    await prisma.inAppMessage.createMany({
      data: managers.map((m) => ({
        batchId: batch.id,
        senderId: actor.id,
        recipientId: m.id,
        title: `Support request: ${subject}`,
        body: message,
        createdAt: postedAt,
      })),
    })

    res.status(201).json({
      success: true,
      message: "Support request submitted",
      data: { id: batch.id },
    })
  } catch (error: any) {
    console.error("Error creating support request:", error.message)
    res.status(500).json({
      success: false,
      message: "An error occurred while submitting your request.",
      error: error.message,
    })
  }
}

/**
 * GET /support
 * Farmer: their own requests. Manager: requests from farmers in their scope.
 */
export const listSupportRequests = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const actor = req.user as Actor

  try {
    const where: Record<string, unknown> = isManager(actor.role)
      ? { sender: { is: { role: Role.FARMER, ...managerScopeWhere(actor) } } }
      : { senderId: actor.id }

    const batches = await prisma.messageBatch.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            districtRel: { select: { name: true } },
            council: { select: { name: true } },
          },
        },
      },
    })

    const threads = await Promise.all(
      batches.map(async (batch) => {
        const [latest, unread] = await Promise.all([
          prisma.inAppMessage.findFirst({
            where: { batchId: batch.id },
            orderBy: { createdAt: "desc" },
            select: { body: true, createdAt: true },
          }),
          prisma.inAppMessage.count({
            where: { batchId: batch.id, recipientId: actor.id, read: false },
          }),
        ])

        return {
          id: batch.id,
          subject: batch.inAppTitle ?? "",
          status: batch.status,
          createdAt: batch.createdAt,
          updatedAt: batch.updatedAt,
          farmer: {
            id: batch.sender.id,
            name: batch.sender.name,
            district: batch.sender.districtRel?.name ?? null,
            council: batch.sender.council?.name ?? null,
          },
          lastMessage: latest?.body ?? batch.inAppBody ?? "",
          lastMessageAt: latest?.createdAt ?? batch.createdAt,
          unreadCount: unread,
        }
      })
    )

    res.status(200).json({
      success: true,
      message: "Support requests retrieved successfully",
      data: threads,
    })
  } catch (error: any) {
    console.error("Error listing support requests:", error.message)
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching support requests.",
      error: error.message,
    })
  }
}

async function loadThread(id: string) {
  return prisma.messageBatch.findUnique({
    where: { id },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          councilId: true,
          districtId: true,
          districtRel: { select: { name: true } },
          council: { select: { name: true } },
        },
      },
    },
  })
}

function assertParticipant(
  actor: Actor,
  batch: NonNullable<Awaited<ReturnType<typeof loadThread>>>
): boolean {
  if (batch.senderId === actor.id) return true
  if (isManager(actor.role) && managerCanAccess(actor, batch)) return true
  return false
}

/**
 * GET /support/:id
 * The full conversation. Marks the caller's own rows in this thread as read.
 */
export const getSupportThread = async (
  req: Request<{ id: string }>,
  res: Response<APIResponse>
): Promise<void> => {
  const actor = req.user as Actor
  const { id } = req.params

  try {
    const batch = await loadThread(id)

    if (!batch || batch.sender == null) {
      res.status(404).json({ success: false, message: "Request not found." })
      return
    }
    if (!assertParticipant(actor, batch)) {
      res.status(403).json({
        success: false,
        message: "You do not have access to this request.",
      })
      return
    }

    const rows = await prisma.inAppMessage.findMany({
      where: { batchId: id },
      orderBy: { createdAt: "asc" },
      select: { senderId: true, body: true, createdAt: true },
    })

    // Regroup the per-recipient rows back into one entry per logical post.
    const seen = new Set<string>()
    const posts: {
      authorId: string | null
      body: string
      createdAt: Date
    }[] = []
    for (const row of rows) {
      const key = `${row.senderId}|${row.createdAt.toISOString()}`
      if (seen.has(key)) continue
      seen.add(key)
      posts.push({
        authorId: row.senderId,
        body: row.body,
        createdAt: row.createdAt,
      })
    }

    const authorIds = Array.from(
      new Set(posts.map((p) => p.authorId).filter((x): x is string => !!x))
    )
    const authors = await prisma.user.findMany({
      where: { id: { in: authorIds } },
      select: { id: true, name: true, role: true },
    })
    const authorById = new Map(authors.map((a) => [a.id, a]))

    await prisma.inAppMessage.updateMany({
      where: { batchId: id, recipientId: actor.id, read: false },
      data: { read: true, readAt: new Date() },
    })

    res.status(200).json({
      success: true,
      message: "Support thread retrieved successfully",
      data: {
        id: batch.id,
        subject: batch.inAppTitle ?? "",
        status: batch.status,
        createdAt: batch.createdAt,
        farmer: {
          id: batch.sender.id,
          name: batch.sender.name,
          district: batch.sender.districtRel?.name ?? null,
          council: batch.sender.council?.name ?? null,
        },
        posts: posts.map((p) => ({
          authorId: p.authorId,
          authorName: p.authorId
            ? (authorById.get(p.authorId)?.name ?? "Unknown")
            : "Unknown",
          authorRole: p.authorId
            ? (authorById.get(p.authorId)?.role ?? null)
            : null,
          body: p.body,
          createdAt: p.createdAt,
          mine: p.authorId === actor.id,
        })),
      },
    })
  } catch (error: any) {
    console.error("Error fetching support thread:", error.message)
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the request.",
      error: error.message,
    })
  }
}

/**
 * POST /support/:id/reply
 * Adds a message to the thread and pings every other participant.
 */
export const replyToSupportThread = async (
  req: Request<{ id: string }>,
  res: Response<APIResponse>
): Promise<void> => {
  const actor = req.user as Actor
  const { id } = req.params
  const message = String(req.body.message ?? "").trim()

  if (message.length < 1) {
    res
      .status(400)
      .json({ success: false, message: "Message cannot be empty." })
    return
  }

  try {
    const batch = await loadThread(id)

    if (!batch || batch.sender == null) {
      res.status(404).json({ success: false, message: "Request not found." })
      return
    }
    if (!assertParticipant(actor, batch)) {
      res.status(403).json({
        success: false,
        message: "You do not have access to this request.",
      })
      return
    }

    // Everyone on the thread so far: the farmer plus every manager who was
    // notified or has since joined by replying.
    const participantIds = new Set<string>([
      batch.senderId,
      ...batch.individualIds,
    ])
    participantIds.add(actor.id)
    const recipients = Array.from(participantIds).filter((x) => x !== actor.id)

    const managerJoining =
      isManager(actor.role) && !batch.individualIds.includes(actor.id)
    const farmerReopening =
      actor.id === batch.senderId && batch.status === RESOLVED

    const postedAt = new Date()

    await prisma.$transaction([
      prisma.inAppMessage.createMany({
        data: recipients.map((rid) => ({
          batchId: batch.id,
          senderId: actor.id,
          recipientId: rid,
          title: `Support request: ${batch.inAppTitle ?? ""}`,
          body: message,
          createdAt: postedAt,
        })),
      }),
      prisma.messageBatch.update({
        where: { id: batch.id },
        data: {
          // Rewriting individualIds keeps this update non-empty so @updatedAt
          // always bumps and the thread sorts to the top of the list.
          individualIds: managerJoining
            ? [...batch.individualIds, actor.id]
            : batch.individualIds,
          ...(farmerReopening ? { status: OPEN } : {}),
        },
      }),
    ])

    res.status(201).json({
      success: true,
      message: "Reply sent",
      data: { id: batch.id },
    })
  } catch (error: any) {
    console.error("Error replying to support thread:", error.message)
    res.status(500).json({
      success: false,
      message: "An error occurred while sending your reply.",
      error: error.message,
    })
  }
}

/**
 * PATCH /support/:id/status  { status: "RESOLVED" | "SENT" }
 * Managers mark a request handled or reopen it.
 */
export const setSupportThreadStatus = async (
  req: Request<{ id: string }>,
  res: Response<APIResponse>
): Promise<void> => {
  const actor = req.user as Actor
  const { id } = req.params
  const next = req.body.status === RESOLVED ? RESOLVED : OPEN

  if (!isManager(actor.role)) {
    res.status(403).json({
      success: false,
      message: "Only a manager can change a request's status.",
    })
    return
  }

  try {
    const batch = await loadThread(id)

    if (!batch || batch.sender == null) {
      res.status(404).json({ success: false, message: "Request not found." })
      return
    }
    if (!managerCanAccess(actor, batch)) {
      res.status(403).json({
        success: false,
        message: "You do not have access to this request.",
      })
      return
    }

    const updated = await prisma.messageBatch.update({
      where: { id: batch.id },
      data: { status: next },
      select: { id: true, status: true },
    })

    res.status(200).json({
      success: true,
      message:
        next === RESOLVED ? "Request marked as resolved" : "Request reopened",
      data: updated,
    })
  } catch (error: any) {
    console.error("Error updating support thread status:", error.message)
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the request.",
      error: error.message,
    })
  }
}

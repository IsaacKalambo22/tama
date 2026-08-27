import { Request, Response } from "express"
import prisma from "../../config"
import { InfisendError, sendEmail } from "../../infisend/client"
import { APIResponse } from "../../types"

/**
 * GET /admin/email/config
 * Returns the current email defaults (fromName, replyTo).
 * These are env-driven, not DB-stored.
 */
export const getEmailConfig = async (
  _req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  res.status(200).json({
    success: true,
    message: "Email config retrieved successfully",
    data: {
      fromName: process.env.INFISEND_DEFAULT_FROM_NAME || "",
      replyTo: process.env.INFISEND_DEFAULT_REPLY_TO || "",
    },
  })
}

/**
 * PATCH /admin/email/config
 * Returns updated config. Since these are env vars, the values
 * can only be changed by redeploying — this endpoint returns the
 * current values as a read-only confirmation. In the future, these
 * could be stored in a DB table for runtime updates.
 */
export const updateEmailConfig = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { fromName, replyTo } = req.body

  // For now, return guidance that these are env-driven
  const config: Record<string, string> = {}

  if (fromName !== undefined) {
    config.fromName = fromName
  }
  if (replyTo !== undefined) {
    config.replyTo = replyTo
  }

  res.status(200).json({
    success: true,
    message:
      "Email config defaults are managed via environment variables (INFISEND_DEFAULT_FROM_NAME, INFISEND_DEFAULT_REPLY_TO). Update and redeploy to change.",
    data: {
      current: {
        fromName: process.env.INFISEND_DEFAULT_FROM_NAME || "",
        replyTo: process.env.INFISEND_DEFAULT_REPLY_TO || "",
      },
      requested: config,
    },
  })
}

/**
 * POST /admin/email/test-send
 * Fires a real InfiSend send to the provided address using current defaults.
 */
export const testSendEmail = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { to, subject, text, html } = req.body

  if (!to) {
    res.status(400).json({
      success: false,
      message: "Recipient email address (to) is required.",
    })
    return
  }

  const fromName =
    process.env.INFISEND_DEFAULT_FROM_NAME || "TAMA Farmers Trust"
  const replyTo = process.env.INFISEND_DEFAULT_REPLY_TO

  try {
    const result = await sendEmail({
      to,
      subject: subject || "TAMA Farmers Trust — Test Email",
      text:
        text ||
        "This is a test email from TAMA Farmers Trust. If you received this, the InfiSend integration is working correctly.",
      html:
        html ||
        "<p>This is a test email from <b>TAMA Farmers Trust</b>. If you received this, the InfiSend integration is working correctly.</p>",
      fromName,
      replyTo,
    })

    // Persist the tracking record
    await prisma.emailMessage.create({
      data: {
        messageId: result.messageId,
        event: "admin.test-send",
        recipient: to,
        status: "QUEUED",
      },
    })

    res.status(202).json({
      success: true,
      message: "Test email queued successfully",
      data: {
        messageId: result.messageId,
        status: result.status,
        estimatedCost: result.estimatedCost,
      },
    })
  } catch (error) {
    if (error instanceof InfisendError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
        error: error.name,
      })
      return
    }
    console.error("Error sending test email:", error)
    res.status(500).json({
      success: false,
      message: "An error occurred while sending the test email.",
    })
  }
}

/**
 * GET /admin/email/log
 * Paginated list of EmailMessage rows.
 * Query params: page (default 1), limit (default 25), status, event, recipient
 */
export const getEmailLog = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1)
  const limit = Math.min(
    100,
    Math.max(1, parseInt(req.query.limit as string) || 25)
  )
  const skip = (page - 1) * limit

  const where: Record<string, unknown> = {}

  if (req.query.status) {
    where.status = req.query.status as string
  }
  if (req.query.event) {
    where.event = req.query.event as string
  }
  if (req.query.recipient) {
    where.recipient = {
      contains: req.query.recipient as string,
      mode: "insensitive",
    }
  }

  try {
    const [notifications, total] = await Promise.all([
      prisma.emailMessage.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.emailMessage.count({ where }),
    ])

    res.status(200).json({
      success: true,
      message: "Email log retrieved successfully",
      data: {
        notifications,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    })
  } catch (error) {
    console.error("Error fetching email log:", error)
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the email log.",
    })
  }
}

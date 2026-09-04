import { Request, Response } from "express"
import prisma from "../../config"
import { InfisendError, sendSms } from "../../infisend/client"
import { normalizeE164 } from "../../messaging/phone"
import { APIResponse } from "../../types"

/**
 * POST /admin/sms/test-send
 * Fires a real InfiSend SMS to the given number to verify the integration
 * end-to-end. The number is normalized/validated to E.164 first.
 */
export const testSendSms = async (
  req: Request,
  res: Response<APIResponse>
): Promise<void> => {
  const { to, message } = req.body

  if (!to) {
    res.status(400).json({
      success: false,
      message: "Recipient phone number (to) is required.",
    })
    return
  }

  const normalized = normalizeE164(to)
  if (!normalized) {
    res.status(400).json({
      success: false,
      message: `"${to}" is not a valid phone number. Use E.164 format, e.g. +265991234567.`,
    })
    return
  }

  try {
    const result = await sendSms({
      to: normalized,
      message:
        message ||
        "TAMA Farmers Trust — test SMS. If you received this, the InfiSend SMS integration is working.",
    })

    await prisma.smsMessage.create({
      data: {
        messageId: result.messageId,
        event: "admin.test-send",
        recipient: normalized,
        message: message || null,
        status: "QUEUED",
      },
    })

    res.status(202).json({
      success: true,
      message: "Test SMS queued successfully",
      data: {
        messageId: result.messageId,
        status: result.status,
        estimatedCost: result.estimatedCost,
        parts: result.parts,
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
    console.error("Error sending test SMS:", error)
    res.status(500).json({
      success: false,
      message: "An error occurred while sending the test SMS.",
    })
  }
}

/**
 * GET /admin/sms/log
 * Paginated SmsMessage history. Query: page, limit, status, event, recipient.
 */
export const getSmsLog = async (
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
  if (req.query.status) where.status = req.query.status as string
  if (req.query.event) where.event = req.query.event as string
  if (req.query.recipient) {
    where.recipient = {
      contains: req.query.recipient as string,
      mode: "insensitive",
    }
  }

  try {
    const [messages, total] = await Promise.all([
      prisma.smsMessage.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.smsMessage.count({ where }),
    ])

    res.status(200).json({
      success: true,
      message: "SMS log retrieved successfully",
      data: {
        messages,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    })
  } catch (error) {
    console.error("Error fetching SMS log:", error)
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the SMS log.",
    })
  }
}

import crypto from "crypto"

const INFISEND_BASE_URL = "https://infisend-api.infi-tech.cloud/v1"

// ─── Error types ─────────────────────────────────────────────────────────────

export class InfisendError extends Error {
  statusCode: number
  issues?: Array<{ path: string; message: string }>

  constructor(
    message: string,
    statusCode: number,
    issues?: Array<{ path: string; message: string }>
  ) {
    super(message)
    this.name = "InfisendError"
    this.statusCode = statusCode
    this.issues = issues
  }
}

export class InsufficientWalletError extends InfisendError {
  constructor(message: string) {
    super(message, 402)
    this.name = "InsufficientWalletError"
  }
}

export class MissingScopeError extends InfisendError {
  constructor(message: string) {
    super(message, 403)
    this.name = "MissingScopeError"
  }
}

export class RateLimitError extends InfisendError {
  retryAfter: number

  constructor(message: string, retryAfter: number) {
    super(message, 429)
    this.name = "RateLimitError"
    this.retryAfter = retryAfter
  }
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SendEmailParams {
  to: string
  subject?: string
  text?: string
  html?: string
  templateId?: string
  variables?: Record<string, string>
  replyTo?: string
  fromName?: string
  scheduledFor?: string
  idempotencyKey?: string
}

export interface SendEmailResponse {
  messageId: string
  status: string
  channel: string
  to: string
  environment: string
  estimatedCost: string
  duplicate: boolean
  createdAt: string
}

export interface BulkSendEmailParams {
  recipients: Array<string | { to: string; variables?: Record<string, string> }>
  subject?: string
  text?: string
  html?: string
  templateId?: string
  variables?: Record<string, string>
  replyTo?: string
  fromName?: string
  scheduledFor?: string
  idempotencyKey?: string
}

export interface BulkSendEmailResponse {
  batchSize: number
  totalCost: string
  channel: string
  environment: string
  scheduledFor: string | null
  messages: SendEmailResponse[]
}

export interface SendSmsParams {
  to: string
  message?: string
  templateId?: string
  variables?: Record<string, string>
  senderId?: string
  scheduledFor?: string
  idempotencyKey?: string
}

export interface SendSmsResponse {
  messageId: string
  status: string
  channel: string
  to: string
  environment: string
  estimatedCost: string
  parts?: number
  duplicate: boolean
  createdAt: string
}

export interface BulkSendSmsParams {
  recipients?: Array<
    string | { to: string; variables?: Record<string, string> }
  >
  recipientsCsv?: string
  message?: string
  templateId?: string
  variables?: Record<string, string>
  senderId?: string
  scheduledFor?: string
  idempotencyKey?: string
}

export interface BulkSendSmsResponse {
  batchSize: number
  totalCost: string
  channel: string
  environment: string
  scheduledFor: string | null
  messages: SendSmsResponse[]
}

export interface BulkCostPreviewParams {
  channel: "EMAIL" | "SMS"
  recipients: string[]
}

export interface BulkCostPreviewResponse {
  channel: string
  recipientCount: number
  validCount: number
  invalidRecipients: string[]
  estimatedCost: string
  currency?: string
  perRecipient?: string
  unpricedRoutes?: string[]
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getApiKey(): string {
  const key = process.env.INFISEND_API_KEY
  if (!key) {
    throw new InfisendError("INFISEND_API_KEY is not configured", 500)
  }
  return key
}

function generateIdempotencyKey(): string {
  return `idem_${crypto.randomUUID()}`
}

/**
 * Shared non-2xx handler. Distinguishes wallet (402), scope (403) and
 * rate-limit (429) so callers can react — everything else becomes a generic
 * InfisendError carrying the provider's message and field issues.
 */
async function throwForStatus(response: Response): Promise<never> {
  const data = await response
    .json()
    .catch(() => ({}) as Record<string, unknown>)
  const message =
    (data as { message?: string }).message ||
    `InfiSend API error: ${response.status}`

  if (response.status === 402) {
    throw new InsufficientWalletError(message)
  }
  if (response.status === 403) {
    throw new MissingScopeError(message)
  }
  if (response.status === 429) {
    const retryAfter = parseInt(response.headers.get("Retry-After") || "60", 10)
    throw new RateLimitError(message, retryAfter)
  }

  throw new InfisendError(
    message,
    response.status,
    (data as { issues?: Array<{ path: string; message: string }> }).issues
  )
}

function assertInlineOrTemplate(opts: {
  hasInline: boolean
  hasTemplate: boolean
  inlineFieldsLabel: string
  requireSubject?: boolean
  hasSubject?: boolean
}): void {
  const { hasInline, hasTemplate, inlineFieldsLabel } = opts

  if (hasInline && hasTemplate) {
    throw new InfisendError(
      `Cannot provide both inline content (${inlineFieldsLabel}) and templateId. Use one or the other.`,
      400
    )
  }
  if (!hasInline && !hasTemplate) {
    throw new InfisendError(
      `Must provide either inline content (${inlineFieldsLabel}) or templateId.`,
      400
    )
  }
  if (opts.requireSubject && hasInline && !opts.hasSubject) {
    throw new InfisendError("Inline sends require a subject.", 400)
  }
}

// ─── Email ───────────────────────────────────────────────────────────────────

export async function sendEmail(
  params: SendEmailParams
): Promise<SendEmailResponse> {
  const {
    to,
    subject,
    text,
    html,
    templateId,
    variables,
    replyTo,
    fromName,
    scheduledFor,
    idempotencyKey,
  } = params

  const hasInline = !!(subject || text || html)
  const hasTemplate = !!templateId
  assertInlineOrTemplate({
    hasInline,
    hasTemplate,
    inlineFieldsLabel: "subject/text/html",
    requireSubject: true,
    hasSubject: !!subject,
  })

  const body: Record<string, unknown> = { to }
  if (hasTemplate) {
    body.templateId = templateId
    if (variables) body.variables = variables
  } else {
    if (subject) body.subject = subject
    if (text) body.text = text
    if (html) body.html = html
  }
  if (replyTo) body.replyTo = replyTo
  if (fromName) body.fromName = fromName
  if (scheduledFor) body.scheduledFor = scheduledFor

  const response = await fetch(`${INFISEND_BASE_URL}/email/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getApiKey()}`,
      "Idempotency-Key": idempotencyKey || generateIdempotencyKey(),
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) await throwForStatus(response)
  return response.json() as Promise<SendEmailResponse>
}

export async function sendBulkEmail(
  params: BulkSendEmailParams
): Promise<BulkSendEmailResponse> {
  const {
    recipients,
    subject,
    text,
    html,
    templateId,
    variables,
    replyTo,
    fromName,
    scheduledFor,
    idempotencyKey,
  } = params

  const hasInline = !!(subject || text || html)
  const hasTemplate = !!templateId
  assertInlineOrTemplate({
    hasInline,
    hasTemplate,
    inlineFieldsLabel: "subject/text/html",
    requireSubject: true,
    hasSubject: !!subject,
  })

  const body: Record<string, unknown> = { recipients }
  if (hasTemplate) {
    body.templateId = templateId
    if (variables) body.variables = variables
  } else {
    if (subject) body.subject = subject
    if (text) body.text = text
    if (html) body.html = html
  }
  if (replyTo) body.replyTo = replyTo
  if (fromName) body.fromName = fromName
  if (scheduledFor) body.scheduledFor = scheduledFor

  const response = await fetch(`${INFISEND_BASE_URL}/email/bulk`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getApiKey()}`,
      "Idempotency-Key": idempotencyKey || generateIdempotencyKey(),
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) await throwForStatus(response)
  return response.json() as Promise<BulkSendEmailResponse>
}

// ─── SMS ─────────────────────────────────────────────────────────────────────

function resolveSenderId(explicit?: string): string | undefined {
  return explicit || process.env.INFISEND_DEFAULT_SENDER_ID || undefined
}

export async function sendSms(params: SendSmsParams): Promise<SendSmsResponse> {
  const {
    to,
    message,
    templateId,
    variables,
    senderId,
    scheduledFor,
    idempotencyKey,
  } = params

  assertInlineOrTemplate({
    hasInline: !!message,
    hasTemplate: !!templateId,
    inlineFieldsLabel: "message",
  })

  const body: Record<string, unknown> = { to }
  if (templateId) {
    body.templateId = templateId
    if (variables) body.variables = variables
  } else {
    body.message = message
  }
  const resolvedSender = resolveSenderId(senderId)
  if (resolvedSender) body.senderId = resolvedSender
  if (scheduledFor) body.scheduledFor = scheduledFor

  const response = await fetch(`${INFISEND_BASE_URL}/sms/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getApiKey()}`,
      "Idempotency-Key": idempotencyKey || generateIdempotencyKey(),
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) await throwForStatus(response)
  return response.json() as Promise<SendSmsResponse>
}

export async function sendBulkSms(
  params: BulkSendSmsParams
): Promise<BulkSendSmsResponse> {
  const {
    recipients,
    recipientsCsv,
    message,
    templateId,
    variables,
    senderId,
    scheduledFor,
    idempotencyKey,
  } = params

  if (!recipients && !recipientsCsv) {
    throw new InfisendError(
      "sendBulkSms requires either recipients or recipientsCsv.",
      400
    )
  }

  assertInlineOrTemplate({
    hasInline: !!message,
    hasTemplate: !!templateId,
    inlineFieldsLabel: "message",
  })

  const body: Record<string, unknown> = {}
  if (recipients) body.recipients = recipients
  if (recipientsCsv) body.recipientsCsv = recipientsCsv
  if (templateId) {
    body.templateId = templateId
    if (variables) body.variables = variables
  } else {
    body.message = message
  }
  const resolvedSender = resolveSenderId(senderId)
  if (resolvedSender) body.senderId = resolvedSender
  if (scheduledFor) body.scheduledFor = scheduledFor

  const response = await fetch(`${INFISEND_BASE_URL}/sms/bulk`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getApiKey()}`,
      "Idempotency-Key": idempotencyKey || generateIdempotencyKey(),
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) await throwForStatus(response)
  return response.json() as Promise<BulkSendSmsResponse>
}

// ─── Shared: preview & cancel ────────────────────────────────────────────────

/**
 * Prices a recipient list and flags bad addresses/numbers before a
 * group/district/council send commits.
 *
 * NOTE: InfiSend documents this route under session-token auth. We attempt it
 * with the API key; if the provider rejects that, callers should fall back to a
 * local reach estimate rather than blocking the send.
 */
export async function previewBulkCost(
  params: BulkCostPreviewParams
): Promise<BulkCostPreviewResponse> {
  const response = await fetch(`${INFISEND_BASE_URL}/messages/bulk-preview`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getApiKey()}`,
    },
    body: JSON.stringify({
      channel: params.channel,
      recipients: params.recipients,
    }),
  })

  if (!response.ok) await throwForStatus(response)
  return response.json() as Promise<BulkCostPreviewResponse>
}

/**
 * Cancels a scheduled message (email or SMS) before its release time. The
 * cancel endpoint is not channel-specific.
 */
export async function cancelScheduledMessage(
  messageId: string
): Promise<{ messageId: string; status: string }> {
  const response = await fetch(
    `${INFISEND_BASE_URL}/messages/${encodeURIComponent(messageId)}/cancel`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getApiKey()}`,
      },
    }
  )

  if (!response.ok) await throwForStatus(response)
  return response.json() as Promise<{ messageId: string; status: string }>
}

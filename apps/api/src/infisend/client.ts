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
}

export interface BulkSendEmailResponse {
  batchSize: number
  totalCost: string
  channel: string
  environment: string
  scheduledFor: string | null
  messages: SendEmailResponse[]
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

// ─── Client ──────────────────────────────────────────────────────────────────

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
    idempotencyKey,
  } = params

  // Enforce mutual exclusivity of inline vs templated
  const hasInline = !!(subject || text || html)
  const hasTemplate = !!templateId

  if (hasInline && hasTemplate) {
    throw new InfisendError(
      "Cannot provide both inline content (subject/text/html) and templateId. Use one or the other.",
      400
    )
  }

  if (!hasInline && !hasTemplate) {
    throw new InfisendError(
      "Must provide either inline content (subject + text/html) or templateId.",
      400
    )
  }

  if (hasInline && !subject) {
    throw new InfisendError(
      "Inline sends require a subject.",
      400
    )
  }

  if (templateId && variables === undefined) {
    // Template send without variables is fine — InfiSend will render with empty vars
  }

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

  const key = idempotencyKey || generateIdempotencyKey()

  const response = await fetch(`${INFISEND_BASE_URL}/email/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getApiKey()}`,
      "Idempotency-Key": key,
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))

    if (response.status === 402) {
      throw new InsufficientWalletError(
        data.message || "Insufficient wallet balance"
      )
    }
    if (response.status === 403) {
      throw new MissingScopeError(
        data.message || "API key lacks the EMAIL scope"
      )
    }
    if (response.status === 429) {
      const retryAfter = parseInt(
        response.headers.get("Retry-After") || "60",
        10
      )
      throw new RateLimitError(
        data.message || "Rate limit exceeded",
        retryAfter
      )
    }

    throw new InfisendError(
      data.message || `InfiSend API error: ${response.status}`,
      response.status,
      data.issues
    )
  }

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
  } = params

  const hasInline = !!(subject || text || html)
  const hasTemplate = !!templateId

  if (hasInline && hasTemplate) {
    throw new InfisendError(
      "Cannot provide both inline content (subject/text/html) and templateId. Use one or the other.",
      400
    )
  }

  if (!hasInline && !hasTemplate) {
    throw new InfisendError(
      "Must provide either inline content (subject + text/html) or templateId.",
      400
    )
  }

  if (hasInline && !subject) {
    throw new InfisendError(
      "Inline sends require a subject.",
      400
    )
  }

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

  const response = await fetch(`${INFISEND_BASE_URL}/email/bulk`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getApiKey()}`,
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))

    if (response.status === 402) {
      throw new InsufficientWalletError(
        data.message || "Insufficient wallet balance"
      )
    }
    if (response.status === 403) {
      throw new MissingScopeError(
        data.message || "API key lacks the EMAIL scope"
      )
    }
    if (response.status === 429) {
      const retryAfter = parseInt(
        response.headers.get("Retry-After") || "60",
        10
      )
      throw new RateLimitError(
        data.message || "Rate limit exceeded",
        retryAfter
      )
    }

    throw new InfisendError(
      data.message || `InfiSend API error: ${response.status}`,
      response.status,
      data.issues
    )
  }

  return response.json() as Promise<BulkSendEmailResponse>
}

// Maps internal event names → InfiSend templateIds for TRANSACTIONAL email
// (e.g. the welcome email on sign-up). This is distinct from:
//   - the Messaging Compose flow (a person choosing recipients + channels), and
//   - the system-notification feed (see ./event-catalogue.ts).
// Templates are created manually in the InfiSend dashboard. To add an event,
// create the template there first, then add the mapping here.

export interface TransactionalEmailConfig {
  templateId: string
  description: string
}

export const TRANSACTIONAL_EMAIL_MAP: Record<string, TransactionalEmailConfig> =
  {
    "user.created": {
      templateId: "tpl_user_created",
      description: "Welcome email sent when a new user registers",
    },
  }

export function getTransactionalEmailConfig(
  eventName: string
): TransactionalEmailConfig | undefined {
  return TRANSACTIONAL_EMAIL_MAP[eventName]
}

// Maps internal event names → InfiSend templateIds.
// Templates are created manually in the InfiSend dashboard.
// To add a new event, create the template there first, then add the mapping here.

export interface NotificationEventConfig {
  templateId: string
  description: string
}

export const NOTIFICATION_EVENT_MAP: Record<string, NotificationEventConfig> = {
  "user.created": {
    templateId: "tpl_user_created",
    description: "Sent when a new user registers",
  },
  "event.created": {
    templateId: "tpl_event_created",
    description: "Sent when a new event is created",
  },
}

export function getEventConfig(
  eventName: string
): NotificationEventConfig | undefined {
  return NOTIFICATION_EVENT_MAP[eventName]
}

// The catalogue of system-generated, broadcast-style events that produce a
// SystemNotification row (the narrow "Notifications" feed). These are triggered
// automatically by internal system events — never composed by a person — and
// are entirely separate from the Messaging Compose flow.

export interface SystemEventInput {
  /** Human title of the created entity. */
  title?: string
  /** Free-form extra context available to the body builder. */
  [key: string]: string | undefined
}

export interface SystemEventConfig {
  title: (input: SystemEventInput) => string
  body: (input: SystemEventInput) => string
  link: (input: SystemEventInput) => string | null
}

export const SYSTEM_EVENT_CATALOGUE: Record<string, SystemEventConfig> = {
  "blog.published": {
    title: () => "New blog post published",
    body: (i) =>
      i.title
        ? `A new blog post "${i.title}" is now available.`
        : "A new blog post is now available.",
    link: () => "/blogs",
  },
  "event.created": {
    title: () => "New event added to the calendar",
    body: (i) =>
      i.title
        ? `"${i.title}" has been added to the event calendar.`
        : "A new event has been added to the calendar.",
    link: () => "/tobacco-business/events",
  },
  "vacancy.created": {
    title: () => "New vacancy posted",
    body: (i) =>
      i.title
        ? `A new vacancy "${i.title}" has been posted.`
        : "A new vacancy has been posted.",
    link: () => "/vacancies",
  },
  "news.created": {
    title: () => "New news update",
    body: (i) =>
      i.title
        ? `"${i.title}" was added to News & Updates.`
        : "A new item was added to News & Updates.",
    link: () => "/news",
  },
  "reportsPublication.created": {
    title: () => "New report or publication",
    body: (i) =>
      i.title
        ? `"${i.title}" was added to Reports & Publications.`
        : "A new report or publication is available.",
    link: () => "/reports-publications",
  },
}

export function getSystemEventConfig(
  eventName: string
): SystemEventConfig | undefined {
  return SYSTEM_EVENT_CATALOGUE[eventName]
}

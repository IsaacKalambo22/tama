import {
  CountryCode,
  isValidPhoneNumber,
  parsePhoneNumberFromString,
} from "libphonenumber-js"

// Malawi is the default region for bare local numbers coming from profile data
// and Person 1's bulk phone-number import, which is not guaranteed to be E.164.
const DEFAULT_COUNTRY: CountryCode = "MW"

/**
 * Normalizes a raw phone string to strict E.164 (e.g. "+265991234567"), or
 * returns null if it cannot be parsed into a valid number. Runs server-side
 * before any InfiSend SMS call so bad numbers never reach the wallet.
 */
export function normalizeE164(
  raw: string,
  defaultCountry: CountryCode = DEFAULT_COUNTRY
): string | null {
  if (!raw || typeof raw !== "string") return null

  const trimmed = raw.trim()
  if (!trimmed) return null

  try {
    const parsed = parsePhoneNumberFromString(trimmed, defaultCountry)
    if (parsed && parsed.isValid()) {
      return parsed.number
    }

    if (isValidPhoneNumber(trimmed, defaultCountry)) {
      const fallback = parsePhoneNumberFromString(trimmed, defaultCountry)
      return fallback ? fallback.number : null
    }
  } catch {
    return null
  }

  return null
}

/**
 * Splits a list of raw numbers into normalized E.164 valids (de-duplicated,
 * order preserved) and the raw strings that failed to parse.
 */
export function normalizeMany(raws: string[]): {
  valid: string[]
  invalid: string[]
} {
  const valid: string[] = []
  const seen = new Set<string>()
  const invalid: string[] = []

  for (const raw of raws) {
    const normalized = normalizeE164(raw)
    if (!normalized) {
      invalid.push(raw)
      continue
    }
    if (!seen.has(normalized)) {
      seen.add(normalized)
      valid.push(normalized)
    }
  }

  return { valid, invalid }
}

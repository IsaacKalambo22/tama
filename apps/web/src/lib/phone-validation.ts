const MALAWI_PHONE_REGEX = /^(\+265(9|8)\d{8}|0(9|8)\d{8})$/

export function isValidMalawiPhone(phone: string): boolean {
  return MALAWI_PHONE_REGEX.test(phone.trim())
}

export function normalizeMalawiPhone(phone: string): string {
  const trimmed = phone.trim()
  if (trimmed.startsWith("+265")) return trimmed
  if (trimmed.startsWith("09") || trimmed.startsWith("08")) {
    return "+265" + trimmed.slice(1)
  }
  return trimmed
}

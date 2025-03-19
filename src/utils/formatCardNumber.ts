export function formatCardNumber(number: string): string {
  const cleaned = number.replace(/\D/g, '').slice(0, 26)
  if (cleaned.length < 8) return cleaned

  return `${cleaned.slice(0, 4)} **** **** ${cleaned.slice(-4)}`
}

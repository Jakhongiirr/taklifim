/**
 * A phone number fit for logs: country/operator code and last four digits
 * only, e.g. "+998901234567" -> "+99890***4567".
 */
export function maskPhone(phone: string): string {
  return phone.length > 9 ? `${phone.slice(0, 6)}***${phone.slice(-4)}` : '***';
}

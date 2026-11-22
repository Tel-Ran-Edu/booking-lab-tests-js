/** Test data helpers: dates relative to today, unique emails, a test card. */
import { randomUUID } from 'node:crypto'

/** A test card that always pays successfully (see the payment page of the website). */
export const GOOD_CARD = { card_number: '4242 4242 4242 4242', expiry: '12/30', cvc: '123', cardholder: 'Anna Levi' }

/** Today + offset days as YYYY-MM-DD. */
export function day(offset: number): string {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return [d.getFullYear(), d.getMonth() + 1, d.getDate()].map((n) => String(n).padStart(2, '0')).join('-')
}

/** check_in / check_out for a stay that starts daysAhead days from today. */
export function stay(daysAhead = 30, nights = 2) {
  return { check_in: day(daysAhead), check_out: day(daysAhead + nights) }
}

/** autotest+… emails are deleted automatically after 24 hours. */
export function uniqueEmail(): string {
  return `autotest+${randomUUID().replaceAll('-', '').slice(0, 12)}@bookinglab.test`
}

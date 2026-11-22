/** Booking form (/book): guests, phone and the price of the stay. */
import type { Locator, Page } from '@playwright/test'

export class BookingPage {
  readonly form: Locator
  readonly phone: Locator
  readonly specialRequests: Locator
  readonly subtotal: Locator
  readonly tax: Locator
  readonly total: Locator
  readonly submit: Locator

  constructor(private readonly page: Page) {
    this.form = page.getByTestId('booking-form')
    this.phone = page.getByTestId('booking-phone')
    this.specialRequests = page.getByTestId('booking-special-requests')
    this.subtotal = page.getByTestId('booking-quote-subtotal')
    this.tax = page.getByTestId('booking-quote-tax')
    this.total = page.getByTestId('booking-quote-total')
    this.submit = page.getByTestId('booking-submit')
  }

  /** Adults are numbered from 0. */
  async adultName(index: number, first: string, last: string): Promise<void> {
    await this.page.getByTestId(`booking-adult-${index}-first-name`).fill(first)
    await this.page.getByTestId(`booking-adult-${index}-last-name`).fill(last)
  }
}

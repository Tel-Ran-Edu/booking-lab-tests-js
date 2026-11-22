/** Search page (/): the search form and the result cards. */
import type { Locator, Page } from '@playwright/test'

export class SearchPage {
  readonly city: Locator
  readonly checkIn: Locator
  readonly checkOut: Locator
  readonly adults: Locator
  readonly submit: Locator
  readonly total: Locator
  readonly loading: Locator
  /** Every hotel card has data-testid="hotel-card-<id>"; its parts add a suffix. */
  readonly cardLinks: Locator

  constructor(private readonly page: Page) {
    this.city = page.getByTestId('search-city')
    this.checkIn = page.getByTestId('search-check-in')
    this.checkOut = page.getByTestId('search-check-out')
    this.adults = page.getByTestId('search-adults')
    this.submit = page.getByTestId('search-submit')
    this.total = page.getByTestId('search-total')
    this.loading = page.getByTestId('search-loading')
    this.cardLinks = page.locator('[data-testid^="hotel-card-"][data-testid$="-link"]')
  }

  async open(): Promise<this> {
    await this.page.goto('/')
    return this
  }

  /**
   * Fill the form, submit it and wait for the new results.
   * The page already shows hotels before you search, so waiting for any card is not enough:
   * wait for the search request to answer and the loading skeleton to go away.
   */
  async search(city: string, checkIn: string, checkOut: string, adults = 2): Promise<void> {
    await this.city.fill(city)
    await this.checkIn.fill(checkIn)
    await this.checkOut.fill(checkOut)
    await this.adults.fill(String(adults))
    const answered = this.page.waitForResponse((r) => r.url().includes('/api/v1/hotels?') && r.url().includes('city='))
    await this.submit.click()
    await answered
    await this.loading.waitFor({ state: 'hidden' })
  }

  cardName(hotelId: string): Locator {
    return this.page.getByTestId(`hotel-card-${hotelId}-name`)
  }

  /** Id of the first hotel in the results, read from its card's data-testid. */
  async firstHotelId(): Promise<string> {
    const testId = (await this.cardLinks.first().getAttribute('data-testid')) ?? ''
    return testId.replace(/^hotel-card-/, '').replace(/-link$/, '')
  }

  async openHotel(hotelId: string): Promise<void> {
    await this.page.getByTestId(`hotel-card-${hotelId}-link`).click()
  }
}

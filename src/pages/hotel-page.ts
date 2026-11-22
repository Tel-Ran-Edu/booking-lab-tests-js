/** Hotel page (/hotels/<id>): hotel details and its room types. */
import type { Locator, Page } from '@playwright/test'

export class HotelPage {
  readonly root: Locator
  readonly name: Locator
  readonly roomTypes: Locator
  /** "<n> rooms left" for each room type that still has free rooms. */
  readonly freeRooms: Locator

  constructor(private readonly page: Page) {
    this.root = page.getByTestId('hotel-page')
    this.name = page.getByTestId('hotel-name')
    this.roomTypes = page.getByTestId('hotel-room-types')
    this.freeRooms = page.locator('[data-testid^="hotel-room-type-"][data-testid$="-free"]', { hasText: 'rooms left' })
  }

  async firstFreeRoomTypeId(): Promise<string> {
    const testId = (await this.freeRooms.first().getAttribute('data-testid')) ?? ''
    return testId.replace(/^hotel-room-type-/, '').replace(/-free$/, '')
  }

  bookButton(roomTypeId: string): Locator {
    return this.page.getByTestId(`hotel-room-type-${roomTypeId}-book`)
  }
}

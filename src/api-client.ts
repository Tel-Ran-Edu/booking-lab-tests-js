/**
 * A small client for the BooKing Lab API (Swagger: <API_URL>/docs).
 *
 * Every method returns Playwright's APIResponse, so a test decides what to check: the status,
 * the body, the headers. Add a method here when your tests need a new endpoint.
 */
import { request, type APIRequestContext, type APIResponse } from '@playwright/test'

type Params = Record<string, string | number | boolean>

export class BookingLabApi {
  private token: string | undefined

  private constructor(private readonly ctx: APIRequestContext, private readonly base: string) {}

  /** Requests without a token need the cohort code; with a token the cohort comes from it. */
  static async create(apiUrl: string, cohort: string): Promise<BookingLabApi> {
    const ctx = await request.newContext({ extraHTTPHeaders: { 'X-Workspace': cohort } })
    return new BookingLabApi(ctx, `${apiUrl}/api/v1`)
  }

  /** Send this token with every next request. */
  authorize(accessToken: string): void {
    this.token = accessToken
  }

  async dispose(): Promise<void> {
    await this.ctx.dispose()
  }

  private call(method: string, path: string, options: { data?: unknown; params?: Params } = {}) {
    const headers = this.token ? { Authorization: `Bearer ${this.token}` } : undefined
    return this.ctx.fetch(`${this.base}${path}`, { method, headers, ...options })
  }

  // --- test helpers (SPEC section 7.1) -----------------------------------------------------

  /** POST /test/users: a verified user with a random autotest+… email and password. */
  createTestUser(fields: Record<string, unknown> = {}): Promise<APIResponse> {
    return this.call('POST', '/test/users', { data: fields })
  }

  /** POST /test/reset: delete everything the signed-in user created. */
  resetMyData(): Promise<APIResponse> {
    return this.call('POST', '/test/reset')
  }

  // --- auth --------------------------------------------------------------------------------

  register(fields: Record<string, unknown>): Promise<APIResponse> {
    return this.call('POST', '/auth/register', { data: fields })
  }

  login(email: string, password: string): Promise<APIResponse> {
    return this.call('POST', '/auth/login', { data: { email, password } })
  }

  me(): Promise<APIResponse> {
    return this.call('GET', '/users/me')
  }

  // --- hotels ------------------------------------------------------------------------------

  /** GET /hotels with query parameters: city, check_in, check_out, adults, … */
  searchHotels(params: Params): Promise<APIResponse> {
    return this.call('GET', '/hotels', { params })
  }

  availability(hotelId: number, params: Params): Promise<APIResponse> {
    return this.call('GET', `/hotels/${hotelId}/availability`, { params })
  }

  // --- bookings ----------------------------------------------------------------------------

  createBooking(fields: Record<string, unknown>): Promise<APIResponse> {
    return this.call('POST', '/bookings', { data: fields })
  }

  getBooking(id: number): Promise<APIResponse> {
    return this.call('GET', `/bookings/${id}`)
  }

  pay(id: number, card: Record<string, string>): Promise<APIResponse> {
    return this.call('POST', `/bookings/${id}/pay`, { data: card })
  }

  cancel(id: number): Promise<APIResponse> {
    return this.call('POST', `/bookings/${id}/cancel`)
  }
}

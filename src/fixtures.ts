/**
 * Shared fixtures. Import `test` and `expect` from this file instead of '@playwright/test':
 *
 *   import { test, expect } from '../../src/fixtures'
 *
 * - `api`  an API client without a token;
 * - `user` a new verified user in your cohort with an API client already signed in; after the
 *          test, everything it created is deleted (POST /test/reset).
 */
import { test as base, expect } from '@playwright/test'
import { BookingLabApi } from './api-client'
import { settings } from './config'

export type TestUser = { email: string; password: string; firstName: string; api: BookingLabApi }

export const test = base.extend<{ api: BookingLabApi; user: TestUser }>({
  api: async ({}, use) => {
    const api = await BookingLabApi.create(settings.apiUrl, settings.cohort)
    await use(api)
    await api.dispose()
  },

  user: async ({}, use) => {
    const api = await BookingLabApi.create(settings.apiUrl, settings.cohort)
    const created = await api.createTestUser()
    expect(created.status(), await created.text()).toBe(201)
    const body = await created.json()
    api.authorize(body.access_token)
    await use({ email: body.user.email, password: body.password, firstName: body.user.first_name, api })
    await api.resetMyData()
    await api.dispose()
  },
})

export { expect }

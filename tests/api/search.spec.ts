// Hotel search through the API (requirements section 3.2).
import { stay } from '../../src/data'
import { expect, test } from '../../src/fixtures'

test('search by city and dates', async ({ api }) => {
  const response = await api.searchHotels({ city: 'Haifa', adults: 2, ...stay(30) })

  expect(response.status(), await response.text()).toBe(200)
  const body = await response.json()
  expect(body.total).toBeGreaterThan(0)
  expect(body.items.length, 'the first page has hotels').toBeGreaterThan(0)
  for (const hotel of body.items) {
    expect(hotel.city).toBe('Haifa')
    // money is a string with 2 decimals, never a number
    expect(hotel.price_per_night).toMatch(/^\d+\.\d{2}$/)
  }
})

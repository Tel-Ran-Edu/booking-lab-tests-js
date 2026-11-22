// Book → pay → cancel through the API (requirements section 3.3).
import { GOOD_CARD, stay } from '../../src/data'
import { expect, test } from '../../src/fixtures'

type RoomType = { id: number; free_rooms: number; fits_guests: boolean }

test('book, pay and cancel', async ({ user }) => {
  const { api } = user
  const dates = stay(45, 2)

  const room = await test.step('find a room type with a free room for two adults', async () => {
    const hotels = (await (await api.searchHotels({ city: 'Tel Aviv', adults: 2, ...dates })).json()).items
    expect(hotels.length, 'no hotel has free rooms on these dates').toBeGreaterThan(0)
    const rooms: RoomType[] = (await (await api.availability(hotels[0].id, { adults: 2, ...dates })).json()).room_types
    const free = rooms.find((r) => r.free_rooms > 0 && r.fits_guests)
    expect(free).toBeDefined()
    return free!
  })

  const booking = await test.step('book it', async () => {
    const created = await api.createBooking({
      room_type_id: room.id, ...dates,
      adults: [{ first_name: 'Anna', last_name: 'Levi' }, { first_name: 'Dan', last_name: 'Levi' }],
      phone: '+972501234567',
    })
    expect(created.status(), await created.text()).toBe(201)
    const body = await created.json()
    expect(body.status).toBe('pending_payment')
    return body
  })

  await test.step('pay with the test card', async () => {
    const paid = await api.pay(booking.id, GOOD_CARD)
    expect(paid.status(), await paid.text()).toBe(200)
    expect((await (await api.getBooking(booking.id)).json()).status).toBe('confirmed')
  })

  await test.step('cancel it', async () => {
    const cancelled = await api.cancel(booking.id)
    expect(cancelled.status(), await cancelled.text()).toBe(200)
    expect((await (await api.getBooking(booking.id)).json()).status).toBe('cancelled')
  })
})

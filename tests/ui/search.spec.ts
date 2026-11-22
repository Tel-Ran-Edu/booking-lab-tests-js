// Search → hotel page → booking form on the website.
import { settings } from '../../src/config'
import { stay } from '../../src/data'
import { expect, test } from '../../src/fixtures'
import { BookingPage } from '../../src/pages/booking-page'
import { HotelPage } from '../../src/pages/hotel-page'
import { LoginPage } from '../../src/pages/login-page'
import { SearchPage } from '../../src/pages/search-page'

test('search, open a hotel and see the price', async ({ page, user }) => {
  const login = await new LoginPage(page).open()
  await login.signIn(settings.cohort, user.email, user.password)
  await expect(login.navUser).toContainText(user.firstName)

  const search = await new SearchPage(page).open()
  const dates = stay(40, 2)
  await search.search('Haifa', dates.check_in, dates.check_out, 2)
  await expect(search.total).toBeVisible()

  const hotelId = await search.firstHotelId()
  const name = await search.cardName(hotelId).innerText()
  await search.openHotel(hotelId)

  const hotel = new HotelPage(page)
  await expect(hotel.name).toHaveText(name)
  const roomTypeId = await hotel.firstFreeRoomTypeId()
  await hotel.bookButton(roomTypeId).click()

  const booking = new BookingPage(page)
  await expect(booking.form).toBeVisible()
  await expect(booking.total).toContainText(/\d+\.\d{2}/)
})

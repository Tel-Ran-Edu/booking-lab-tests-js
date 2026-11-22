// Sign-in on the website.
import { settings } from '../../src/config'
import { expect, test } from '../../src/fixtures'
import { LoginPage } from '../../src/pages/login-page'

test('sign in shows my name', async ({ page, user }) => {
  const login = await new LoginPage(page).open()

  await login.signIn(settings.cohort, user.email, user.password)

  await expect(login.navUser).toContainText(user.firstName)
  await expect(login.navUser).toContainText(settings.cohort)
})

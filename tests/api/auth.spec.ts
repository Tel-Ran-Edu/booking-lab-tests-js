// Registration and sign-in through the API (requirements section 3.1).
import { settings } from '../../src/config'
import { uniqueEmail } from '../../src/data'
import { expect, test } from '../../src/fixtures'

test('register, then sign in', async ({ api }) => {
  const email = uniqueEmail()
  const password = 'Secret1!'

  const registered = await api.register({ email, password, first_name: 'Anna', last_name: 'Levi',
    cohort_code: settings.cohort })
  expect(registered.status(), await registered.text()).toBe(201)
  expect((await registered.json()).email).toBe(email)

  const signedIn = await api.login(email, password)
  expect(signedIn.status(), await signedIn.text()).toBe(200)
  const { access_token } = await signedIn.json()
  expect(access_token).toBeTruthy()

  api.authorize(access_token)
  const me = await api.me()
  expect(me.status()).toBe(200)
  expect(await me.json()).toMatchObject({ first_name: 'Anna', cohort_code: settings.cohort })

  await api.resetMyData() // clean up what this user created
})

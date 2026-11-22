/**
 * Sign-in page (/login).
 * Every element on the site has a stable data-testid; locate by it, not by text or CSS classes.
 */
import type { Locator, Page } from '@playwright/test'

export class LoginPage {
  readonly cohort: Locator
  readonly email: Locator
  readonly password: Locator
  readonly submit: Locator
  /** In the header once you are signed in, for example "Anna · DEMO". */
  readonly navUser: Locator

  constructor(private readonly page: Page) {
    this.cohort = page.getByTestId('login-cohort-code')
    this.email = page.getByTestId('login-email')
    this.password = page.getByTestId('login-password')
    this.submit = page.getByTestId('login-submit')
    this.navUser = page.getByTestId('app-nav-user')
  }

  async open(): Promise<this> {
    await this.page.goto('/login')
    return this
  }

  async signIn(cohort: string, email: string, password: string): Promise<void> {
    await this.cohort.fill(cohort)
    await this.email.fill(email)
    await this.password.fill(password)
    await this.submit.click()
  }
}

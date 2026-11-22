/**
 * Cold start: wait until BooKing Lab is ready before any test runs.
 *
 * The cloud copy of BooKing Lab sleeps after 15 minutes without requests and needs about a
 * minute to wake up. Right now this asks /health once, which is enough for the local copy
 * started with `docker compose up --wait`, but not for the cloud.
 *
 * YOUR TASK (REQ-OPS-003 in the requirements):
 * - ask GET /health every 5 seconds until it answers 200, for at most 120 seconds;
 * - if the server is still not ready after 120 seconds, fail with a clear message;
 * - if /health answers 503 with "db": "down", fail at once with a database message:
 *   waiting will not help, tell your instructor.
 */
import { request } from '@playwright/test'
import { settings } from './src/config'

export default async function globalSetup(): Promise<void> {
  const api = await request.newContext()
  const response = await api.get(`${settings.apiUrl}/health`)
  if (response.status() !== 200) {
    throw new Error(`BooKing Lab is not ready: ${response.status()}`)
  }
  await api.dispose()
}

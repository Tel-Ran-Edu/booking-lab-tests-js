/** Runs once before all tests: removes the previous run's Allure results, so a report shows one run. */
import { rmSync } from 'node:fs'

export default function cleanResults(): void {
  rmSync('allure-results', { recursive: true, force: true })
}

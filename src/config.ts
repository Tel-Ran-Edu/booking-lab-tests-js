/**
 * Where the tests find BooKing Lab. Every value comes from an environment variable.
 *
 *   API_URL   the API, default http://localhost:8000 (the local copy from docker-compose.yml)
 *   WEB_URL   the website, default http://localhost:5173
 *   COHORT    your cohort code, default DEMO (the open cohort for self-study)
 */
export const settings = {
  apiUrl: (process.env.API_URL ?? 'http://localhost:8000').replace(/\/+$/, ''),
  webUrl: (process.env.WEB_URL ?? 'http://localhost:5173').replace(/\/+$/, ''),
  cohort: process.env.COHORT ?? 'DEMO',
}

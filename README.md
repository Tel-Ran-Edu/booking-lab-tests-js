# BooKing Lab — JavaScript autotests

A starting project for testing [BooKing Lab](https://booking-lab-2iu.pages.dev), the hotel booking
training app, with Playwright Test in TypeScript: API tests and UI tests in one runner, with
Allure results. It already has five working tests; you add the rest.

## Requirements

`docs/requirements.md` is what BooKing Lab must do: the functional requirements, the
field validation rules and the REST API, with requirement IDs (`REQ-…`) to put in your test
cases and bug reports. It ends with templates for both.

## What you need

- Node.js 22 or newer
- Docker Desktop (for the local copy of BooKing Lab)

## Quick start

1. Create your own repository from this template: **Use this template → Create a new
   repository**, then clone it.
2. Start the local copy of BooKing Lab (website, API and database):

   ```bash
   docker compose up -d --wait
   ```

   Website: http://localhost:5173 · API and Swagger: http://localhost:8000/docs

3. Install the test tools and the browser:

   ```bash
   npm ci
   npx playwright install chromium
   ```

4. Run the tests:

   ```bash
   npx playwright test
   ```

   You should see `5 passed`. To watch the browser: `npm run test:headed`. To pick tests and
   step through them: `npx playwright test --ui`.

Stop the local copy with `docker compose down`. Add `-v` to also delete its data.

## Settings

The tests read three environment variables:

| Variable | Default | Meaning |
| --- | --- | --- |
| `API_URL` | `http://localhost:8000` | The API |
| `WEB_URL` | `http://localhost:5173` | The website |
| `COHORT` | `DEMO` | Your cohort code (`DEMO` is open for self-study) |

To run against the cloud copy with your cohort code:

```bash
API_URL=https://booking-lab-api.onrender.com WEB_URL=https://booking-lab-2iu.pages.dev COHORT=QA80 npx playwright test
```

The cloud copy sleeps after 15 minutes without requests and needs about a minute to wake up.
Never run load tests against it: use the local copy.

## What is inside

```
src/
  config.ts               settings from the environment
  api-client.ts           one method per API endpoint; returns the raw response
  data.ts                 dates relative to today, unique emails, the test card
  fixtures.ts             test fixtures: api, user (import test and expect from here)
  pages/                  page objects: sign-in, search, hotel page, booking form
tests/
  api/                    API tests
  ui/                     UI tests
global-setup.ts           runs once before all tests: the cold-start check
playwright.config.ts      browser, base URL, test id attribute, reporters
docker-compose.yml        the local copy of BooKing Lab, an exact version
postman/                  the course Postman collection and its environments
jmeter/                   a JMeter load test plan for the local copy
docs/requirements.md      the requirements, a test case and a bug report template
.github/workflows/        CI: starts BooKing Lab and runs the tests on every push; builds the report
allurerc.mjs              Allure report settings
scripts/report-summary.mjs   pass/fail table for the CI summary
Jenkinsfile               the same pipeline for Jenkins
```

| Test | Flow |
| --- | --- |
| `tests/api/auth.spec.ts` | register → sign in → read my profile |
| `tests/api/search.spec.ts` | search hotels by city and dates |
| `tests/api/booking.spec.ts` | book a room → pay → cancel |
| `tests/ui/sign-in.spec.ts` | sign in on the website |
| `tests/ui/search.spec.ts` | search → hotel page → booking form |

### Fixtures

Import `test` and `expect` from `src/fixtures.ts`, not from `@playwright/test`:

- `user` creates a new verified user in your cohort through `POST /test/users` (no email step)
  and gives you its email, password and an API client already signed in. After the test it
  calls `POST /test/reset`, which deletes everything that user created. Test users
  (`autotest+…` emails) are also deleted automatically after 24 hours.
- `api` is an API client without a token. `page` is Playwright's own page; `page.goto('/login')`
  opens `WEB_URL` + `/login`.

### Locators

Every element on the website has a stable `data-testid`, for example `login-email` or
`hotel-card-12-link`. The config sets it as the test id attribute, so use
`page.getByTestId('login-email')`. Texts and CSS classes may change; test ids do not.

## Your first task: the cold start

Open `global-setup.ts`. It asks `/health` once, which works for the local copy but fails when
the cloud copy is asleep. Finish it as its comment says: ask every 5 seconds for up to 120
seconds, and fail at once with a clear message when the database is down. Then run the tests
against the cloud copy after it has slept.

## Reports

Every run writes Allure results to `allure-results/` (the previous run's are removed first). To
build the report:

```bash
npm run report
```

Then open `allure-report/index.html`: it is one file, so a double-click works, and you can send
it to someone as it is. Settings are in `allurerc.mjs`.

In GitHub Actions every run gets the same report as the `allure-report` artifact (Actions → the
run → Artifacts) and a pass/fail table on the run's summary page. When a test fails, its
Playwright trace is kept as `test-results`; open it with `npx playwright show-trace <file>`.

## Publish your report as a portfolio link

Your CI can publish the latest report as a web page, with the trend of earlier runs, at
`https://<your-user>.github.io/<your-repo>/`. Put that link in your CV or LinkedIn.

1. Open your repository's **Settings → Pages** and set **Source** to **GitHub Actions**.
2. Push to the main branch (or open **Actions → Tests → Run workflow**).
3. When the run is green, the `pages` job shows the link; it is also in Settings → Pages.

Each push to the main branch adds a point to the trend (the last 20 runs are kept), including
red runs: a report that shows how you fixed things is a good portfolio too.

- While Pages is off, the `pages` job is **skipped**, not failed: the run stays green.
- Free GitHub accounts can publish Pages only from public repositories.
- Everyone with the link sees the report: test names, steps and error messages. It holds only
  test data, so keep it that way: no real names, phones, cards or passwords in your tests.

## Postman

`postman/` holds the course collection (reviews, promo codes, favorites, the manager area and
the mailbox) and two environments: `localhost` and the cloud copy (`Render`).

- **In Postman:** Import → choose the three files, pick the environment at the top right, then
  open the collection and press **Run**. Each run creates its own test user and deletes its data
  at the end. Set `cohort` in the environment to your cohort code.
- **With Newman** (Node.js):

  ```bash
  npx newman run postman/booking-lab-course.postman_collection.json -e postman/localhost.postman_environment.json
  ```

- The `postman` job in CI runs the same command. To switch it off, add a repository variable
  `RUN_POSTMAN` with the value `false` (Settings → Secrets and variables → Actions → Variables).
- Cold start: the `Health` request's description has the same task as above, for a Postman
  pre-request script.

## JMeter

`jmeter/booking-lab.jmx` is a load test plan for the local copy: search, booking and a race of
ten users for a hotel's last room. Its README (`jmeter/README.md`) says how to run it with
JMeter or Docker. Never run it against the cloud copy.

## Jenkins

`Jenkinsfile` runs the same steps as the GitHub workflow. In Jenkins, create a
**Pipeline** job with **Pipeline script from SCM**, point it at your repository and keep the
script path `Jenkinsfile`. What the agent needs is listed at the top of the file. The report
is archived with each build as `allure-report/index.html`.

## Troubleshooting

- **429 Too Many Requests on sign-in.** BooKing Lab allows 10 sign-ins per minute from one
  address, like the cloud copy. Wait a minute (the `Retry-After` header says how long), or give
  the local copy a higher limit: `RATE_LIMIT_LOGIN_PER_MINUTE=100 docker compose up -d --wait`.
- **Port 5432, 8000 or 5173 is already in use.** Another program (or another copy of BooKing
  Lab) uses it. Stop it, or change the left side of the port in `docker-compose.yml`.
- **"BooKing Lab is not ready".** The server is not up yet: see the cold start task above.

Use only test data. Do not enter real names, phone numbers or cards.

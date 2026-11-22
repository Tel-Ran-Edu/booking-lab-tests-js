// A sample Jenkins pipeline: the same steps as .github/workflows/tests.yml.
//
// The agent needs: Docker with Compose, Node.js 22+ and the system libraries Playwright's
// Chromium needs (once, as root: `npx playwright install-deps chromium`). Plugins: Pipeline.
// The report is archived as allure-report/index.html: open it from the build page.
pipeline {
  agent any
  options {
    timeout(time: 20, unit: 'MINUTES')
    disableConcurrentBuilds() // one local copy of BooKing Lab per agent at a time
  }
  environment {
    API_URL = 'http://localhost:8000'
    WEB_URL = 'http://localhost:5173'
    COHORT = 'DEMO'
  }
  stages {
    stage('Start BooKing Lab') {
      steps {
        sh 'docker compose up -d --wait'
      }
    }
    stage('Install') {
      steps {
        sh 'npm ci'
        sh 'npx playwright install chromium'
        sh 'npm run typecheck'
      }
    }
    stage('Test') {
      steps {
        // a failed test marks the build red but lets the report stage run
        catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
          sh 'npx playwright test'
        }
      }
    }
    stage('Report') {
      steps {
        sh 'npm run report'
        sh 'node scripts/report-summary.mjs'
      }
    }
  }
  post {
    always {
      archiveArtifacts artifacts: 'allure-report/index.html', allowEmptyArchive: true
      sh 'docker compose down -v'
    }
  }
}

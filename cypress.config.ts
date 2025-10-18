import { defineConfig } from 'cypress';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
// Import with createRequire to handle CommonJS plugin in ES module
const cypressOnRun = require('cypress-mochawesome-reporter/plugin');

export default defineConfig({
  e2e: {
    baseUrl: 'https://api-live.yesmadam.com',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
    fixturesFolder: 'cypress/fixtures',
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',

    // API testing specific settings - optimized for CI
    video: false,
    screenshotOnRunFailure: true,

    // Timeouts - increased for CI environment
    defaultCommandTimeout: process.env.CI ? 30000 : 10000,
    requestTimeout: process.env.CI ? 45000 : 15000,
    responseTimeout: process.env.CI ? 45000 : 15000,
    pageLoadTimeout: process.env.CI ? 60000 : 30000,

    // Retry configuration - more retries in CI
    retries: {
      runMode: process.env.CI ? 3 : 2,
      openMode: 0,
    },

    // Environment variables - use environment-specific settings
    env: {
      apiUrl: process.env.CI ? 'https://api-live.yesmadam.com' : 'https://api-live.yesmadam.com',
      apiVersion: 'v3',
      environment: process.env.CI ? 'ci' : 'local',
      timeout: process.env.CI ? 45000 : 15000,
    },

    setupNodeEvents(on, config) {
      // Mochawesome reporter plugin
      cypressOnRun(on);

      // Custom tasks for logging
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
        table(message) {
          console.table(message);
          return null;
        },
      });

      return config;
    },
  },

  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports',
    overwrite: false,
    html: true,
    json: true,
    charts: true,
    reportPageTitle: 'API Test Report',
    embeddedScreenshots: true,
    inlineAssets: true,
  },
});

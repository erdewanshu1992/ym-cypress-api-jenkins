import { defineConfig } from 'cypress';
import cypressOnRun from 'cypress-mochawesome-reporter/plugin';

export default defineConfig({
  e2e: {
    baseUrl: 'https://api-live.yesmadam.com',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
    fixturesFolder: 'cypress/fixtures',
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',

    // API testing specific settings
    video: false,
    screenshotOnRunFailure: true,

    // Timeouts
    defaultCommandTimeout: 10000,
    requestTimeout: 15000,
    responseTimeout: 15000,

    // Retry configuration
    retries: {
      runMode: 2,
      openMode: 0,
    },

    // Environment variables
    env: {
      apiUrl: 'https://api-live.yesmadam.com',
      apiVersion: 'v3',
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

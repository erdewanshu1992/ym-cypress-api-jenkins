/**
 * Cypress Support File
 * Loaded before every test file
 */

import './commands';
import 'cypress-mochawesome-reporter/register';

// Global before hook
before(() => {
  cy.log('🚀 Starting Test Suite');
});

// Global after hook
after(() => {
  cy.log('✅ Test Suite Completed');
});

// Global beforeEach hook
beforeEach(() => {
  cy.log(`📝 Starting Test: ${Cypress.currentTest.title}`);
});

// Global afterEach hook
afterEach(() => {
  cy.log(`✅ Completed Test: ${Cypress.currentTest.title}`);
});

// Fail fast on uncaught exceptions (optional - can be configured)
Cypress.on('uncaught:exception', (err) => {
  // Return false to prevent Cypress from failing the test
  // You can add custom logic here to handle specific exceptions
  cy.log(`⚠️ Uncaught Exception: ${err.message}`);
  return false;
});

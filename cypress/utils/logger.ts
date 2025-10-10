/**
 * Logger Utility
 * Provides consistent logging throughout the framework
 */

export class Logger {
  static info(message: string, data?: Record<string, unknown> | string | number | boolean): void {
    cy.log(`ℹ️ INFO: ${message}`);
    if (data) {
      cy.task('log', `INFO: ${message}`);
      cy.task('log', data);
    } else {
      cy.task('log', `INFO: ${message}`);
    }
  }

  static success(message: string): void {
    cy.log(`✅ SUCCESS: ${message}`);
    cy.task('log', `SUCCESS: ${message}`);
  }

  static error(message: string, error?: Error | string | unknown): void {
    cy.log(`❌ ERROR: ${message}`);
    cy.task('log', `ERROR: ${message}`);
    if (error) {
      cy.task('log', error);
    }
  }

  static warning(message: string): void {
    cy.log(`⚠️ WARNING: ${message}`);
    cy.task('log', `WARNING: ${message}`);
  }

  static request(method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | string, url: string, body?: Record<string, unknown> | string | null): void {
    cy.log(`🚀 ${method} Request: ${url}`);
    cy.task('log', `${method} Request: ${url}`);
    if (body) {
      try {
        cy.task('log', `Request Body: ${JSON.stringify(body, null, 2)}`);
      } catch (error) {
        cy.task('log', `Request Body: [Unable to stringify body: ${error}]`);
      }
    }
  }

  static response(status: number, body: unknown, duration: number): void {
    cy.log(`📥 Response: ${status} (${duration}ms)`);
    cy.task('log', `Response Status: ${status}`);
    cy.task('log', `Response Duration: ${duration}ms`);
    try {
      cy.task('log', `Response Body: ${JSON.stringify(body, null, 2)}`);
    } catch (error) {
      cy.task('log', `Response Body: [Unable to stringify body: ${error}]`);
    }
  }

  static assertion(message: string): void {
    cy.log(`🔍 Assertion: ${message}`);
    cy.task('log', `Assertion: ${message}`);
  }
}

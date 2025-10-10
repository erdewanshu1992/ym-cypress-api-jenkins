/**
 * Custom Cypress Commands
 * Extends Cypress with custom commands for API testing
 */

import { ApiHelper } from '../utils/apiHelper';
import { ResponseValidator } from '../utils/responseValidator';
import { Logger } from '../utils/logger';

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to make API requests with enhanced logging
       * @example cy.apiRequest({ method: 'POST', url: '/api/login', body: {...} })
       */
      apiRequest(options: {
        method?: string;
        url: string;
        body?: any;
        headers?: Record<string, string>;
        qs?: Record<string, any>;
      }): Chainable<any>;

      /**
       * Custom command to login and store auth token
       * @example cy.login(9855566677, 2222)
       */
      login(mobile: number, otp: number): Chainable<any>;

      /**
       * Custom command to validate response status
       * @example cy.validateStatus(response, 200)
       */
      validateStatus(response: any, expectedStatus: number): Chainable<any>;

      /**
       * Custom command to validate response schema
       * @example cy.validateSchema(response.body, { status: 'string', data: 'object' })
       */
      validateSchema(body: any, schema: Record<string, string>): Chainable<any>;

      /**
       * Custom command to get auth token from environment
       * @example cy.getAuthToken()
       */
      getAuthToken(): Chainable<string>;

      /**
       * Custom command to set auth token in environment
       * @example cy.setAuthToken('token123')
       */
      setAuthToken(token: string): Chainable<void>;
    }
  }
}

// API Request Command
Cypress.Commands.add('apiRequest', (options) => {
  Logger.request(options.method || 'GET', options.url, options.body);

  return ApiHelper.makeRequest({
    url: options.url,
    method: (options.method as any) || 'GET',
    body: options.body,
    headers: options.headers,
    qs: options.qs,
  }).then((response) => {
    Logger.response(response.status, response.body, response.duration);
    return cy.wrap(response);
  });
});

// Login Command
Cypress.Commands.add('login', (mobile: number, otp: number) => {
  Logger.info(`Logging in with mobile: ${mobile}`);

  return cy
    .apiRequest({
      method: 'POST',
      url: `${Cypress.config('baseUrl')}/v3/userapi/login`,
      body: { mobile },
    })
    .then((loginResponse) => {
      expect(loginResponse.status).to.equal(200);

      return cy
        .apiRequest({
          method: 'POST',
          url: `${Cypress.config('baseUrl')}/v3/userapi/otp/verification`,
          body: { mobile, otp },
        })
        .then((otpResponse) => {
          expect(otpResponse.status).to.equal(200);
          const token = otpResponse.body.message;
          cy.setAuthToken(token);
          Logger.success('Login successful');
          return cy.wrap(otpResponse);
        });
    });
});

// Validate Status Command
Cypress.Commands.add('validateStatus', (response, expectedStatus) => {
  ResponseValidator.validateStatusCode(response, expectedStatus);
  return cy.wrap(response);
});

// Validate Schema Command
Cypress.Commands.add('validateSchema', (body, schema) => {
  ResponseValidator.validateSchema(body, schema);
  return cy.wrap(body);
});

// Get Auth Token Command
Cypress.Commands.add('getAuthToken', () => {
  const token = Cypress.env('authToken');
  return cy.wrap(token);
});

// Set Auth Token Command
Cypress.Commands.add('setAuthToken', (token: string) => {
  Cypress.env('authToken', token);
  Logger.info('Auth token stored');
});

export {};

/**
 * Custom Cypress Commands
 * Extends Cypress with custom commands for API testing
 */

import { ApiHelper } from '../utils/apiHelper';
import { ResponseValidator } from '../utils/responseValidator';
import { Logger } from '../utils/logger';

// Define proper TypeScript interfaces
interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  body?: Record<string, unknown> | string | null;
  headers?: Record<string, string>;
  qs?: Record<string, string | number | boolean>;
}

// Extend Cypress Chainable interface using module augmentation
/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to make API requests with enhanced logging
       * @example cy.apiRequest({ method: 'POST', url: '/api/login', body: {...} })
       */
      apiRequest(options: ApiRequestOptions): Cypress.Chainable<Cypress.Response<unknown>>;

      /**
       * Custom command to login and store auth token
       * @example cy.login(9855566677, 2222)
       */
      login(mobile: number, otp: number): Cypress.Chainable<Cypress.Response<unknown>>;

      /**
       * Custom command to validate response status
       * @example cy.validateStatus(response, 200)
       */
      validateStatus(response: Cypress.Response<unknown>, expectedStatus: number): Cypress.Chainable<Cypress.Response<unknown>>;

      /**
       * Custom command to validate response schema
       * @example cy.validateSchema(response.body, { status: 'string', data: 'object' })
       */
      validateSchema(body: Record<string, unknown>, schema: Record<string, string>): Cypress.Chainable<Record<string, unknown>>;

      /**
       * Custom command to get auth token from environment
       * @example cy.getAuthToken()
       */
      getAuthToken(): Cypress.Chainable<string>;

      /**
       * Custom command to set auth token in environment
       * @example cy.setAuthToken('token123')
       */
      setAuthToken(token: string): Cypress.Chainable<void>;
    }
  }
}
/* eslint-enable @typescript-eslint/no-namespace */

// API Request Command
Cypress.Commands.add('apiRequest', (options) => {
  Logger.request(options.method || 'GET', options.url, options.body);

  return ApiHelper.makeRequest({
    url: options.url,
    method: options.method || 'GET',
    body: options.body,
    headers: options.headers,
    qs: options.qs,
  }).then((apiResponse) => {
    Logger.response(apiResponse.status, apiResponse.body, apiResponse.duration);

    // Convert ApiResponse to Cypress.Response format
    const cypressResponse: Cypress.Response<unknown> = {
      status: apiResponse.status,
      body: apiResponse.body,
      headers: apiResponse.headers,
      duration: apiResponse.duration,
      statusText: 'OK',
      isOkStatusCode: apiResponse.status >= 200 && apiResponse.status < 300,
      requestHeaders: {},
      allRequestResponses: []
    };

    return cy.wrap(cypressResponse);
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
          const responseBody = otpResponse.body as { message: string };
          const token = responseBody.message;
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
  const token = Cypress.env('authToken') as string;
  return cy.wrap(token);
});

// Set Auth Token Command
Cypress.Commands.add('setAuthToken', (token: string) => {
  Cypress.env('authToken', token);
  Logger.info('Auth token stored');
});

export {};

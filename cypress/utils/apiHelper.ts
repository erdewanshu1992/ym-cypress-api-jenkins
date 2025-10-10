/**
 * API Helper Utility
 * Provides reusable methods for making API requests with enhanced logging and error handling
 */

interface RequestOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: Record<string, unknown> | string | unknown;
  headers?: Record<string, string>;
  qs?: Record<string, string | number | boolean>;
  failOnStatusCode?: boolean;
  timeout?: number;
}

// API Response interfaces
interface UserObject {
  user_id: string | number;
  [key: string]: unknown;
}

interface LoginResponseBody {
  status: string;
  message: string;
  token?: string;
  object?: UserObject;
  [key: string]: unknown;
}

interface OtpVerificationResponseBody {
  status: string;
  message?: string;
  token?: string;
  object?: UserObject;
  [key: string]: unknown;
}

interface ApiResponse<T = unknown> {
  status: number;
  body: T;
  headers: Record<string, string | string[]>;
  duration: number;
}

export class ApiHelper {
  private static defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  /**
   * Make a generic API request
   */
  static makeRequest<T = unknown>(options: RequestOptions): Cypress.Chainable<ApiResponse<T>> {
    const requestOptions: Partial<Cypress.RequestOptions> = {
      method: options.method || 'GET',
      url: options.url,
      headers: { ...this.defaultHeaders, ...options.headers },
      failOnStatusCode: options.failOnStatusCode !== undefined ? options.failOnStatusCode : true,
      timeout: options.timeout,
    };

    if (options.body) {
      requestOptions.body = options.body;
    }

    if (options.qs) {
      requestOptions.qs = options.qs;
    }

    cy.log(`🚀 ${options.method || 'GET'} Request: ${options.url}`);

    return cy.request(requestOptions).then((response) => {
      cy.log(`✅ Response Status: ${response.status}`);
      return cy.wrap({
        status: response.status,
        body: response.body,
        headers: response.headers,
        duration: response.duration,
      });
    });
  }

  /**
   * GET request
   */
  static get(url: string, headers?: Record<string, string>): Cypress.Chainable<ApiResponse> {
    return this.makeRequest({ url, method: 'GET', headers });
  }

  /**
    * POST request
    */
   static post(
     url: string,
     body: Record<string, unknown> | string | unknown,
     headers?: Record<string, string>
   ): Cypress.Chainable<ApiResponse> {
     return this.makeRequest({ url, method: 'POST', body, headers });
   }

   /**
    * PUT request
    */
   static put(
     url: string,
     body: Record<string, unknown> | string | unknown,
     headers?: Record<string, string>
   ): Cypress.Chainable<ApiResponse> {
     return this.makeRequest({ url, method: 'PUT', body, headers });
   }

   /**
    * PATCH request
    */
   static patch(
     url: string,
     body: Record<string, unknown> | string | unknown,
     headers?: Record<string, string>
   ): Cypress.Chainable<ApiResponse> {
     return this.makeRequest({ url, method: 'PATCH', body, headers });
   }

  /**
   * DELETE request
   */
  static delete(url: string, headers?: Record<string, string>): Cypress.Chainable<ApiResponse> {
    return this.makeRequest({ url, method: 'DELETE', headers });
  }

  /**
   * Log response details for debugging
   */
  static logResponse<T>(response: ApiResponse<T>): void {
    cy.task('log', '=== API Response Details ===');
    cy.task('log', `Status: ${response.status}`);
    cy.task('log', `Duration: ${response.duration}ms`);
    cy.task('log', `Body: ${JSON.stringify(response.body, null, 2)}`);
  }

  /**
   * Make a login API request with proper typing
   */
  static makeLoginRequest(options: Omit<RequestOptions, 'method'>): Cypress.Chainable<ApiResponse<LoginResponseBody>> {
    return this.makeRequest<LoginResponseBody>({ ...options, method: 'POST' });
  }

  /**
   * Make an OTP verification API request with proper typing
   */
  static makeOtpVerificationRequest(options: Omit<RequestOptions, 'method'>): Cypress.Chainable<ApiResponse<OtpVerificationResponseBody>> {
    return this.makeRequest<OtpVerificationResponseBody>({ ...options, method: 'POST' });
  }
}

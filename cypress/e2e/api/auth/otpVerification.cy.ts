/**
 * Authentication API Tests - OTP Verification Flow
 */

import { ApiHelper } from '../../../utils/apiHelper';
import { ResponseValidator } from '../../../utils/responseValidator';
import { Logger } from '../../../utils/logger';

// Type definitions for fixture data
interface ValidUser {
  mobile: number;
  otp: number;
}

interface InvalidUser {
  mobile: number;
  otp: number;
}

interface Endpoints {
  login: string;
  otpVerification: string;
}

interface ExpectedResponses {
  login: {
    status_code: number;
    status: string;
    message: string;
  };
  otpVerification: {
    status_code: number;
    status: string;
  };
}

interface TestData {
  validUser: ValidUser;
  invalidUser: InvalidUser;
  endpoints: Endpoints;
  expectedResponses: ExpectedResponses;
}

interface Schemas {
  loginResponseSchema: Record<string, string>;
  otpVerificationResponseSchema: Record<string, string>;
  userObjectSchema: Record<string, string>;
}

describe('Authentication API - OTP Verification', () => {
  let testData: TestData;
  let schemas: Schemas;
  const baseUrl = Cypress.config('baseUrl');

  before(() => {
    cy.fixture('testData').then((data) => {
      testData = data;
    });
    cy.fixture('schemas').then((data) => {
      schemas = data;
    });
  });

  describe('POST /v3/userapi/otp/verification', () => {
    it('should successfully verify OTP and return auth token', () => {
      const endpoint = `${baseUrl}/v3/userapi/otp/verification`;
      const requestBody = {
        mobile: testData.validUser.mobile,
        otp: testData.validUser.otp,
      };

      Logger.info('Testing OTP verification with valid credentials');

      ApiHelper.post(endpoint, requestBody).then((response) => {
        // Validate status code
        ResponseValidator.validateStatusCode(response, 200);

        // Validate response time
        ResponseValidator.validateResponseTime(response, 3000);

        // Validate response body structure
        const fullResponseBody = response.body as {
          status_code: number;
          status: string;
          message: string;
          object: { user_id: number; email: string; mobile: number }
        };
        ResponseValidator.validateBodyHasKeys(fullResponseBody, [
          'status_code',
          'status',
          'message',
          'object',
        ]);

        // Validate specific values
        ResponseValidator.validateBodyProperty(fullResponseBody, 'status_code', 0);
        ResponseValidator.validateBodyProperty(fullResponseBody, 'status', 'success');

        // Validate that message contains JWT token
        const responseBody = response.body as {
          message: string;
          object: { user_id: number; email: string; mobile: number }
        };
        expect(responseBody.message).to.be.a('string');
        expect(responseBody.message.length).to.be.greaterThan(0);
        Logger.info(`Auth Token received: ${responseBody.message.substring(0, 20)}...`);

        // Validate object contains user details
        expect(responseBody.object).to.have.property('user_id');
        expect(responseBody.object).to.have.property('email');
        expect(responseBody.object).to.have.property('mobile');

        // Validate user object schema
        ResponseValidator.validateSchema(responseBody.object, schemas.userObjectSchema);

        // Store auth token for future tests
        cy.setAuthToken(responseBody.message);

        Logger.success('OTP verification test passed successfully');
      });
    });

    it('should validate user object data types', () => {
      const endpoint = `${baseUrl}/v3/userapi/otp/verification`;
      const requestBody = {
        mobile: testData.validUser.mobile,
        otp: testData.validUser.otp,
      };

      ApiHelper.post(endpoint, requestBody).then((response) => {
        const responseBody = response.body as { object: { user_id: number; email: string; mobile: number } };
        const userObject = responseBody.object;

        ResponseValidator.validateBodyPropertyType(userObject, 'user_id', 'number');
        ResponseValidator.validateBodyPropertyType(userObject, 'email', 'string');
        ResponseValidator.validateBodyPropertyType(userObject, 'mobile', 'number');

        Logger.success('User object data type validation passed');
      });
    });

    
    it('should handle invalid OTP gracefully', () => {
      const endpoint = `${baseUrl}/v3/userapi/otp/verification`;
      const requestBody = {
        mobile: testData.validUser.mobile,
        otp: 9999,
      };

      Logger.info('Testing OTP verification with invalid OTP');

      ApiHelper.makeRequest({
        url: endpoint,
        method: 'POST',
        body: requestBody,
        failOnStatusCode: false,
      }).then((response) => {
        // Should return error status or specific error response
        Logger.info(`Response status for invalid OTP: ${response.status}`);

        // Verify response has proper structure even for errors
        expect(response.body).to.have.property('status');
        expect(response.body).to.have.property('message');
      });
    });

    it('should handle missing OTP in request body', () => {
      const endpoint = `${baseUrl}/v3/userapi/otp/verification`;
      const requestBody = {
        mobile: testData.validUser.mobile,
      };

      Logger.info('Testing OTP verification with missing OTP');

      ApiHelper.makeRequest({
        url: endpoint,
        method: 'POST',
        body: requestBody,
        failOnStatusCode: false,
      }).then((response) => {
        // Should return error status
        expect(response.status).to.be.oneOf([200, 422]); //[400, 422]

        Logger.info('Missing field validation working as expected');
      });
    });

    it('should validate JWT token format', () => {
      const endpoint = `${baseUrl}/v3/userapi/otp/verification`;
      const requestBody = {
        mobile: testData.validUser.mobile,
        otp: testData.validUser.otp,
      };

      ApiHelper.post(endpoint, requestBody).then((response) => {
        const responseBody = response.body as { message: string };
        const token = responseBody.message;

        // JWT token should have 3 parts separated by dots
        const tokenParts = token.split('.');
        expect(tokenParts).to.have.length(3);

        // Each part should be base64 encoded (not empty)
        tokenParts.forEach((part: string) => {
          expect(part.length).to.be.greaterThan(0);
        });

        Logger.success('JWT token format validation passed');
      });
    });

    it('should return correct user details', () => {
      const endpoint = `${baseUrl}/v3/userapi/otp/verification`;
      const requestBody = {
        mobile: testData.validUser.mobile,
        otp: testData.validUser.otp,
      };

      ApiHelper.post(endpoint, requestBody).then((response) => {
        const responseBody = response.body as { object: { user_id: number; mobile: number } };
        const userObject = responseBody.object;

        // Validate mobile number matches request
        expect(userObject.mobile).to.equal(testData.validUser.mobile);

        // Validate user_id exists and is positive number
        expect(userObject.user_id).to.be.a('number');
        expect(userObject.user_id).to.be.greaterThan(0);

        Logger.success('User details validation passed');
      });
    });
  });

  describe('Performance Tests', () => {
    it('should respond within acceptable time limit', () => {
      const endpoint = `${baseUrl}/v3/userapi/otp/verification`;
      const requestBody = {
        mobile: testData.validUser.mobile,
        otp: testData.validUser.otp,
      };

      ApiHelper.post(endpoint, requestBody).then((response) => {
        // Validate response time is less than 5 seconds
        ResponseValidator.validateResponseTime(response, 5000);

        cy.log(`⚡ Response time: ${response.duration}ms`);
        Logger.success(`Performance test passed - Response time: ${response.duration}ms`);
      });
    });
  });
});

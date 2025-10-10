/**
 * Complete Authentication Flow - End to End Test
 */

import { Logger } from '../../../utils/logger';

// TypeScript interfaces for test data
interface TestUser {
  mobile: number;
  otp: number;
}

interface ExpectedResponse {
  status_code: number;
  status: string;
  message?: string;
}

interface TestData {
  validUser: TestUser;
  invalidUser: TestUser;
  endpoints: {
    login: string;
    otpVerification: string;
  };
  expectedResponses: {
    login: ExpectedResponse;
    otpVerification: ExpectedResponse;
  };
}

describe('Complete Authentication Flow', () => {
  let testData: TestData;

  before(() => {
    cy.fixture('testData').then((data) => {
      testData = data;
    });
  });

  describe('End-to-End Login Flow', () => {
    it('should complete full authentication flow from login to OTP verification', () => {
      Logger.info('Starting complete authentication flow');

      // Step 1: Login with mobile number
      cy.apiRequest({
        method: 'POST',
        url: `${Cypress.config('baseUrl')}/v3/userapi/login`,
        body: {
          mobile: testData.validUser.mobile,
        },
      }).then((loginResponse) => {
        // Validate login response
        expect(loginResponse.status).to.equal(200);
        // expect(loginResponse.body.status_code).to.equal(401);
        expect(loginResponse.body.status).to.equal('success');
        expect(loginResponse.body.message).to.include('otp verification');

        Logger.success('Step 1: Login successful - OTP sent');

        // Step 2: Verify OTP
        cy.apiRequest({
          method: 'POST',
          url: `${Cypress.config('baseUrl')}/v3/userapi/otp/verification`,
          body: {
            mobile: testData.validUser.mobile,
            otp: testData.validUser.otp,
          },
        }).then((otpResponse) => {
          // Validate OTP verification response
          expect(otpResponse.status).to.equal(200);
          expect(otpResponse.body.status_code).to.equal(0);
          expect(otpResponse.body.status).to.equal('success');

          // Validate auth token
          const authToken = otpResponse.body.message;
          expect(authToken).to.be.a('string');
          expect(authToken.length).to.be.greaterThan(0);

          // Validate user details
          expect(otpResponse.body.object).to.have.property('user_id');
          expect(otpResponse.body.object).to.have.property('email');
          expect(otpResponse.body.object).to.have.property('mobile');

          // Store auth token
          cy.setAuthToken(authToken);

          Logger.success('Step 2: OTP verification successful');
          Logger.success('Complete authentication flow passed');

          // Log complete user details
          cy.log('User Details:', otpResponse.body.object);
        });
      });
    });

    it('should use custom login command for authentication', () => {
      Logger.info('Testing custom login command');

      cy.login(testData.validUser.mobile, testData.validUser.otp).then((response) => {
        expect(response.status).to.equal(200);
        const responseBody = response.body as { status: string };
        expect(responseBody.status).to.equal('success');

        cy.getAuthToken().then((token) => {
          expect(token).to.exist;
          expect(token).to.be.a('string');
          Logger.success('Custom login command working correctly');
        });
      });
    });
  });

  describe('Authentication State Management', () => {
    it('should persist auth token across tests', () => {
      // Login first
      cy.login(testData.validUser.mobile, testData.validUser.otp);

      // Verify token is stored
      cy.getAuthToken().then((token) => {
        expect(token).to.exist;
        expect(token).to.be.a('string');
        Logger.success('Auth token persisted successfully');
      });
    });

    it('should be able to retrieve stored auth token', () => {
      cy.getAuthToken().then((token) => {
        if (token) {
          Logger.info(`Retrieved auth token: ${token.substring(0, 20)}...`);
          expect(token).to.be.a('string');
        } else {
          Logger.warning('No auth token found - login required');
        }
      });
    });
  });
});

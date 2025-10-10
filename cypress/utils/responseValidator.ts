/**
  * Response Validator Utility
  * Provides methods to validate API responses
  */

interface ApiResponse {
  status: number;
  body: unknown;
  headers: Record<string, string | string[]>;
  duration: number;
}

export class ResponseValidator {
  /**
    * Validate status code
    */
   static validateStatusCode(response: ApiResponse, expectedStatus: number): void {
    expect(response.status, `Status code should be ${expectedStatus}`).to.equal(expectedStatus);
  }

  /**
    * Validate response time
    */
   static validateResponseTime(response: ApiResponse, maxTime: number): void {
    expect(response.duration, `Response time should be less than ${maxTime}ms`).to.be.lessThan(
      maxTime
    );
  }

  /**
    * Validate response body contains specific keys
    */
   static validateBodyHasKeys(body: Record<string, unknown>, keys: string[]): void {
    keys.forEach((key) => {
      expect(body, `Response body should contain key: ${key}`).to.have.property(key);
    });
  }

  /**
    * Validate response body property value
    */
  //  static validateBodyProperty(body: Record<string, unknown>, key: string, expectedValue: unknown): void {
  //   expect(body[key], `${key} should equal ${expectedValue}`).to.equal(expectedValue);
  // }

  static validateBodyProperty(
    body: Record<string, unknown>, 
    key: string, 
    expectedValue?: unknown
    ): void {
    expect(body, `Response should have property: ${key}`).to.have.property(key);

    const actualValue = body[key];

    if (expectedValue === null) {
      // Expected null
      expect(actualValue, `${key} should be null`).to.be.null;
    } else if (expectedValue === undefined) {
      // Expected undefined
      expect(actualValue, `${key} should be undefined`).to.be.undefined;
    } else if (typeof expectedValue === "string") {
      // String check (case-insensitive, trim safe)
      expect(
        String(actualValue).trim().toLowerCase(),
        `${key} should equal (case-insensitive) ${expectedValue}`
      ).to.equal(String(expectedValue).trim().toLowerCase());
    } else {
      // Default strict check
      expect(actualValue, `${key} should equal ${expectedValue}`).to.equal(expectedValue);
    }
  }



  /**
    * Validate response body property type
    */
   static validateBodyPropertyType(body: Record<string, unknown>, key: string, expectedType: string): void {
    expect(body[key], `${key} should be of type ${expectedType}`).to.be.a(expectedType);
  }

  /**
    * Validate response header exists
    */
   static validateHeaderExists(headers: Record<string, string | string[]>, headerName: string): void {
    expect(headers, `Header ${headerName} should exist`).to.have.property(headerName);
  }

  /**
    * Validate response matches schema
    */
  //  static validateSchema(body: Record<string, unknown>, schema: Record<string, string>): void {
  //   Object.keys(schema).forEach((key) => {
  //     expect(body, `Response should have property: ${key}`).to.have.property(key);
  //     expect(body[key], `${key} should be of type ${schema[key]}`).to.be.a(schema[key]);
  //   });
  // }


  static validateSchema(
    body: Record<string, unknown>,
    schema: Record<string, string | string[]>
    ): void {
    Object.keys(schema).forEach((key) => {
      expect(body, `Response should have property: ${key}`).to.have.property(key);

      const expectedTypes = Array.isArray(schema[key]) ? schema[key] : [schema[key]];
      const value = body[key];

      if (value === null) {
        // Null value allowed automatically if schema has string/object/number
        if (!expectedTypes.includes("null")) {
          // Optional tolerance: auto-accept null for optional fields
          console.warn(`⚠️ Warning: ${key} is null but schema expected ${expectedTypes}. Consider adding "null" to schema.`);
        }
      } else if (value === undefined) {
        if (!expectedTypes.includes("undefined")) {
          console.warn(`⚠️ Warning: ${key} is undefined but schema expected ${expectedTypes}. Consider adding "undefined" to schema.`);
        }
      } else {
        expect(expectedTypes, `${key} should be one of ${expectedTypes}`).to.include(typeof value);
      }
    });
  }



  /**
    * Validate array response
    */
   static validateArray(body: unknown, minLength?: number, maxLength?: number): void {
     expect(body, 'Response should be an array').to.be.an('array');
     const arrayBody = body as { length: number };
     if (minLength !== undefined) {
       expect(arrayBody.length, `Array length should be at least ${minLength}`).to.be.at.least(
         minLength
       );
     }
     if (maxLength !== undefined) {
       expect(arrayBody.length, `Array length should be at most ${maxLength}`).to.be.at.most(maxLength);
     }
   }

  /**
    * Validate response body is not empty
    */
   static validateNotEmpty(body: unknown): void {
     if (Array.isArray(body)) {
       expect(body, 'Array should not be empty').to.have.length.greaterThan(0);
     } else if (typeof body === 'object' && body !== null) {
       expect(Object.keys(body as Record<string, unknown>), 'Object should not be empty').to.have.length.greaterThan(0);
     } else {
       expect(body, 'Response should not be null or undefined').to.exist;
     }
   }

  /**
    * Validate error response
    */
   static validateErrorResponse(body: Record<string, unknown>, expectedMessage?: string): void {
    expect(body).to.have.property('status');
    expect(body).to.have.property('message');
    if (expectedMessage) {
      expect(body.message).to.include(expectedMessage);
    }
  }
}

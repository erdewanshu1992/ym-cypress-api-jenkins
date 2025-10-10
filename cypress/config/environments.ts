/**
 * Environment Configuration
 * Manages different environments (dev, staging, production)
 */

export interface Environment {
  name: string;
  apiUrl: string;
  apiVersion: string;
  timeout: number;
}

export const environments: Record<string, Environment> = {
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
  ci: {
    name: 'ci',
    apiUrl: 'https://api-live.yesmadam.com',
    apiVersion: 'v3',
    timeout: 45000, // Longer timeout for CI environment
  },
};

export class EnvironmentConfig {
  private static _currentEnv: string = 'production';

  private static get currentEnv(): string {
    if (this._currentEnv === 'production') {
      // Lazy initialization - only access Cypress when needed
      this._currentEnv = Cypress.env('environment') ||
        (process.env.CI ? 'ci' : 'production') || 'production';
    }
    return this._currentEnv;
  }

  static getEnvironment(): Environment {
    return environments[this.currentEnv];
  }

  static getApiUrl(): string {
    return this.getEnvironment().apiUrl;
  }

  static getApiVersion(): string {
    return this.getEnvironment().apiVersion;
  }

  static getTimeout(): number {
    return this.getEnvironment().timeout;
  }

  static buildUrl(endpoint: string): string {
    const env = this.getEnvironment();
    return `${env.apiUrl}/${env.apiVersion}${endpoint}`;
  }
}

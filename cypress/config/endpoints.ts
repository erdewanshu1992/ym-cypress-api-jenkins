/**
 * API Endpoints Configuration
 * Centralized location for all API endpoints
 */

export const endpoints = {
  auth: {
    login: '/userapi/login',
    otpVerification: '/userapi/otp/verification',
    logout: '/userapi/logout',
  },
  user: {
    profile: '/userapi/profile',
    updateProfile: '/userapi/profile/update',
  },
  // Add more endpoint categories as needed
};

export class EndpointBuilder {
  /**
   * Build full endpoint URL with query parameters
   */
  static buildUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
    if (!params) {
      return endpoint;
    }

    const queryString = Object.keys(params)
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');

    return `${endpoint}?${queryString}`;
  }

  /**
   * Replace path parameters in endpoint
   */
  static replaceParams(endpoint: string, params: Record<string, string | number>): string {
    let url = endpoint;
    Object.keys(params).forEach((key) => {
      url = url.replace(`:${key}`, String(params[key]));
    });
    return url;
  }
}

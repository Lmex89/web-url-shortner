import axios from 'axios';
import config from '../config/environment';

// Base configuration for the API
const API_BASE_URL = config.API_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: config.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging and authentication
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 Making ${config.method?.toUpperCase()} request to: ${config.baseURL}${config.url}`);
    console.log('📝 Request payload:', config.data);
    console.log('🔧 Request headers:', config.headers);
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ Response from ${response.config.url}:`, response.data);
    console.log('📊 Response status:', response.status);
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please try again.');
    }
    
    if (!error.response) {
      throw new Error('Network error. Please check your connection.');
    }
    
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        throw new Error(data?.message || 'Invalid request. Please check your input.');
      case 401:
        throw new Error('Unauthorized. Please check your credentials.');
      case 403:
        throw new Error('Forbidden. You don\'t have permission to perform this action.');
      case 404:
        throw new Error('Resource not found.');
      case 429:
        throw new Error('Too many requests. Please try again later.');
      case 500:
        throw new Error('Server error. Please try again later.');
      default:
        throw new Error(data?.message || 'An unexpected error occurred.');
    }
  }
);

/**
 * URL Shortener API Service
 */
export const urlShortenerService = {
  /**
   * Shortens a long URL
   * @param {string} originalUrl - The original URL to shorten
   * @returns {Promise<Object>} - The shortened URL data
   */
  async shortenUrl(originalUrl) {
    try {
      // Validate URL format
      if (!this.isValidUrl(originalUrl)) {
        throw new Error('Please enter a valid URL (must start with http:// or https://)');
      }

      const response = await apiClient.post('/', {
        original_url: originalUrl,
        // You can add additional parameters here like:
        // customAlias: customAlias,
        // expirationDate: expirationDate,
      });

      console.log('🔍 Raw API Response:', response.data);

      return {
        success: true,
        data: {
          shortUrl: response.data.short_url || response.data.shortUrl,
          originalUrl: response.data.original_url || response.data.originalUrl || originalUrl,
          id: response.data.id || response.data.short_code || 'unknown',
          createdAt: response.data.created_at || response.data.createdAt || new Date().toISOString(),
          clicks: response.data.clicks || response.data.click_count || 0,
        },
      };
    } catch (error) {
      console.error('Error shortening URL:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * Retrieves the original URL from a short URL
   * @param {string} shortCode - The short code to expand
   * @returns {Promise<Object>} - The original URL data
   */
  async getOriginalUrl(shortCode) {
    try {
      const response = await apiClient.get(`${shortCode}`);
      
      return {
        success: true,
        data: {
          originalUrl: response.data.originalUrl,
          shortUrl: response.data.shortUrl,
          clicks: response.data.clicks,
          createdAt: response.data.createdAt,
        },
      };
    } catch (error) {
      console.error('Error getting original URL:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * Gets analytics for a short URL
   * @param {string} shortCode - The short code to get analytics for
   * @returns {Promise<Object>} - The analytics data
   */
  async getAnalytics(shortCode) {
    try {
      const response = await apiClient.get(`/analytics/${shortCode}`);
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Error getting analytics:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * Validates if a string is a valid URL
   * @param {string} string - The string to validate
   * @returns {boolean} - True if valid URL, false otherwise
   */
  isValidUrl(string) {
    try {
      const url = new URL(string);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
      return false;
    }
  },
};

// Demo/Mock service for testing when backend is not available
export const mockUrlShortenerService = {
  /**
   * Mock implementation for development/testing
   */
  async shortenUrl(originalUrl) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (!urlShortenerService.isValidUrl(originalUrl)) {
      return {
        success: false,
        error: 'Please enter a valid URL (must start with http:// or https://)',
      };
    }

    // Generate a mock short URL
    const shortCode = Math.random().toString(36).substring(2, 8);
    const mockShortUrl = `https://short.ly/${shortCode}`;
    
    return {
      success: true,
      data: {
        shortUrl: mockShortUrl,
        originalUrl: originalUrl,
        id: shortCode,
        createdAt: new Date().toISOString(),
        clicks: 0,
      },
    };
  },

  async getOriginalUrl(shortCode) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      data: {
        originalUrl: 'https://example.com/very/long/url/that/was/shortened',
        shortUrl: `https://short.ly/${shortCode}`,
        clicks: Math.floor(Math.random() * 100),
        createdAt: new Date().toISOString(),
      },
    };
  },

  isValidUrl: urlShortenerService.isValidUrl,
};

// Export the service to use (switch between real and mock)
export default config.USE_MOCK_API 
  ? mockUrlShortenerService 
  : urlShortenerService; 
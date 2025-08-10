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

// --- Request Interceptor ---
// This function runs before every request is sent.
apiClient.interceptors.request.use(
  (requestConfig) => {
    console.log(`🚀 Making ${requestConfig.method?.toUpperCase()} request to: ${requestConfig.baseURL}${requestConfig.url}`);
    
    // ✅ BEST PRACTICE: Securely add the API key from environment variables.
    // This ensures every request is authenticated without repeating code.
    const apiKey = config.API_KEY; // Assuming your config loads this from .env
    
    if (apiKey) {
      requestConfig.headers['x-api-key'] = apiKey;
    } else {
      // This warning is helpful during development to ensure the key is configured.
      console.warn('⚠️ API key is missing. Requests may fail authentication.');
    }

    console.log('🔧 Request headers:', requestConfig.headers);
    return requestConfig;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// --- Response Interceptor ---
// This handles responses and errors globally.
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ Response from ${response.config.url}:`, response.data);
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
        throw new Error('Unauthorized. Please check your API key.');
      case 403:
        throw new Error('Forbidden. You don\'t have permission for this action.');
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
 * * No changes are needed here. The interceptor handles the API key automatically.
 */
export const urlShortenerService = {
  /**
   * Shortens a long URL
   * @param {string} originalUrl - The original URL to shorten
   * @returns {Promise<Object>} - The shortened URL data
   */
  async shortenUrl(originalUrl) {
    try {
      if (!this.isValidUrl(originalUrl)) {
        throw new Error('Please enter a valid URL (must start with http:// or https://)');
      }

      const response = await apiClient.post('/', {
        original_url: originalUrl,
      });

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
      const response = await apiClient.get(`/${shortCode}`);
      
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
   * Validates if a string is a valid URL
   * @param {string} urlString - The string to validate
   * @returns {boolean} - True if valid URL, false otherwise
   */
  isValidUrl(urlString) {
    try {
      const url = new URL(urlString);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
      return false;
    }
  },
};

// ... (mock service remains the same)

// Export the service to use (switch between real and mock)
export default config.USE_MOCK_API 
  ? mockUrlShortenerService 
  : urlShortenerService;

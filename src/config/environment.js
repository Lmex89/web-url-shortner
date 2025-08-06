// ============================================
// ENVIRONMENT CONFIGURATION
// ============================================
// This file centralizes all environment variable access
// and provides defaults for development

/**
 * Environment configuration object
 * All React environment variables must start with REACT_APP_
 */
const config = {
  // API Configuration
  API_URL: process.env.REACT_APP_API_URL || 'https://api.example.com/v1',
  USE_MOCK_API: process.env.REACT_APP_USE_MOCK_API === 'true',
  API_TIMEOUT: parseInt(process.env.REACT_APP_API_TIMEOUT) || 10000,
  API_RETRY_ATTEMPTS: parseInt(process.env.REACT_APP_API_RETRY_ATTEMPTS) || 3,

  // App Configuration
  APP_NAME: process.env.REACT_APP_NAME || 'URL Shortener',
  APP_VERSION: process.env.REACT_APP_VERSION || '1.0.0',

  // Feature Flags
  ENABLE_ANALYTICS: process.env.REACT_APP_ENABLE_ANALYTICS === 'true' || false,
  ENABLE_DEBUG: process.env.REACT_APP_ENABLE_DEBUG === 'true' || false,
  SHOW_DEV_TOOLS: process.env.REACT_APP_SHOW_DEV_TOOLS === 'true' || false,

  // Environment Detection
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTesting: process.env.NODE_ENV === 'test',
};

/**
 * Validate required environment variables
 */
const validateConfig = () => {
  const requiredVars = [];

  // Add required variables here
  if (!config.API_URL) {
    requiredVars.push('REACT_APP_API_URL');
  }

  if (requiredVars.length > 0) {
    console.error('Missing required environment variables:', requiredVars);
    if (config.isProduction) {
      throw new Error(`Missing required environment variables: ${requiredVars.join(', ')}`);
    }
  }
};

// Validate configuration on import
validateConfig();

// Log configuration in development
if (config.isDevelopment && config.ENABLE_DEBUG) {
  console.group('🔧 Environment Configuration');
  console.table({
    'API URL': config.API_URL,
    'Use Mock API': config.USE_MOCK_API,
    'Environment': process.env.NODE_ENV,
    'App Name': config.APP_NAME,
    'Version': config.APP_VERSION,
  });
  console.groupEnd();
}

export default config; 
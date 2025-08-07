
// ============================================
// ENVIRONMENT CONFIGURATION
// ============================================
// This file centralizes all environment variable access
// and provides defaults for development
/**
 * Environment configuration object
 * All React environment variables must start with VITE_REACT_APP_
 */
const config = {
  // API Configuration
  API_URL: import.meta.env.VITE_REACT_APP_API_URL || "REPLACE_API_URL",
  USE_MOCK_API: import.meta.env.VITE_REACT_APP_USE_MOCK_API === 'true',
  API_TIMEOUT: parseInt(import.meta.env.ITE_REACT_APP_API_TIMEOUT) || 10000,
  API_RETRY_ATTEMPTS: parseInt(import.meta.env.VITE_REACT_APP_API_RETRY_ATTEMPTS) || 3,

  // App Configuration
  APP_NAME: import.meta.env.VITE_REACT_APP_NAME || 'URL Shortener',
  APP_VERSION: import.meta.env.VITE_REACT_APP_VERSION || '1.0.0',

  // Feature Flags
  ENABLE_ANALYTICS: import.meta.env.VITE_REACT_APP_ENABLE_ANALYTICS === 'true' || false,
  ENABLE_DEBUG: import.meta.env.VITE_REACT_APP_ENABLE_DEBUG === 'true' || false,
  SHOW_DEV_TOOLS: import.meta.env.VITE_REACT_APP_SHOW_DEV_TOOLS === 'true' || false,

  // Environment Detectio
  isDevelopment: import.meta.env.DEV === 'development',
  isProduction: import.meta.env.PROD === 'production',
  isTesting: import.meta.env.DEV === 'test',
};

/**
 * Validate required environment variables
 */
const validateConfig = () => {
  const requiredVars = [];

  console.log("mis variables son ",config)

  // Add required variables here
  if (!config.API_URL) {
    requiredVars.push('VITE_REACT_APP_API_URL');
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
    'Environment': import.meta.envNODE_ENV,
    'App Name': config.APP_NAME,
    'Version': config.APP_VERSION,
  });
  console.groupEnd();
}

export default config; 

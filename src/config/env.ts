const appName = import.meta.env.VITE_APP_NAME || 'App';
const appEnv = import.meta.env.VITE_APP_ENV || 'development';
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const apiLoginPath = import.meta.env.VITE_API_LOGIN_PATH || '/api/login';
const apiTimeoutMs = Number(import.meta.env.VITE_API_TIMEOUT_MS || 15000);

export const env = {
  appName,
  appEnv,
  apiBaseUrl,
  apiLoginPath,
  apiTimeoutMs,
};

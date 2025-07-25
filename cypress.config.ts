import { defineConfig } from 'cypress';

/**
 * Cypress configuration file. Sets the baseUrl for the application under
 * test and disables the default support file since none is used.
 */
export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    supportFile: false,
  },
});
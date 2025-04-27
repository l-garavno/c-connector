import { defineConfig } from 'vitest/config';

export default defineConfig({
  envDir: './environments',
  envPrefix: 'VITE_ENV',
  test: {
    globals: true,
    environment: 'node',
  },
});

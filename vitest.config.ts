import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['src/test/setup.ts'],
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      include: ['src/lib/**/*.ts', 'src/features/**/*.ts'],
      exclude: ['**/*.test.{ts,tsx}', '**/*.d.ts'],
      reporter: ['text', 'html', 'lcov'],
      thresholds: { lines: 85, statements: 85, branches: 85, functions: 85 },
    },
  },
});

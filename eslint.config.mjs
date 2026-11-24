import js from '@eslint/js';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'coverage/**',
      'playwright-report/**',
      'visual-report/**',
      'test-results/**',
      '.lighthouseci/**',
      'lighthouse-report/**',
      '.husky/_/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.strict,
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ['**/*.tsx', 'src/hooks/**/*.ts', 'src/features/**/*.ts'],
    plugins: { 'react-hooks': reactHooks, 'jsx-a11y': jsxA11y },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.flatConfigs.recommended.rules,
    },
  },
  {
    files: ['*.{mjs,cjs,ts}', 'scripts/**/*.{mjs,ts}', 'e2e/**/*.ts'],
    languageOptions: { globals: globals.node },
  },
);

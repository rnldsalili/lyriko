import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import importPlugin from 'eslint-plugin-import';
import onlyWarn from 'eslint-plugin-only-warn';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import('eslint').Linter.Config}
 * */
export const config = [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: globals.browser } },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    plugins: {
      import: importPlugin,
      '@stylistic': stylistic,
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
        typescript: {
          alwaysTryTypes: true,
          project: [
            './tsconfig.json',
            './packages/*/tsconfig.json',
            './apps/*/tsconfig.json',
          ],
        },
      },
    },
    rules: {
      'comma-dangle': ['error', 'always-multiline'],
      'no-empty-pattern': 'off',
      'import/no-duplicates': 'error',
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
          pathGroups: [
            {
              pattern: 'hono',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@hono/**',
              group: 'external',
              position: 'after',
            },
            {
              pattern: '@/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@/middleware/**',
              group: 'internal',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['type'],
          distinctGroup: false,
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'object-curly-spacing': ['error', 'always'],
      semi: ['error', 'always'],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
          disallowTypeAnnotations: false,
        },
      ],
    },
  },
  { plugins: { onlyWarn } },
  {
    ignores: [
      // Dependencies
      'node_modules/**',
      'apps/*/node_modules/**',
      'packages/*/node_modules/**',
      'bun.lockb',
      'package-lock.json',

      // Build outputs
      'dist/**',
      'build/**',
      '.next/**',
      'out/**',

      // Development and tooling
      '.turbo/**',
      '.wrangler/**',
      '.react-router/**',

      // Generated files
      '**/*.d.ts',
      '!**/worker-configuration.d.ts',
      '!packages/eslint-config/eslint-plugin-only-warn.d.ts',

      // Logs
      '**/*.log',
      '**/npm-debug.log*',
      '**/yarn-debug.log*',
      '**/yarn-error.log*',

      // Environment files
      '**/.env*',

      // IDE
      '**/.vscode/**',
      '**/.idea/**',

      // OS
      '**/.DS_Store',
      '**/Thumbs.db',
    ],
  },
];

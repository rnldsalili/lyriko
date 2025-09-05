import stylisticJsx from '@stylistic/eslint-plugin-jsx';
import stylisticTs from '@stylistic/eslint-plugin-ts';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

import { config as baseConfig } from './base.js';

/**
 * A custom ESLint configuration for libraries that use React.
 *
 * @type {import("eslint").Linter.Config} */
export const config = [
  {
    ...pluginReact.configs.flat.recommended,
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
      },
    },
  },
  ...baseConfig,
  {
    plugins: {
      '@stylistic/ts': stylisticTs,
      '@stylistic/jsx': stylisticJsx,
    },
    rules: {
      'jsx-quotes': ['error', 'prefer-double'],
      'react/jsx-no-target-blank': 'off',
      'react/prop-types': 0,
      'react/react-in-jsx-scope': 0,

      '@stylistic/jsx/jsx-child-element-spacing': 1,
      '@stylistic/jsx/jsx-closing-bracket-location': [1, 'tag-aligned'],
      '@stylistic/jsx/jsx-curly-spacing': ['error', 'never'],
      '@stylistic/jsx/jsx-equals-spacing': ['error', 'never'],
      '@stylistic/jsx/jsx-function-call-newline': ['error', 'multiline'],
      '@stylistic/jsx/jsx-closing-tag-location': ['error', 'tag-aligned'],
      '@stylistic/jsx/jsx-indent-props': ['error', 2],
      '@stylistic/jsx/jsx-pascal-case': ['error', { allowAllCaps: false }],
      '@stylistic/jsx/jsx-self-closing-comp': [
        'error',
        {
          component: true,
          html: true,
        },
      ],
      '@stylistic/jsx/jsx-sort-props': [
        1,
        {
          shorthandFirst: true,
          multiline: 'last',
        },
      ],
      '@stylistic/jsx/jsx-tag-spacing': [
        1,
        { beforeSelfClosing: 'proportional-always' },
      ],
      '@stylistic/jsx/jsx-wrap-multilines': [
        'error',
        {
          declaration: 'parens-new-line',
          assignment: 'parens-new-line',
          return: 'parens-new-line',
          arrow: 'parens-new-line',
          condition: 'parens-new-line',
          logical: 'parens-new-line',
          prop: 'parens-new-line',
        },
      ],
    },
  },
  {
    plugins: {
      'react-hooks': pluginReactHooks,
    },
    settings: { react: { version: 'detect' } },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      // React scope no longer necessary with new JSX transform.
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
    },
  },
];

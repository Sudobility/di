import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';
import importX from 'eslint-plugin-import-x';

export default [
  js.configs.recommended,
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      globals: {
        FormData: 'readonly',
        Blob: 'readonly',
        AbortSignal: 'readonly',
        RequestInit: 'readonly',
        RequestInfo: 'readonly',
        Request: 'readonly',
        Response: 'readonly',
        Headers: 'readonly',
        BodyInit: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        Promise: 'readonly',
        Map: 'readonly',
        Set: 'readonly',
        Date: 'readonly',
        Array: 'readonly',
        // Web Storage APIs
        Storage: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        // Web APIs
        window: 'readonly',
        navigator: 'readonly',
        fetch: 'readonly',
        AbortController: 'readonly',
        Notification: 'readonly',
        // React Native globals
        __DEV__: 'readonly',
        require: 'readonly',
        process: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      prettier: prettier,
      'import-x': importX,
    },
    rules: {
      'react-hooks/refs': 'off',
      'react-hooks/use-memo': 'off',
      'react-hooks/incompatible-library': 'off',
      'react-hooks/globals': 'off',
      'react-hooks/error-boundaries': 'off',
      'react-hooks/set-state-in-render': 'off',
      'react-hooks/unsupported-syntax': 'off',
      'react-hooks/config': 'off',
      'react-hooks/gating': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/static-components': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
      'preserve-caught-error': 'off',
      'no-useless-assignment': 'off',
      'prettier/prettier': 'error',
      'no-unused-vars': 'off', // Turn off base rule to avoid conflicts
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          args: 'none', // Don't check unused arguments in function signatures
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-require-imports': 'off',
      'import-x/extensions': [
        'error',
        'always',
        { ignorePackages: true },
      ],
    },
  },
];
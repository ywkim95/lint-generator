import { ConfigPreset } from '@/types/preset';

export const eslintPresets: ConfigPreset[] = [
  {
    id: 'official',
    name: '공식 기본값',
    description: 'ESLint 공식 권장 설정입니다',
    prettierRules: {},
    eslintRules: {
      'no-console': 'warn',
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
      'no-unused-vars': 'warn',
      'no-undef': 'error',
    },
    parserOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
    },
  },
  {
    id: 'airbnb',
    name: 'Airbnb',
    description: 'Airbnb JavaScript Style Guide 기반 ESLint 설정입니다',
    prettierRules: {},
    eslintRules: {
      'no-console': 'error',
      'semi': ['error', 'always'],
      'quotes': ['error', 'single', { avoidEscape: true }],
      'comma-dangle': ['error', 'always-multiline'],
      'no-unused-vars': 'error',
      'no-undef': 'error',
      'prefer-const': 'error',
      'arrow-parens': ['error', 'always'],
    },
    parserOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      ecmaFeatures: { jsx: true },
    },
  },
  {
    id: 'standard',
    name: 'Standard',
    description: 'Standard JS ESLint 설정입니다 (세미콜론 없음)',
    prettierRules: {},
    eslintRules: {
      'no-console': 'warn',
      'semi': ['error', 'never'],
      'quotes': ['error', 'single'],
      'comma-dangle': ['error', 'never'],
      'no-unused-vars': 'warn',
      'no-undef': 'error',
      'space-before-function-paren': ['error', 'always'],
    },
    parserOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
    },
  },
];

export const defaultPreset = eslintPresets[0];

import { ConfigPreset } from '@/types/preset';

export const prettierPresets: ConfigPreset[] = [
  {
    id: 'official',
    name: '공식 기본값',
    description: 'Prettier 공식 권장 설정입니다',
    prettierRules: {
      semi: true,
      singleQuote: false,
      tabWidth: 2,
      printWidth: 80,
      trailingComma: 'es5',
      arrowParens: 'always',
      bracketSpacing: true,
    },
    eslintRules: {},
  },
  {
    id: 'airbnb',
    name: 'Airbnb',
    description: 'Airbnb JavaScript Style Guide 기반 설정입니다',
    prettierRules: {
      semi: true,
      singleQuote: true,
      tabWidth: 2,
      printWidth: 100,
      trailingComma: 'all',
      arrowParens: 'always',
      bracketSpacing: true,
    },
    eslintRules: {},
  },
  {
    id: 'standard',
    name: 'Standard',
    description: 'Standard JS (세미콜론 없음) 스타일입니다',
    prettierRules: {
      semi: false,
      singleQuote: true,
      tabWidth: 2,
      printWidth: 80,
      trailingComma: 'none',
      arrowParens: 'avoid',
      bracketSpacing: true,
    },
    eslintRules: {},
  },
];

export const defaultPreset = prettierPresets[0];

import { generatePrettierConfig, generateESLintConfig, generateConfigFile } from '@/lib/generators/config-generator';
import { ConfigRule } from '@/types/rule';

describe('Config Generator', () => {
  describe('generatePrettierConfig', () => {
    it('should generate Prettier config from rules', () => {
      const rules: ConfigRule[] = [
        {
          id: 'semi',
          name: '세미콜론 사용',
          description: '문장 끝에 세미콜론을 추가합니다',
          tool: 'prettier',
          prettierOption: {
            key: 'semi',
            type: 'boolean',
            defaultValue: true,
          },
          enabled: true,
          value: true,
        },
        {
          id: 'singleQuote',
          name: '작은따옴표 사용',
          description: '문자열에 작은따옴표를 사용합니다',
          tool: 'prettier',
          prettierOption: {
            key: 'singleQuote',
            type: 'boolean',
            defaultValue: false,
          },
          enabled: true,
          value: true,
        },
        {
          id: 'tabWidth',
          name: '탭 너비',
          description: '들여쓰기 공백 수를 지정합니다',
          tool: 'prettier',
          prettierOption: {
            key: 'tabWidth',
            type: 'number',
            defaultValue: 2,
          },
          enabled: false,
          value: 2,
        },
      ];

      const config = generatePrettierConfig(rules);

      expect(config).toEqual({
        semi: true,
        singleQuote: true,
      });
    });

    it('should return empty object if no rules are enabled', () => {
      const rules: ConfigRule[] = [
        {
          id: 'semi',
          name: '세미콜론 사용',
          description: '문장 끝에 세미콜론을 추가합니다',
          tool: 'prettier',
          prettierOption: {
            key: 'semi',
            type: 'boolean',
            defaultValue: true,
          },
          enabled: false,
          value: true,
        },
      ];

      const config = generatePrettierConfig(rules);

      expect(config).toEqual({});
    });
  });

  describe('generateESLintConfig', () => {
    it('should generate ESLint config from rules', () => {
      const rules: ConfigRule[] = [
        {
          id: 'no-console',
          name: 'console 사용 금지',
          description: 'console.log 등의 사용을 경고합니다',
          tool: 'eslint',
          eslintRule: {
            ruleId: 'no-console',
            severity: 'warn',
            options: [],
          },
          enabled: true,
          value: 'warn',
        },
        {
          id: 'semi',
          name: '세미콜론',
          description: '세미콜론 사용 규칙',
          tool: 'eslint',
          eslintRule: {
            ruleId: 'semi',
            severity: 'error',
            options: ['always'],
          },
          enabled: true,
          value: 'error',
        },
        {
          id: 'quotes',
          name: '따옴표',
          description: '따옴표 스타일',
          tool: 'eslint',
          eslintRule: {
            ruleId: 'quotes',
            severity: 'error',
            options: ['single'],
          },
          enabled: false,
          value: 'error',
        },
      ];

      const config = generateESLintConfig(rules);

      expect(config.rules).toEqual({
        'no-console': 'warn',
        'semi': ['error', 'always'],
      });
    });
  });

  describe('generateConfigFile', () => {
    it('should generate Prettier config file', () => {
      const rules: ConfigRule[] = [
        {
          id: 'semi',
          name: '세미콜론 사용',
          description: '문장 끝에 세미콜론을 추가합니다',
          tool: 'prettier',
          prettierOption: {
            key: 'semi',
            type: 'boolean',
            defaultValue: true,
          },
          enabled: true,
          value: true,
        },
      ];

      const configFile = generateConfigFile('prettier', rules);

      expect(configFile.filename).toBe('.prettierrc.json');
      expect(configFile.content).toHaveProperty('semi', true);
    });

    it('should generate ESLint config file', () => {
      const rules: ConfigRule[] = [
        {
          id: 'no-console',
          name: 'console 사용 금지',
          description: 'console.log 등의 사용을 경고합니다',
          tool: 'eslint',
          eslintRule: {
            ruleId: 'no-console',
            severity: 'warn',
            options: [],
          },
          enabled: true,
          value: 'warn',
        },
      ];

      const configFile = generateConfigFile('eslint', rules);

      expect(configFile.filename).toBe('.eslintrc.json');
      expect(configFile.content).toHaveProperty('rules');
      expect(configFile.content.rules).toHaveProperty('no-console', 'warn');
    });
  });
});

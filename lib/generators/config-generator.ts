import { ConfigRule } from '@/types/rule';
import { PrettierConfig, ESLintConfigContent, ConfigFile } from '@/types/config';

/**
 * 선택된 규칙으로 Prettier 설정 객체를 생성합니다.
 *
 * @param rules - 활성화된 Prettier 규칙 목록
 * @returns Prettier 설정 객체
 *
 * @validation
 * - 비활성화된 규칙은 무시
 * - 값이 없는 규칙은 defaultValue 사용
 */
export function generatePrettierConfig(rules: ConfigRule[]): PrettierConfig {
  const config: PrettierConfig = {};

  rules
    .filter((r) => r.enabled && r.tool === 'prettier' && r.prettierOption)
    .forEach((r) => {
      const { key, defaultValue } = r.prettierOption!;
      config[key] = r.value !== undefined ? r.value : defaultValue;
    });

  return config;
}

/**
 * 선택된 규칙으로 ESLint 설정 객체를 생성합니다.
 *
 * @param rules - 활성화된 ESLint 규칙 목록
 * @returns ESLint 설정 객체
 *
 * @validation
 * - 비활성화된 규칙은 무시
 * - 규칙 severity는 'off', 'warn', 'error' 중 하나
 */
export function generateESLintConfig(rules: ConfigRule[]): ESLintConfigContent {
  const config: ESLintConfigContent = {
    rules: {},
  };

  rules
    .filter((r) => r.enabled && r.tool === 'eslint' && r.eslintRule)
    .forEach((r) => {
      const { ruleId, severity, options } = r.eslintRule!;
      config.rules[ruleId] =
        options && options.length > 0 ? [severity, ...options] : severity;
    });

  return config;
}

/**
 * ConfigRule 배열로부터 ConfigFile 객체를 생성합니다.
 *
 * @param tool - 생성할 설정 파일 도구 ('prettier' | 'eslint')
 * @param rules - 규칙 목록
 * @returns ConfigFile 객체
 */
export function generateConfigFile(
  tool: 'prettier' | 'eslint',
  rules: ConfigRule[]
): ConfigFile {
  if (tool === 'prettier') {
    const content = generatePrettierConfig(rules);
    return {
      tool: 'prettier',
      filename: '.prettierrc',
      content,
      format: 'json',
    };
  } else {
    const content = generateESLintConfig(rules);
    return {
      tool: 'eslint',
      filename: '.eslintrc.json',
      content,
      format: 'json',
    };
  }
}

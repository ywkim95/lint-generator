import { ConfigRule } from '@/types/rule';
import { PrettierConfig, ESLintConfigContent, ConfigFile } from '@/types/config';

/**
 * 선택된 규칙으로 Prettier 설정 객체를 생성합니다.
 *
 * @param rules - Prettier 규칙 목록
 * @returns Prettier 설정 객체
 *
 * @validation
 * - 모든 규칙을 설정에 포함
 * - 활성화된 규칙: 설정된 값 또는 기본값 사용
 * - 비활성화된 boolean 규칙: 기본값의 반대 값 사용
 * - 비활성화된 non-boolean 규칙: 기본값 사용
 */
export function generatePrettierConfig(rules: ConfigRule[]): PrettierConfig {
  const config: PrettierConfig = {};

  rules
    .filter((r) => r.tool === 'prettier' && r.prettierOption)
    .forEach((r) => {
      const { key, defaultValue, type } = r.prettierOption!;

      if (r.enabled) {
        // 활성화된 규칙: 설정된 값 또는 기본값 사용
        config[key] = r.value !== undefined ? r.value : defaultValue;
      } else {
        // 비활성화된 규칙: boolean이면 반대 값, 아니면 기본값 사용
        if (type === 'boolean') {
          config[key] = !defaultValue;
        } else {
          config[key] = defaultValue;
        }
      }
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

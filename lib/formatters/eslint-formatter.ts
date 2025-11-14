import { ESLintConfigContent, LintMessage } from '@/types/config';

/**
 * ESLint를 사용하여 코드를 검사합니다.
 *
 * NOTE: 브라우저 환경에서 ESLint는 제한적으로 동작합니다.
 * 현재는 모의 린팅 메시지를 생성하는 방식으로 구현되어 있습니다.
 * 향후 ESLint 브라우저 번들 또는 Web Worker를 사용하여 개선할 수 있습니다.
 *
 * @param code - 검사할 코드
 * @param config - ESLint 설정 객체
 * @returns 린팅 메시지 목록 (경고 및 오류)
 *
 * @errors
 * - ESLintError - ESLint 파싱 실패 시
 *
 * @performance < 300ms for 100 lines of code
 */
export function lintWithESLint(
  code: string,
  config: ESLintConfigContent
): LintMessage[] {
  try {
    const messages: LintMessage[] = [];

    // 간단한 규칙 검사 구현 (데모용)
    // 실제 ESLint는 브라우저에서 제한적이므로 기본 패턴 매칭 사용

    const lines = code.split('\n');

    lines.forEach((line, idx) => {
      const lineNumber = idx + 1;

      // no-console 규칙 검사
      if (config.rules['no-console'] && config.rules['no-console'] !== 'off') {
        if (line.includes('console.')) {
          const column = line.indexOf('console.') + 1;
          const severity = config.rules['no-console'] === 'error' ||
                          (Array.isArray(config.rules['no-console']) && config.rules['no-console'][0] === 'error')
            ? 'error'
            : 'warning';

          messages.push({
            line: lineNumber,
            column,
            severity: severity as 'error' | 'warning',
            message: 'Unexpected console statement.',
            ruleId: 'no-console',
          });
        }
      }

      // semi 규칙 검사 (간단한 버전)
      if (config.rules['semi']) {
        const semiRule = config.rules['semi'];
        const requireSemi = Array.isArray(semiRule) ? semiRule[1] === 'always' : false;

        // 세미콜론이 필요한데 없는 경우 (간단한 검사)
        if (requireSemi) {
          const trimmedLine = line.trim();
          if (
            trimmedLine &&
            !trimmedLine.startsWith('//') &&
            !trimmedLine.startsWith('/*') &&
            !trimmedLine.startsWith('*') &&
            !trimmedLine.endsWith(';') &&
            !trimmedLine.endsWith('{') &&
            !trimmedLine.endsWith('}') &&
            trimmedLine.match(/^(const|let|var|return|import|export)/)
          ) {
            messages.push({
              line: lineNumber,
              column: line.length,
              severity: Array.isArray(semiRule) && semiRule[0] === 'error' ? 'error' : 'warning',
              message: 'Missing semicolon.',
              ruleId: 'semi',
            });
          }
        }
      }

      // quotes 규칙 검사
      if (config.rules['quotes']) {
        const quotesRule = config.rules['quotes'];
        const preferSingle = Array.isArray(quotesRule) && quotesRule[1] === 'single';

        if (preferSingle && line.includes('"')) {
          const column = line.indexOf('"') + 1;
          messages.push({
            line: lineNumber,
            column,
            severity: Array.isArray(quotesRule) && quotesRule[0] === 'error' ? 'error' : 'warning',
            message: 'Strings must use singlequote.',
            ruleId: 'quotes',
          });
        }
      }
    });

    return messages;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`ESLint linting failed: ${errorMessage}`);
  }
}

/**
 * Safe wrapper for lintWithESLint that returns a Result type
 */
export type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export function safeLintWithESLint(
  code: string,
  config: ESLintConfigContent
): Result<LintMessage[]> {
  try {
    const messages = lintWithESLint(code, config);
    return { success: true, data: messages };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

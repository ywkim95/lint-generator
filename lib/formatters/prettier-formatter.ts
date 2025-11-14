import prettier from 'prettier/standalone';
import typescriptParser from 'prettier/plugins/typescript';
import estreePlugin from 'prettier/plugins/estree';
import { PrettierConfig } from '@/types/config';

/**
 * Prettier를 사용하여 코드를 포맷팅합니다.
 *
 * @param code - 포맷팅할 원본 코드
 * @param config - Prettier 설정 객체
 * @returns 포맷팅된 코드
 * @throws PrettierError - Prettier 파싱 또는 포맷팅 실패 시
 *
 * @performance < 500ms for 100 lines of code
 */
export async function formatWithPrettier(
  code: string,
  config: PrettierConfig
): Promise<string> {
  try {
    const formatted = await prettier.format(code, {
      parser: 'typescript',
      plugins: [typescriptParser, estreePlugin],
      ...config,
    });

    return formatted;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Prettier formatting failed: ${errorMessage}`);
  }
}

/**
 * Safe wrapper for formatWithPrettier that returns a Result type
 */
export type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function safeFormatWithPrettier(
  code: string,
  config: PrettierConfig
): Promise<Result<string>> {
  try {
    const formatted = await formatWithPrettier(code, config);
    return { success: true, data: formatted };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

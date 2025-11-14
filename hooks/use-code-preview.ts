'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { ConfigRule } from '@/types/rule';
import { ExampleCode } from '@/types/config';
import { formatWithPrettier } from '@/lib/formatters/prettier-formatter';
import { generatePrettierConfig } from '@/lib/generators/config-generator';
import sampleCode from '@/public/examples/sample-code';

/**
 * 코드 미리보기를 관리하고 자동 업데이트하는 Hook
 *
 * @param tool - 현재 선택된 도구
 * @param rules - 현재 활성화된 규칙 목록
 * @returns 포맷팅된 예제 코드, 포맷팅 상태, 에러 메시지
 *
 * @sideEffects
 * - `tool` 또는 `rules` 변경 시 자동으로 코드 재포맷
 * - Debounce 300ms 적용
 */
export function useCodePreview(
  tool: 'prettier' | 'eslint',
  rules: ConfigRule[]
) {
  const [exampleCode, setExampleCode] = useState<ExampleCode | null>(null);
  const [isFormatting, setIsFormatting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Debounced update function
  const updatePreview = useCallback(
    async (currentTool: 'prettier' | 'eslint', currentRules: ConfigRule[]) => {
      setIsFormatting(true);
      setError(null);

      try {
        if (currentTool === 'prettier') {
          const config = generatePrettierConfig(currentRules);
          const formatted = await formatWithPrettier(sampleCode, config);

          setExampleCode({
            original: sampleCode,
            formatted,
            tool: 'prettier',
            language: 'typescript',
          });
        } else {
          // ESLint 미리보기는 향후 구현 (User Story 2)
          setExampleCode({
            original: sampleCode,
            formatted: sampleCode,
            tool: 'eslint',
            language: 'typescript',
            lintMessages: [],
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setExampleCode(null);
      } finally {
        setIsFormatting(false);
      }
    },
    []
  );

  // Debounce logic
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updatePreview(tool, rules);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [tool, rules, updatePreview]);

  return { exampleCode, isFormatting, error };
}

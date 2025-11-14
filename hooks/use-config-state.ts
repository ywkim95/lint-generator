'use client';

import { useReducer, useCallback } from 'react';
import { ConfigRule } from '@/types/rule';
import { ConfigPreset } from '@/types/preset';
import { ExampleCode } from '@/types/config';
import { prettierPresets } from '@/lib/presets/prettier-presets';
import { eslintPresets } from '@/lib/presets/eslint-presets';
import { generateConfigFile } from '@/lib/generators/config-generator';
import { downloadConfigFile } from '@/lib/utils/file-download';

// ===== State Types =====

export interface AppState {
  currentTool: 'prettier' | 'eslint';
  currentPreset: ConfigPreset['id'];
  prettierRules: ConfigRule[];
  eslintRules: ConfigRule[];
  exampleCode: ExampleCode | null;
  isFormatting: boolean;
  error: string | null;
}

export interface AppActions {
  setCurrentTool: (tool: 'prettier' | 'eslint') => void;
  setCurrentPreset: (preset: ConfigPreset['id']) => void;
  toggleRule: (ruleId: string) => void;
  updateRuleValue: (ruleId: string, value: string | number | boolean) => void;
  resetToPreset: () => void;
  downloadConfig: () => void;
  setExampleCode: (code: ExampleCode | null) => void;
  setIsFormatting: (isFormatting: boolean) => void;
  setError: (error: string | null) => void;
}

// ===== Action Types =====

type Action =
  | { type: 'SET_TOOL'; payload: 'prettier' | 'eslint' }
  | { type: 'SET_PRESET'; payload: ConfigPreset['id'] }
  | { type: 'TOGGLE_RULE'; payload: string }
  | { type: 'UPDATE_RULE'; payload: { ruleId: string; value: string | number | boolean } }
  | { type: 'RESET_PRESET' }
  | { type: 'SET_EXAMPLE_CODE'; payload: ExampleCode | null }
  | { type: 'SET_IS_FORMATTING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// ===== Initial State =====

// Prettier의 "공식 기본값" 프리셋을 기본으로 사용
const officialPrettierPreset = prettierPresets.find((p) => p.id === 'official')!;
const officialESLintPreset = eslintPresets.find((p) => p.id === 'official')!;

// Prettier 초기 규칙 생성
const initialPrettierRules: ConfigRule[] = Object.entries(
  officialPrettierPreset.prettierRules
).map(([key, value]) => ({
  id: key,
  name: getRuleName(key),
  description: getRuleDescription(key),
  tool: 'prettier',
  prettierOption: {
    key,
    type: typeof value as 'boolean' | 'number' | 'string',
    defaultValue: value,
  },
  enabled: true,
  value,
}));

// ESLint 초기 규칙 생성
const initialESLintRules: ConfigRule[] = Object.entries(
  officialESLintPreset.eslintRules
).map(([ruleId, ruleValue]) => {
  const isArray = Array.isArray(ruleValue);
  const severity = isArray ? (ruleValue[0] as 'off' | 'warn' | 'error') : ruleValue;
  const options = isArray ? ruleValue.slice(1) : [];

  return {
    id: ruleId,
    name: getRuleName(ruleId),
    description: getRuleDescription(ruleId),
    tool: 'eslint',
    eslintRule: {
      ruleId,
      severity,
      options,
    },
    enabled: severity !== 'off',
    value: severity,
  };
});

const initialState: AppState = {
  currentTool: 'prettier',
  currentPreset: 'official',
  prettierRules: initialPrettierRules,
  eslintRules: initialESLintRules,
  exampleCode: null,
  isFormatting: false,
  error: null,
};

// ===== Reducer =====

function configReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_TOOL':
      return { ...state, currentTool: action.payload };

    case 'SET_PRESET': {
      const preset =
        state.currentTool === 'prettier'
          ? prettierPresets.find((p) => p.id === action.payload)
          : eslintPresets.find((p) => p.id === action.payload);

      if (!preset) return state;

      if (state.currentTool === 'prettier') {
        const updatedRules = state.prettierRules.map((rule) => {
          const presetValue = preset.prettierRules[rule.id];
          return presetValue !== undefined
            ? { ...rule, enabled: true, value: presetValue }
            : { ...rule, enabled: false };
        });

        return {
          ...state,
          currentPreset: action.payload,
          prettierRules: updatedRules,
        };
      } else {
        const updatedRules = state.eslintRules.map((rule) => {
          const presetValue = preset.eslintRules[rule.id];
          if (presetValue !== undefined) {
            const isArray = Array.isArray(presetValue);
            const severity = isArray ? (presetValue[0] as 'off' | 'warn' | 'error') : presetValue;
            return {
              ...rule,
              enabled: severity !== 'off',
              value: severity,
              eslintRule: rule.eslintRule
                ? {
                    ...rule.eslintRule,
                    severity,
                    options: isArray ? presetValue.slice(1) : [],
                  }
                : rule.eslintRule,
            };
          }
          return { ...rule, enabled: false };
        });

        return {
          ...state,
          currentPreset: action.payload,
          eslintRules: updatedRules,
        };
      }
    }

    case 'TOGGLE_RULE': {
      const ruleId = action.payload;

      if (state.currentTool === 'prettier') {
        const updatedRules = state.prettierRules.map((rule) =>
          rule.id === ruleId
            ? {
                ...rule,
                enabled: !rule.enabled,
                value: !rule.enabled ? rule.prettierOption?.defaultValue : undefined,
              }
            : rule
        );
        return { ...state, prettierRules: updatedRules };
      } else {
        const updatedRules = state.eslintRules.map((rule) =>
          rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
        );
        return { ...state, eslintRules: updatedRules };
      }
    }

    case 'UPDATE_RULE': {
      const { ruleId, value } = action.payload;

      if (state.currentTool === 'prettier') {
        const updatedRules = state.prettierRules.map((rule) =>
          rule.id === ruleId ? { ...rule, value } : rule
        );
        return { ...state, prettierRules: updatedRules };
      } else {
        const updatedRules = state.eslintRules.map((rule) =>
          rule.id === ruleId ? { ...rule, value } : rule
        );
        return { ...state, eslintRules: updatedRules };
      }
    }

    case 'RESET_PRESET': {
      // 현재 프리셋을 다시 적용
      return configReducer(state, { type: 'SET_PRESET', payload: state.currentPreset });
    }

    case 'SET_EXAMPLE_CODE':
      return { ...state, exampleCode: action.payload };

    case 'SET_IS_FORMATTING':
      return { ...state, isFormatting: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    default:
      return state;
  }
}

// ===== Hook =====

export function useConfigState() {
  const [state, dispatch] = useReducer(configReducer, initialState);

  const actions: AppActions = {
    setCurrentTool: useCallback((tool: 'prettier' | 'eslint') => {
      dispatch({ type: 'SET_TOOL', payload: tool });
    }, []),

    setCurrentPreset: useCallback((preset: ConfigPreset['id']) => {
      dispatch({ type: 'SET_PRESET', payload: preset });
    }, []),

    toggleRule: useCallback((ruleId: string) => {
      dispatch({ type: 'TOGGLE_RULE', payload: ruleId });
    }, []),

    updateRuleValue: useCallback((ruleId: string, value: any) => {
      dispatch({ type: 'UPDATE_RULE', payload: { ruleId, value } });
    }, []),

    resetToPreset: useCallback(() => {
      dispatch({ type: 'RESET_PRESET' });
    }, []),

    downloadConfig: useCallback(() => {
      const rules =
        state.currentTool === 'prettier' ? state.prettierRules : state.eslintRules;
      const configFile = generateConfigFile(state.currentTool, rules);
      downloadConfigFile(configFile);
    }, [state.currentTool, state.prettierRules, state.eslintRules]),

    setExampleCode: useCallback((code: ExampleCode | null) => {
      dispatch({ type: 'SET_EXAMPLE_CODE', payload: code });
    }, []),

    setIsFormatting: useCallback((isFormatting: boolean) => {
      dispatch({ type: 'SET_IS_FORMATTING', payload: isFormatting });
    }, []),

    setError: useCallback((error: string | null) => {
      dispatch({ type: 'SET_ERROR', payload: error });
    }, []),
  };

  return { state, actions };
}

// ===== Helper Functions =====

function getRuleName(key: string): string {
  const names: Record<string, string> = {
    // Prettier 규칙
    printWidth: '줄 길이',
    tabWidth: '탭 너비',
    useTabs: '탭 사용',
    semi: '세미콜론 사용',
    singleQuote: '작은따옴표 사용',
    quoteProps: '객체 속성 따옴표',
    jsxSingleQuote: 'JSX 작은따옴표',
    trailingComma: '후행 쉼표',
    bracketSpacing: '중괄호 공백',
    bracketSameLine: '닫는 괄호 같은 줄',
    arrowParens: '화살표 함수 괄호',
    proseWrap: '산문 줄 바꿈',
    htmlWhitespaceSensitivity: 'HTML 공백 민감도',
    vueIndentScriptAndStyle: 'Vue 스크립트/스타일 들여쓰기',
    endOfLine: '줄 끝 문자',
    embeddedLanguageFormatting: '내장 언어 포맷팅',
    singleAttributePerLine: '속성 한 줄에 하나',
    // ESLint 규칙
    'no-console': 'console 사용 금지',
    quotes: '따옴표 스타일',
    'comma-dangle': '후행 쉼표',
  };

  return names[key] || key;
}

function getRuleDescription(key: string): string {
  const descriptions: Record<string, string> = {
    // Prettier 규칙
    printWidth: '한 줄의 최대 길이를 지정합니다 (기본값: 80)',
    tabWidth: '들여쓰기 공백 수를 지정합니다 (기본값: 2)',
    useTabs: '공백 대신 탭을 사용합니다',
    semi: '문장 끝에 세미콜론을 추가합니다',
    singleQuote: '큰따옴표 대신 작은따옴표를 사용합니다',
    quoteProps: '객체 속성에 따옴표 사용 여부를 지정합니다 (as-needed, consistent, preserve)',
    jsxSingleQuote: 'JSX에서 큰따옴표 대신 작은따옴표를 사용합니다',
    trailingComma: '객체/배열의 마지막 항목 뒤에 쉼표를 추가합니다 (es5, none, all)',
    bracketSpacing: '객체 리터럴의 중괄호 안에 공백을 추가합니다',
    bracketSameLine: '여러 줄 HTML/JSX 요소의 닫는 > 를 마지막 줄에 배치합니다',
    arrowParens: '화살표 함수의 매개변수에 괄호를 추가합니다 (always, avoid)',
    proseWrap: '마크다운 텍스트를 줄 바꿈합니다 (always, never, preserve)',
    htmlWhitespaceSensitivity: 'HTML 공백 처리 방식을 지정합니다 (css, strict, ignore)',
    vueIndentScriptAndStyle: 'Vue 파일의 <script>와 <style> 태그 내용을 들여씁니다',
    endOfLine: '줄 끝 문자를 지정합니다 (lf, crlf, cr, auto)',
    embeddedLanguageFormatting: '내장된 코드를 포맷팅합니다 (auto, off)',
    singleAttributePerLine: 'HTML/JSX 속성을 한 줄에 하나씩 배치합니다',
    // ESLint 규칙
    'no-console': 'console.log 등의 사용을 경고합니다',
    quotes: '문자열 따옴표 스타일을 지정합니다',
    'comma-dangle': '후행 쉼표 사용 규칙을 지정합니다',
  };

  return descriptions[key] || '';
}

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
  updateRuleValue: (ruleId: string, value: any) => void;
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
  | { type: 'UPDATE_RULE'; payload: { ruleId: string; value: any } }
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
    semi: '세미콜론 사용',
    singleQuote: '작은따옴표 사용',
    tabWidth: '탭 너비',
    printWidth: '줄 길이',
    trailingComma: '후행 쉼표',
    'no-console': 'console 사용 금지',
    quotes: '따옴표 스타일',
    'comma-dangle': '후행 쉼표',
  };

  return names[key] || key;
}

function getRuleDescription(key: string): string {
  const descriptions: Record<string, string> = {
    semi: '문장 끝에 세미콜론을 추가합니다',
    singleQuote: '문자열에 작은따옴표를 사용합니다',
    tabWidth: '들여쓰기 공백 수를 지정합니다',
    printWidth: '한 줄의 최대 길이를 지정합니다',
    trailingComma: '객체/배열의 마지막 항목 뒤에 쉼표를 추가합니다',
    'no-console': 'console.log 등의 사용을 경고합니다',
    quotes: '문자열 따옴표 스타일을 지정합니다',
    'comma-dangle': '후행 쉼표 사용 규칙을 지정합니다',
  };

  return descriptions[key] || '';
}

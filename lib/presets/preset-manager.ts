import { ConfigPreset } from '@/types/preset';
import { ConfigRule } from '@/types/rule';
import { prettierPresets } from './prettier-presets';
import { eslintPresets } from './eslint-presets';

/**
 * 프리셋을 규칙 배열로 변환합니다.
 *
 * @param preset - 적용할 프리셋
 * @param tool - 도구 타입 ('prettier' | 'eslint')
 * @param availableRules - 사용 가능한 모든 규칙 목록
 * @returns 프리셋에 맞게 활성화된 규칙 배열
 *
 * @logic
 * - 프리셋의 rules 객체를 availableRules와 매칭
 * - 프리셋에 정의된 규칙만 enabled: true로 설정
 * - value는 프리셋에서 가져옴
 */
export function applyPreset(
  preset: ConfigPreset,
  tool: 'prettier' | 'eslint',
  availableRules: ConfigRule[]
): ConfigRule[] {
  const presetRules = tool === 'prettier' ? preset.prettierRules : preset.eslintRules;

  return availableRules.map((rule) => {
    const presetValue = presetRules[rule.id];

    if (presetValue !== undefined) {
      return {
        ...rule,
        enabled: true,
        value: presetValue,
      };
    }

    return {
      ...rule,
      enabled: false,
      value: rule.value, // 기본값 유지
    };
  });
}

/**
 * 도구에 맞는 프리셋 목록을 가져옵니다.
 *
 * @param tool - 도구 타입 ('prettier' | 'eslint')
 * @returns 해당 도구의 프리셋 배열
 */
export function getPresetsForTool(tool: 'prettier' | 'eslint'): ConfigPreset[] {
  return tool === 'prettier' ? prettierPresets : eslintPresets;
}

/**
 * ID로 프리셋을 찾습니다.
 *
 * @param presetId - 프리셋 ID
 * @param tool - 도구 타입 ('prettier' | 'eslint')
 * @returns 찾은 프리셋, 없으면 기본 프리셋
 */
export function getPresetById(
  presetId: ConfigPreset['id'],
  tool: 'prettier' | 'eslint'
): ConfigPreset {
  const presets = getPresetsForTool(tool);
  return presets.find((p) => p.id === presetId) || presets[0];
}

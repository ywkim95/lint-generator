'use client';

import { useMemo } from 'react';
import { ConfigPreset } from '@/types/preset';
import { getPresetsForTool, getPresetById } from '@/lib/presets/preset-manager';

/**
 * 프리셋 선택 및 관리를 위한 Hook
 *
 * @param currentTool - 현재 선택된 도구 ('prettier' | 'eslint')
 * @param currentPresetId - 현재 선택된 프리셋 ID
 * @returns 프리셋 목록과 현재 프리셋
 */
export function usePreset(
  currentTool: 'prettier' | 'eslint',
  currentPresetId: ConfigPreset['id']
) {
  // 현재 도구에 맞는 프리셋 목록
  const presets = useMemo(() => getPresetsForTool(currentTool), [currentTool]);

  // 현재 선택된 프리셋
  const currentPreset = useMemo(
    () => getPresetById(currentPresetId, currentTool),
    [currentPresetId, currentTool]
  );

  return {
    presets,
    currentPreset,
  };
}

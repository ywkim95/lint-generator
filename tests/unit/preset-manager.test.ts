import { applyPreset, getPresetsForTool, getPresetById } from '@/lib/presets/preset-manager';
import { prettierPresets } from '@/lib/presets/prettier-presets';
import { eslintPresets } from '@/lib/presets/eslint-presets';
import { ConfigRule } from '@/types/rule';

describe('Preset Manager', () => {
  describe('applyPreset', () => {
    it('should apply Prettier preset to rules', () => {
      const availableRules: ConfigRule[] = [
        {
          id: 'semi',
          name: '세미콜론',
          description: '세미콜론 사용',
          tool: 'prettier',
          prettierOption: {
            key: 'semi',
            type: 'boolean',
            defaultValue: true,
          },
          enabled: false,
          value: false,
        },
        {
          id: 'singleQuote',
          name: '작은따옴표',
          description: '작은따옴표 사용',
          tool: 'prettier',
          prettierOption: {
            key: 'singleQuote',
            type: 'boolean',
            defaultValue: false,
          },
          enabled: false,
          value: false,
        },
      ];

      const airbnbPreset = prettierPresets.find((p) => p.id === 'airbnb')!;
      const result = applyPreset(airbnbPreset, 'prettier', availableRules);

      const semiRule = result.find((r) => r.id === 'semi');
      expect(semiRule?.enabled).toBe(true);
      expect(semiRule?.value).toBe(true);

      const singleQuoteRule = result.find((r) => r.id === 'singleQuote');
      expect(singleQuoteRule?.enabled).toBe(true);
      expect(singleQuoteRule?.value).toBe(true);
    });

    it('should disable rules not in preset', () => {
      const availableRules: ConfigRule[] = [
        {
          id: 'semi',
          name: '세미콜론',
          description: '세미콜론 사용',
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
          id: 'unknownRule',
          name: '알 수 없는 규칙',
          description: '알 수 없는 규칙',
          tool: 'prettier',
          enabled: true,
          value: 'some-value',
        },
      ];

      const officialPreset = prettierPresets.find((p) => p.id === 'official')!;
      const result = applyPreset(officialPreset, 'prettier', availableRules);

      const unknownRule = result.find((r) => r.id === 'unknownRule');
      expect(unknownRule?.enabled).toBe(false);
    });
  });

  describe('getPresetsForTool', () => {
    it('should return Prettier presets for prettier tool', () => {
      const presets = getPresetsForTool('prettier');
      expect(presets).toEqual(prettierPresets);
    });

    it('should return ESLint presets for eslint tool', () => {
      const presets = getPresetsForTool('eslint');
      expect(presets).toEqual(eslintPresets);
    });
  });

  describe('getPresetById', () => {
    it('should return preset by id', () => {
      const preset = getPresetById('airbnb', 'prettier');
      expect(preset.id).toBe('airbnb');
      expect(preset.name).toBe('Airbnb');
    });

    it('should return default preset if id not found', () => {
      const preset = getPresetById('non-existent' as any, 'prettier');
      expect(preset.id).toBe('official');
    });
  });
});

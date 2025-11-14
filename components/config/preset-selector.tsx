'use client';

import { ConfigPreset } from '@/types/preset';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface PresetSelectorProps {
  presets: ConfigPreset[];
  currentPresetId: ConfigPreset['id'];
  onPresetChange: (presetId: ConfigPreset['id']) => void;
  tool: 'prettier' | 'eslint';
}

export default function PresetSelector({
  presets,
  currentPresetId,
  onPresetChange,
  tool,
}: PresetSelectorProps) {
  const handleChange = (value: string) => {
    onPresetChange(value as ConfigPreset['id']);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="preset-selector">
        프리셋 선택 ({tool === 'prettier' ? 'Prettier' : 'ESLint'})
      </Label>
      <Select value={currentPresetId} onValueChange={handleChange}>
        <SelectTrigger id="preset-selector" className="w-full">
          <SelectValue placeholder="프리셋을 선택하세요" />
        </SelectTrigger>
        <SelectContent>
          {presets.map((preset) => (
            <SelectItem key={preset.id} value={preset.id}>
              <div className="flex flex-col">
                <span className="font-medium">{preset.name}</span>
                <span className="text-xs text-muted-foreground">
                  {preset.description}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

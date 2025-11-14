'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ConfigRule } from '@/types/rule';
import { ConfigPreset } from '@/types/preset';
import PresetSelector from './preset-selector';
import { usePreset } from '@/hooks/use-preset';

interface RuleChecklistProps {
  tool: 'prettier' | 'eslint';
  rules: ConfigRule[];
  currentPresetId: ConfigPreset['id'];
  onToggleRule: (ruleId: string) => void;
  onUpdateRuleValue: (ruleId: string, value: string | number | boolean) => void;
  onPresetChange: (presetId: ConfigPreset['id']) => void;
}

export default function RuleChecklist({
  tool,
  rules,
  currentPresetId,
  onToggleRule,
  onUpdateRuleValue,
  onPresetChange
}: RuleChecklistProps) {
  const toolName = tool === 'prettier' ? 'Prettier' : 'ESLint';
  const { presets } = usePreset(tool, currentPresetId);

  const getInputForRule = (rule: ConfigRule) => {
    if (!rule.prettierOption || !rule.enabled) return null;

    const { type, defaultValue } = rule.prettierOption;
    const currentValue = rule.value !== undefined ? rule.value : defaultValue;

    if (type === 'number') {
      return (
        <Input
          type="number"
          value={currentValue}
          onChange={(e) => onUpdateRuleValue(rule.id, parseInt(e.target.value))}
          className="w-24 h-8 mt-2"
          min={rule.id === 'tabWidth' ? 1 : rule.id === 'printWidth' ? 40 : 0}
          max={rule.id === 'printWidth' ? 200 : undefined}
        />
      );
    }

    if (type === 'string') {
      // Select 옵션 정의
      const selectOptions: Record<string, string[]> = {
        trailingComma: ['es5', 'none', 'all'],
        arrowParens: ['always', 'avoid'],
        quoteProps: ['as-needed', 'consistent', 'preserve'],
        proseWrap: ['always', 'never', 'preserve'],
        htmlWhitespaceSensitivity: ['css', 'strict', 'ignore'],
        endOfLine: ['lf', 'crlf', 'cr', 'auto'],
        embeddedLanguageFormatting: ['auto', 'off'],
      };

      const options = selectOptions[rule.id];
      if (options) {
        return (
          <Select
            value={String(currentValue)}
            onValueChange={(value) => onUpdateRuleValue(rule.id, value)}
          >
            <SelectTrigger className="w-48 h-8 mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }
    }

    return null;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{toolName} 규칙</CardTitle>
        <CardDescription>
          {toolName} 설정 규칙을 선택하세요
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <PresetSelector
          presets={presets}
          currentPresetId={currentPresetId}
          onPresetChange={onPresetChange}
          tool={tool}
        />
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-4">
            {rules.map((rule) => (
              <div key={rule.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox
                  id={rule.id}
                  checked={rule.enabled}
                  onCheckedChange={() => onToggleRule(rule.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label
                    htmlFor={rule.id}
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    {rule.name}
                  </Label>
                  {rule.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {rule.description}
                    </p>
                  )}
                  {rule.prettierOption && (
                    <p className="text-xs text-muted-foreground mt-1">
                      기본값: {String(rule.prettierOption.defaultValue)}
                    </p>
                  )}
                  {getInputForRule(rule)}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

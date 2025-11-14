'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ConfigRule } from '@/types/rule';
import { ConfigPreset } from '@/types/preset';
import PresetSelector from './preset-selector';
import { usePreset } from '@/hooks/use-preset';
import { HelpCircle } from 'lucide-react';

interface RuleChecklistProps {
  tool: 'prettier' | 'eslint';
  rules: ConfigRule[];
  currentPresetId: ConfigPreset['id'];
  onToggleRule: (ruleId: string) => void;
  onUpdateRuleValue: (ruleId: string, value: string | number | boolean) => void;
  onPresetChange: (presetId: ConfigPreset['id']) => void;
}

// 각 옵션에 대한 설명
const optionDescriptions: Record<string, Record<string, string>> = {
  // Prettier 옵션
  trailingComma: {
    es5: 'ES5에서 유효한 곳에만 후행 쉼표 추가 (객체, 배열)',
    none: '후행 쉼표 없음',
    all: '가능한 모든 곳에 후행 쉼표 추가 (함수 매개변수 포함)',
  },
  arrowParens: {
    always: '항상 괄호 사용 - (x) => x',
    avoid: '가능하면 괄호 생략 - x => x',
  },
  quoteProps: {
    'as-needed': '필요한 경우에만 따옴표 사용',
    consistent: '하나라도 필요하면 모든 속성에 따옴표 사용',
    preserve: '입력 그대로 유지',
  },
  proseWrap: {
    always: 'printWidth를 초과하면 줄바꿈',
    never: '줄바꿈 하지 않음',
    preserve: '원본 그대로 유지',
  },
  htmlWhitespaceSensitivity: {
    css: 'CSS display 속성에 따라 처리 (권장)',
    strict: '모든 공백을 의미있게 처리',
    ignore: '모든 공백을 하나의 공백으로 처리',
  },
  endOfLine: {
    lf: 'Line Feed (\\n) - Unix/Mac/Linux',
    crlf: 'Carriage Return + Line Feed (\\r\\n) - Windows',
    cr: 'Carriage Return (\\r) - 구형 Mac',
    auto: '기존 파일의 줄 끝 문자 유지',
  },
  embeddedLanguageFormatting: {
    auto: '내장된 코드를 자동으로 포맷팅 (권장)',
    off: '내장된 코드 포맷팅 하지 않음',
  },
  // ESLint 옵션
  quotes: {
    single: '작은따옴표 사용 - \'hello\'',
    double: '큰따옴표 사용 - "hello"',
    backtick: '백틱 사용 - `hello`',
  },
  semi: {
    always: '항상 세미콜론 사용',
    never: '세미콜론 사용 안 함',
  },
  'comma-dangle': {
    never: '후행 쉼표 사용 안 함',
    always: '항상 후행 쉼표 사용',
    'always-multiline': '여러 줄일 때만 후행 쉼표 사용',
    'only-multiline': '여러 줄일 때만 후행 쉼표 허용',
  },
  'brace-style': {
    '1tbs': 'One True Brace Style - 여는 중괄호를 같은 줄에',
    'stroustrup': 'Stroustrup Style - else를 다음 줄에',
    'allman': 'Allman Style - 여는 중괄호를 다음 줄에',
  },
  'arrow-parens': {
    always: '항상 괄호 사용 - (x) => x',
    'as-needed': '필요한 경우에만 괄호 사용 - x => x',
  },
  severity: {
    off: '규칙 비활성화',
    warn: '경고 표시',
    error: '오류로 처리',
  },
};

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
    if (!rule.enabled) return null;

    // Prettier 규칙 처리
    if (rule.prettierOption) {
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
        const descriptions = optionDescriptions[rule.id];

        if (options && descriptions) {
          return (
            <div className="flex items-center gap-2 mt-2">
              <Select
                value={String(currentValue)}
                onValueChange={(value) => onUpdateRuleValue(rule.id, value)}
              >
                <SelectTrigger className="w-48 h-8">
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
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <div className="space-y-2">
                      {options.map((option) => (
                        <div key={option}>
                          <span className="font-semibold">{option}:</span> {descriptions[option]}
                        </div>
                      ))}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          );
        }
      }
    }

    // ESLint 규칙 처리
    if (rule.eslintRule) {
      const { severity, options: eslintOptions } = rule.eslintRule;

      // indent 규칙은 숫자 입력
      if (rule.id === 'indent' && eslintOptions && eslintOptions.length > 0) {
        return (
          <Input
            type="number"
            value={eslintOptions[0] as number}
            onChange={(e) => onUpdateRuleValue(rule.id, parseInt(e.target.value))}
            className="w-24 h-8 mt-2"
            min={2}
            max={8}
          />
        );
      }

      // 옵션이 있는 규칙 (quotes, semi, comma-dangle, brace-style, arrow-parens)
      const ruleSelectOptions: Record<string, string[]> = {
        'quotes': ['single', 'double', 'backtick'],
        'semi': ['always', 'never'],
        'comma-dangle': ['never', 'always', 'always-multiline', 'only-multiline'],
        'brace-style': ['1tbs', 'stroustrup', 'allman'],
        'arrow-parens': ['always', 'as-needed'],
      };

      const options = ruleSelectOptions[rule.id];
      const descriptions = optionDescriptions[rule.id];

      if (options && descriptions) {
        const currentValue = eslintOptions && eslintOptions.length > 0 ? eslintOptions[0] : '';
        return (
          <div className="flex items-center gap-2 mt-2">
            <Select
              value={String(currentValue)}
              onValueChange={(value) => onUpdateRuleValue(rule.id, value)}
            >
              <SelectTrigger className="w-48 h-8">
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
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  <div className="space-y-2">
                    {options.map((option) => (
                      <div key={option}>
                        <span className="font-semibold">{option}:</span> {descriptions[option]}
                      </div>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      }

      // severity만 선택 가능한 규칙
      const severityOptions = ['off', 'warn', 'error'];
      const severityDescriptions = optionDescriptions['severity'];
      return (
        <div className="flex items-center gap-2 mt-2">
          <Select
            value={severity}
            onValueChange={(value) => onUpdateRuleValue(rule.id, value)}
          >
            <SelectTrigger className="w-32 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {severityOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-xs">
                <div className="space-y-2">
                  {severityOptions.map((option) => (
                    <div key={option}>
                      <span className="font-semibold">{option}:</span> {severityDescriptions[option]}
                    </div>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
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

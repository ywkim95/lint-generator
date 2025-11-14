'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ConfigRule } from '@/types/rule';

interface RuleChecklistProps {
  tool: 'prettier' | 'eslint';
  rules: ConfigRule[];
  onToggleRule: (ruleId: string) => void;
}

export default function RuleChecklist({ tool, rules, onToggleRule }: RuleChecklistProps) {
  const toolName = tool === 'prettier' ? 'Prettier' : 'ESLint';

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{toolName} 규칙</CardTitle>
        <CardDescription>
          {toolName} 설정 규칙을 선택하세요
        </CardDescription>
      </CardHeader>
      <CardContent>
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
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

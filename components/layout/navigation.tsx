'use client';

import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface NavigationProps {
  currentTool: 'prettier' | 'eslint';
  onToolChange: (tool: 'prettier' | 'eslint') => void;
  onReset: () => void;
  onDownload: () => void;
}

export default function Navigation({
  currentTool,
  onToolChange,
  onReset,
  onDownload,
}: NavigationProps) {
  return (
    <nav className="border-b p-4 bg-background">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <h1 className="text-xl font-bold">Lint Config Generator</h1>

          <RadioGroup
            value={currentTool}
            onValueChange={(value) => onToolChange(value as 'prettier' | 'eslint')}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="prettier" id="prettier" />
              <Label htmlFor="prettier" className="cursor-pointer">
                Prettier
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="eslint" id="eslint" />
              <Label htmlFor="eslint" className="cursor-pointer">
                ESLint
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" onClick={onReset}>
            초기화
          </Button>
          <Button onClick={onDownload}>다운로드</Button>
        </div>
      </div>
    </nav>
  );
}

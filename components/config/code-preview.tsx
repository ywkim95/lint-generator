'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import CodeDisplay from '@/components/shared/code-display';
import { ExampleCode } from '@/types/config';

interface CodePreviewProps {
  exampleCode: ExampleCode | null;
  isFormatting: boolean;
  error: string | null;
}

export default function CodePreview({ exampleCode, isFormatting, error }: CodePreviewProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>코드 미리보기</CardTitle>
        <CardDescription>
          선택한 규칙이 적용된 코드를 확인하세요
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isFormatting ? (
          <div className="flex items-center justify-center h-[600px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-sm text-muted-foreground">코드 포맷팅 중...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[600px]">
            <div className="text-center text-destructive">
              <p className="font-semibold mb-2">오류 발생</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        ) : exampleCode ? (
          <CodeDisplay
            code={exampleCode.formatted}
            language={exampleCode.language}
          />
        ) : (
          <div className="flex items-center justify-center h-[600px]">
            <p className="text-sm text-muted-foreground">
              규칙을 선택하면 미리보기가 표시됩니다
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

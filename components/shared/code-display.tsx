'use client';

import { Card } from '@/components/ui/card';

interface CodeDisplayProps {
  code: string;
  title?: string;
  language?: 'typescript' | 'javascript';
}

export default function CodeDisplay({ code, title, language = 'typescript' }: CodeDisplayProps) {
  return (
    <Card className="h-full">
      {title && (
        <div className="border-b p-4">
          <h3 className="font-semibold">{title}</h3>
        </div>
      )}
      <div className="h-[600px] overflow-auto">
        <pre className="p-4 text-sm font-mono bg-muted/30 whitespace-pre">
          <code className={`language-${language}`}>{code}</code>
        </pre>
      </div>
    </Card>
  );
}

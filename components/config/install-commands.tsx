'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Check, Copy } from 'lucide-react';
import { InstallationCommand } from '@/lib/generators/command-generator';
import { copyToClipboard } from '@/lib/utils/clipboard';

interface InstallCommandsProps {
  commands: InstallationCommand[];
}

export default function InstallCommands({ commands }: InstallCommandsProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (command: string, index: number) => {
    const success = await copyToClipboard(command);
    if (success) {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  if (commands.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>패키지 설치 명령어</CardTitle>
        <CardDescription>
          선호하는 패키지 매니저를 선택하고 명령어를 복사하세요
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="npm" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="npm">npm</TabsTrigger>
            <TabsTrigger value="yarn">yarn</TabsTrigger>
            <TabsTrigger value="pnpm">pnpm</TabsTrigger>
            <TabsTrigger value="bun">bun</TabsTrigger>
          </TabsList>

          {commands.map((cmd, index) => (
            <TabsContent key={cmd.packageManager} value={cmd.packageManager}>
              <div className="space-y-4">
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                    <code className="text-sm">{cmd.command}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2"
                    onClick={() => handleCopy(cmd.command, index)}
                  >
                    {copiedIndex === index ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        복사됨
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        복사
                      </>
                    )}
                  </Button>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p className="font-semibold mb-2">설치될 패키지:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {cmd.packages.map((pkg) => (
                      <li key={pkg}>{pkg}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}

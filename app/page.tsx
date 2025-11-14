'use client';

import { useConfigState } from '@/hooks/use-config-state';
import { useCodePreview } from '@/hooks/use-code-preview';
import Navigation from '@/components/layout/navigation';
import RuleChecklist from '@/components/config/rule-checklist';
import CodePreview from '@/components/config/code-preview';

export default function Home() {
  const { state, actions } = useConfigState();
  const { exampleCode, isFormatting, error } = useCodePreview(
    state.currentTool,
    state.currentTool === 'prettier' ? state.prettierRules : state.eslintRules
  );

  const currentRules =
    state.currentTool === 'prettier' ? state.prettierRules : state.eslintRules;

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        currentTool={state.currentTool}
        onToolChange={actions.setCurrentTool}
        onReset={actions.resetToPreset}
        onDownload={actions.downloadConfig}
      />

      <main className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RuleChecklist
            tool={state.currentTool}
            rules={currentRules}
            onToggleRule={actions.toggleRule}
          />

          <CodePreview
            exampleCode={exampleCode}
            isFormatting={isFormatting}
            error={error}
          />
        </div>
      </main>
    </div>
  );
}

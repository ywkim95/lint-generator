'use client';

import { useMemo } from 'react';
import { useConfigState } from '@/hooks/use-config-state';
import { useCodePreview } from '@/hooks/use-code-preview';
import { generateInstallCommands } from '@/lib/generators/command-generator';
import Navigation from '@/components/layout/navigation';
import RuleChecklist from '@/components/config/rule-checklist';
import CodePreview from '@/components/config/code-preview';
import InstallCommands from '@/components/config/install-commands';

export default function Home() {
  const { state, actions } = useConfigState();

  // Memoize currentRules to prevent unnecessary re-renders
  const currentRules = useMemo(
    () => (state.currentTool === 'prettier' ? state.prettierRules : state.eslintRules),
    [state.currentTool, state.prettierRules, state.eslintRules]
  );

  const { exampleCode, isFormatting, error } = useCodePreview(
    state.currentTool,
    currentRules
  );

  const installCommands = generateInstallCommands(state.currentTool, currentRules);

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        currentTool={state.currentTool}
        onToolChange={actions.setCurrentTool}
        onReset={actions.resetToPreset}
        onDownload={actions.downloadConfig}
      />

      <main className="container mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RuleChecklist
            tool={state.currentTool}
            rules={currentRules}
            currentPresetId={state.currentPreset}
            onToggleRule={actions.toggleRule}
            onUpdateRuleValue={actions.updateRuleValue}
            onPresetChange={actions.setCurrentPreset}
          />

          <CodePreview
            exampleCode={exampleCode}
            isFormatting={isFormatting}
            error={error}
          />
        </div>

        <InstallCommands commands={installCommands} />
      </main>
    </div>
  );
}

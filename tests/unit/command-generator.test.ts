import { generateInstallCommands } from '@/lib/generators/command-generator';
import { ConfigRule } from '@/types/rule';

describe('Command Generator', () => {
  describe('generateInstallCommands', () => {
    it('should generate install commands for Prettier', () => {
      const rules: ConfigRule[] = [];
      const commands = generateInstallCommands('prettier', rules);

      expect(commands).toHaveLength(4);
      expect(commands[0].packageManager).toBe('npm');
      expect(commands[0].command).toContain('prettier');
      expect(commands[0].command).toContain('--save-dev');

      expect(commands[1].packageManager).toBe('yarn');
      expect(commands[1].command).toContain('prettier');
      expect(commands[1].command).toContain('--dev');

      expect(commands[2].packageManager).toBe('pnpm');
      expect(commands[3].packageManager).toBe('bun');
    });

    it('should include TypeScript plugins for ESLint with TypeScript rules', () => {
      const rules: ConfigRule[] = [
        {
          id: 'typescript-rule',
          name: 'TypeScript Rule',
          description: 'TypeScript related rule',
          tool: 'eslint',
          enabled: true,
          value: 'error',
        },
      ];

      const commands = generateInstallCommands('eslint', rules);

      expect(commands[0].packages).toContain('eslint');
      expect(commands[0].packages).toContain('@typescript-eslint/parser');
      expect(commands[0].packages).toContain('@typescript-eslint/eslint-plugin');
    });

    it('should include React plugin for ESLint with React rules', () => {
      const rules: ConfigRule[] = [
        {
          id: 'react-hooks',
          name: 'React Hooks Rule',
          description: 'React hooks related rule',
          tool: 'eslint',
          enabled: true,
          value: 'error',
        },
      ];

      const commands = generateInstallCommands('eslint', rules);

      expect(commands[0].packages).toContain('eslint');
      expect(commands[0].packages).toContain('eslint-plugin-react');
    });

    it('should include both TypeScript and React plugins if both rules exist', () => {
      const rules: ConfigRule[] = [
        {
          id: 'typescript-rule',
          name: 'TypeScript Rule',
          description: 'TypeScript related rule',
          tool: 'eslint',
          enabled: true,
          value: 'error',
        },
        {
          id: 'react-hooks',
          name: 'React Hooks Rule',
          description: 'React hooks related rule',
          tool: 'eslint',
          enabled: true,
          value: 'error',
        },
      ];

      const commands = generateInstallCommands('eslint', rules);

      expect(commands[0].packages).toContain('eslint');
      expect(commands[0].packages).toContain('@typescript-eslint/parser');
      expect(commands[0].packages).toContain('@typescript-eslint/eslint-plugin');
      expect(commands[0].packages).toContain('eslint-plugin-react');
    });
  });
});

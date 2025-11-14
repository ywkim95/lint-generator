import { ConfigRule } from '@/types/rule';

export interface InstallationCommand {
  packageManager: 'npm' | 'yarn' | 'pnpm' | 'bun';
  command: string;
  packages: string[];
  devFlag: string;
}

/**
 * 모든 패키지 매니저의 설치 명령어를 생성합니다.
 *
 * @param tool - 설치할 도구 ('prettier' | 'eslint')
 * @param rules - 활성화된 규칙 (플러그인 감지용)
 * @returns 4개 패키지 매니저의 명령어 배열
 *
 * @logic
 * - ESLint의 경우 규칙에서 필요한 플러그인 자동 감지
 * - TypeScript 규칙 → @typescript-eslint/* 추가
 * - React 규칙 → eslint-plugin-react 추가
 */
export function generateInstallCommands(
  tool: 'prettier' | 'eslint',
  rules: ConfigRule[]
): InstallationCommand[] {
  const packages: string[] = [tool];

  // ESLint의 경우 필요한 플러그인 추가
  if (tool === 'eslint') {
    // TypeScript 규칙이 있으면 @typescript-eslint 추가
    const hasTypeScriptRules = rules.some(
      (r) => r.id.startsWith('typescript') || r.id.includes('ts')
    );
    if (hasTypeScriptRules) {
      packages.push('@typescript-eslint/parser', '@typescript-eslint/eslint-plugin');
    }

    // React 규칙이 있으면 eslint-plugin-react 추가
    const hasReactRules = rules.some((r) => r.id.startsWith('react'));
    if (hasReactRules) {
      packages.push('eslint-plugin-react');
    }
  }

  const flags = {
    npm: '--save-dev',
    yarn: '--dev',
    pnpm: '--save-dev',
    bun: '--dev',
  };

  const packageManagers: Array<'npm' | 'yarn' | 'pnpm' | 'bun'> = [
    'npm',
    'yarn',
    'pnpm',
    'bun',
  ];

  return packageManagers.map((pm) => {
    const command =
      pm === 'yarn'
        ? `yarn add ${flags[pm]} ${packages.join(' ')}`
        : `${pm} install ${flags[pm]} ${packages.join(' ')}`;

    return {
      packageManager: pm,
      command,
      packages,
      devFlag: flags[pm],
    };
  });
}

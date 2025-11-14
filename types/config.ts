export interface PrettierConfig {
  semi?: boolean;
  singleQuote?: boolean;
  tabWidth?: number;
  printWidth?: number;
  trailingComma?: 'none' | 'es5' | 'all';
  arrowParens?: 'avoid' | 'always';
  bracketSpacing?: boolean;
  [key: string]: any;
}

export interface ESLintConfigContent {
  extends?: string[];
  plugins?: string[];
  rules: Record<string, any>;
  parserOptions?: any;
  env?: Record<string, boolean>;
}

export interface ConfigFile {
  tool: 'prettier' | 'eslint';
  filename: string;              // 파일명 (예: '.prettierrc', '.eslintrc.json')
  content: PrettierConfig | ESLintConfigContent;
  format: 'json' | 'js' | 'yaml';  // 파일 형식
}

export interface InstallationCommand {
  packageManager: 'npm' | 'yarn' | 'pnpm' | 'bun';
  command: string;
  packages: string[];          // 설치할 패키지 목록
  devFlag: string;             // 개발 의존성 플래그
}

export interface ExampleCode {
  original: string;           // 원본 코드 (포맷팅 전)
  formatted: string;          // 포맷팅 적용 후 코드
  tool: 'prettier' | 'eslint';
  language: 'typescript' | 'javascript';
  lintMessages?: LintMessage[];  // ESLint 경고/오류 (ESLint용)
}

export interface LintMessage {
  line: number;
  column: number;
  severity: 'warning' | 'error';
  message: string;
  ruleId: string;
}

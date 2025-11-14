export interface ConfigPreset {
  id: 'official' | 'airbnb' | 'standard';
  name: string;
  description: string;
  prettierRules: Record<string, boolean | number | string>;
  eslintRules: Record<string, 'off' | 'warn' | 'error' | [string, ...any[]]>;
  parserOptions?: {
    ecmaVersion?: number;
    sourceType?: 'script' | 'module';
    ecmaFeatures?: Record<string, boolean>;
  };
}

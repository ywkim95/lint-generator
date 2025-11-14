export interface ConfigRule {
  id: string;              // 고유 식별자 (예: 'semi', 'no-console')
  name: string;            // 표시 이름 (예: '세미콜론 사용')
  description: string;     // 규칙 설명
  tool: 'prettier' | 'eslint';  // 도구 타입
  category?: string;       // 규칙 카테고리 (예: 'Formatting', 'Best Practices')

  // Prettier 규칙
  prettierOption?: {
    key: string;           // Prettier 옵션 키 (예: 'semi')
    type: 'boolean' | 'number' | 'string';
    defaultValue: any;     // 기본값
    possibleValues?: any[];  // 가능한 값들 (select용)
  };

  // ESLint 규칙
  eslintRule?: {
    ruleId: string;        // ESLint 규칙 ID (예: 'no-console')
    severity: 'off' | 'warn' | 'error';
    options?: any[];       // 규칙 옵션 배열
  };

  // 현재 상태
  enabled: boolean;        // 체크박스 선택 여부
  value?: any;             // 현재 설정값
}

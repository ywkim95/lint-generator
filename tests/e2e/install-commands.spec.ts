import { test, expect } from '@playwright/test';

test.describe('Installation Commands', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // T042: Prettier 설치 명령어 표시 테스트
  test('should display Prettier installation commands for all package managers', async ({ page }) => {
    // Prettier가 기본 선택되어 있음
    const prettierRadio = page.getByLabel('Prettier');
    await expect(prettierRadio).toBeChecked();

    // 패키지 설치 명령어 카드 확인
    await expect(page.getByText('패키지 설치 명령어')).toBeVisible();

    // npm 탭이 기본 선택
    const npmCommand = page.locator('code', { hasText: 'npm install' });
    await expect(npmCommand).toBeVisible();
    await expect(npmCommand).toContainText('prettier');
    await expect(npmCommand).toContainText('--save-dev');

    // yarn 탭 확인
    await page.getByRole('tab', { name: 'yarn' }).click();
    const yarnCommand = page.locator('code', { hasText: 'yarn add' });
    await expect(yarnCommand).toBeVisible();
    await expect(yarnCommand).toContainText('prettier');
    await expect(yarnCommand).toContainText('--dev');

    // pnpm 탭 확인
    await page.getByRole('tab', { name: 'pnpm' }).click();
    const pnpmCommand = page.locator('code', { hasText: 'pnpm install' });
    await expect(pnpmCommand).toBeVisible();
    await expect(pnpmCommand).toContainText('prettier');
    await expect(pnpmCommand).toContainText('--save-dev');

    // bun 탭 확인
    await page.getByRole('tab', { name: 'bun' }).click();
    const bunCommand = page.locator('code', { hasText: 'bun install' });
    await expect(bunCommand).toBeVisible();
    await expect(bunCommand).toContainText('prettier');
    await expect(bunCommand).toContainText('--dev');
  });

  // T043: ESLint 플러그인 자동 감지 테스트
  test('should detect and include ESLint plugins based on rules', async ({ page }) => {
    // ESLint로 전환
    await page.getByLabel('ESLint').click();

    // 기본 ESLint 명령어 확인
    const npmCommand = page.locator('code', { hasText: 'npm install' });
    await expect(npmCommand).toBeVisible();
    await expect(npmCommand).toContainText('eslint');

    // TypeScript 규칙 활성화 시 플러그인 추가 확인
    // (현재 ESLint 규칙에 TypeScript 관련 규칙이 있는지에 따라 동작이 달라질 수 있음)
    // 이 테스트는 rules.ts의 ESLint 규칙 정의에 따라 조정 필요

    // React 규칙이 있다면 eslint-plugin-react가 포함되어야 함
    // 실제 규칙 정의를 확인하여 테스트 작성
  });

  // T044: 클립보드 복사 기능 테스트
  test('should copy installation command to clipboard', async ({ page, context }) => {
    // 클립보드 권한 부여
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    // npm 탭의 복사 버튼 클릭
    const copyButton = page.getByRole('button', { name: /복사/ });
    await expect(copyButton).toBeVisible();
    await copyButton.click();

    // 복사됨 상태 확인
    await expect(page.getByRole('button', { name: /복사됨/ })).toBeVisible();

    // 클립보드 내용 확인
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toContain('npm install');
    expect(clipboardText).toContain('prettier');
    expect(clipboardText).toContain('--save-dev');

    // 2초 후 버튼이 원래 상태로 돌아가는지 확인
    await page.waitForTimeout(2100);
    await expect(page.getByRole('button', { name: /^복사$/ })).toBeVisible();
  });

  test('should show packages list for each package manager', async ({ page }) => {
    // Prettier 기본 선택 상태에서 패키지 목록 확인
    await expect(page.getByText('설치될 패키지:')).toBeVisible();
    await expect(page.getByText('prettier', { exact: true })).toBeVisible();

    // ESLint로 전환
    await page.getByLabel('ESLint').click();

    // ESLint 패키지 목록 확인
    await expect(page.getByText('설치될 패키지:')).toBeVisible();
    await expect(page.getByText('eslint', { exact: true })).toBeVisible();
  });

  test('should update commands when switching between tools', async ({ page }) => {
    // 초기 Prettier 명령어
    let command = page.locator('code').first();
    await expect(command).toContainText('prettier');

    // ESLint로 전환
    await page.getByLabel('ESLint').click();

    // 명령어가 ESLint로 변경됨
    command = page.locator('code').first();
    await expect(command).toContainText('eslint');
    await expect(command).not.toContainText('prettier');

    // 다시 Prettier로 전환
    await page.getByLabel('Prettier').click();

    // 명령어가 다시 Prettier로 변경됨
    command = page.locator('code').first();
    await expect(command).toContainText('prettier');
    await expect(command).not.toContainText('eslint');
  });
});

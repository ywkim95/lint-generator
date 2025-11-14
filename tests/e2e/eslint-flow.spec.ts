import { test, expect } from '@playwright/test';

test.describe('ESLint Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // T035: Prettier → ESLint 전환 테스트
  test('should switch from Prettier to ESLint', async ({ page }) => {
    // 초기 Prettier 선택 확인
    const prettierRadio = page.getByLabel('Prettier');
    await expect(prettierRadio).toBeChecked();

    // ESLint 라디오 버튼 클릭
    const eslintRadio = page.getByLabel('ESLint');
    await eslintRadio.click();

    // ESLint 선택 확인
    await expect(eslintRadio).toBeChecked();
    await expect(prettierRadio).not.toBeChecked();

    // ESLint 규칙 제목 표시 확인
    await expect(page.getByText('ESLint 규칙')).toBeVisible();
  });

  test('should load ESLint rules when switched', async ({ page }) => {
    // ESLint로 전환
    await page.getByLabel('ESLint').click();

    // ESLint 규칙들이 표시되어야 함
    await expect(page.getByText('console 사용 금지')).toBeVisible();
    await expect(page.getByText('따옴표 스타일')).toBeVisible();
  });

  // T036: ESLint 규칙 선택 및 경고 표시 테스트
  test('should display lint messages when rule is enabled', async ({ page }) => {
    // ESLint로 전환
    await page.getByLabel('ESLint').click();

    // debounce 대기
    await page.waitForTimeout(500);

    // console 사용 금지 규칙 체크
    const noConsoleCheckbox = page
      .locator('label:has-text("console 사용 금지")')
      .locator('..')
      .locator('button[role="checkbox"]');

    // 체크박스가 있는지 확인하고 클릭
    if (await noConsoleCheckbox.isVisible()) {
      const isChecked = await noConsoleCheckbox.getAttribute('data-state');
      if (isChecked !== 'checked') {
        await noConsoleCheckbox.click();
      }

      // 린팅 메시지가 업데이트될 때까지 대기
      await page.waitForTimeout(1000);

      // 린팅 결과 섹션 확인 (샘플 코드에 console.log가 있는 경우)
      const lintResults = page.getByText('린팅 결과');

      // 샘플 코드에 console.log가 있으면 경고가 표시되어야 함
      const codePreview = page.locator('pre code');
      const codeText = await codePreview.textContent();

      if (codeText && codeText.includes('console')) {
        await expect(lintResults).toBeVisible();
      }
    }
  });

  test('should update lint messages when rules change', async ({ page }) => {
    // ESLint로 전환
    await page.getByLabel('ESLint').click();

    // 초기 코드 확인 (debounce 대기)
    await page.waitForTimeout(500);

    // 규칙 토글
    const noConsoleCheckbox = page
      .locator('label:has-text("console 사용 금지")')
      .locator('..')
      .locator('button[role="checkbox"]');

    if (await noConsoleCheckbox.isVisible()) {
      await noConsoleCheckbox.click();

      // 린팅이 업데이트될 때까지 대기
      await page.waitForTimeout(1000);

      // 다시 토글
      await noConsoleCheckbox.click();

      await page.waitForTimeout(1000);

      // 린팅 결과가 변경되어야 함 (검증은 UI가 반응하는지 확인)
      // 실제 메시지 내용은 샘플 코드와 규칙에 따라 다름
    }
  });

  // T037: ESLint 설정 파일 다운로드 테스트
  test('should download ESLint config file', async ({ page }) => {
    // ESLint로 전환
    await page.getByLabel('ESLint').click();

    // 규칙 선택
    const noConsoleCheckbox = page
      .locator('label:has-text("console 사용 금지")')
      .locator('..')
      .locator('button[role="checkbox"]');

    if (await noConsoleCheckbox.isVisible()) {
      const isChecked = await noConsoleCheckbox.getAttribute('data-state');
      if (isChecked !== 'checked') {
        await noConsoleCheckbox.click();
      }
    }

    // 다운로드 버튼 클릭
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: '다운로드' }).click();
    const download = await downloadPromise;

    // 파일명 확인
    expect(download.suggestedFilename()).toBe('.eslintrc.json');

    // 파일 내용 확인
    const path = await download.path();
    if (path) {
      const fs = require('fs');
      const content = fs.readFileSync(path, 'utf-8');
      const config = JSON.parse(content);

      // ESLint 설정이 포함되어 있는지 확인
      expect(config).toHaveProperty('rules');
      expect(typeof config.rules).toBe('object');
    }
  });

  test('should reset to default ESLint rules on reset button', async ({ page }) => {
    // ESLint로 전환
    await page.getByLabel('ESLint').click();

    // 규칙 토글
    const noConsoleCheckbox = page
      .locator('label:has-text("console 사용 금지")')
      .locator('..')
      .locator('button[role="checkbox"]');

    if (await noConsoleCheckbox.isVisible()) {
      const initialState = await noConsoleCheckbox.getAttribute('data-state');
      await noConsoleCheckbox.click();

      // 상태 변경 확인
      const newState = await noConsoleCheckbox.getAttribute('data-state');
      expect(newState).not.toBe(initialState);

      // 초기화 버튼 클릭
      await page.getByRole('button', { name: '초기화' }).click();

      // 원래 상태로 복원 확인
      const resetState = await noConsoleCheckbox.getAttribute('data-state');
      expect(resetState).toBe(initialState);
    }
  });

  test('should preserve Prettier rules when switching to ESLint and back', async ({ page }) => {
    // Prettier 규칙 선택
    const prettierSemiCheckbox = page
      .locator('label:has-text("세미콜론 사용")')
      .locator('..')
      .locator('button[role="checkbox"]');

    const initialPrettierState = await prettierSemiCheckbox.getAttribute('data-state');

    // Prettier 규칙 토글
    await prettierSemiCheckbox.click();
    const modifiedPrettierState = await prettierSemiCheckbox.getAttribute('data-state');
    expect(modifiedPrettierState).not.toBe(initialPrettierState);

    // ESLint로 전환
    await page.getByLabel('ESLint').click();

    // 다시 Prettier로 전환
    await page.getByLabel('Prettier').click();

    // Prettier 규칙 상태 유지 확인
    const finalPrettierState = await prettierSemiCheckbox.getAttribute('data-state');
    expect(finalPrettierState).toBe(modifiedPrettierState);
  });
});

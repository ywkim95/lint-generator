import { test, expect } from '@playwright/test';

test.describe('Prettier Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // T025: Prettier 기본 로드 테스트
  test('should display Prettier as default tool', async ({ page }) => {
    // Prettier 라디오 버튼이 선택되어 있어야 함
    const prettierRadio = page.getByLabel('Prettier');
    await expect(prettierRadio).toBeChecked();

    // ESLint 라디오 버튼은 선택되지 않아야 함
    const eslintRadio = page.getByLabel('ESLint');
    await expect(eslintRadio).not.toBeChecked();

    // Prettier 규칙 제목이 표시되어야 함
    await expect(page.getByText('Prettier 규칙')).toBeVisible();

    // 코드 미리보기 제목이 표시되어야 함
    await expect(page.getByText('코드 미리보기')).toBeVisible();
  });

  test('should load default Prettier rules', async ({ page }) => {
    // 기본 규칙들이 로드되어야 함
    await expect(page.getByText('세미콜론 사용')).toBeVisible();
    await expect(page.getByText('작은따옴표 사용')).toBeVisible();
    await expect(page.getByText('탭 너비')).toBeVisible();
    await expect(page.getByText('줄 길이')).toBeVisible();
  });

  // T026: Prettier 규칙 토글 테스트
  test('should toggle rule and update preview', async ({ page }) => {
    // 세미콜론 규칙 체크박스 찾기
    const semiCheckbox = page.locator('label:has-text("세미콜론 사용")').locator('..');
    const checkbox = semiCheckbox.locator('button[role="checkbox"]');

    // 초기 상태 확인 (체크됨)
    await expect(checkbox).toHaveAttribute('data-state', 'checked');

    // 체크박스 토글
    await checkbox.click();

    // 상태 변경 확인 (unchecked)
    await expect(checkbox).toHaveAttribute('data-state', 'unchecked');

    // 다시 토글
    await checkbox.click();

    // 상태 다시 변경 확인 (checked)
    await expect(checkbox).toHaveAttribute('data-state', 'checked');
  });

  test('should display code preview', async ({ page }) => {
    // 코드 미리보기가 표시될 때까지 대기
    await page.waitForTimeout(1000);

    // 코드 미리보기 영역 확인
    const codePreview = page.locator('pre code');
    await expect(codePreview).toBeVisible();

    // 샘플 코드가 포함되어 있는지 확인
    const codeText = await codePreview.textContent();
    expect(codeText).toContain('interface');
    expect(codeText).toContain('function');
  });

  test('should update preview when rule changes', async ({ page }) => {
    // 초기 코드 확인 (debounce 대기)
    await page.waitForTimeout(500);

    const codePreview = page.locator('pre code');
    const initialCode = await codePreview.textContent();

    // 세미콜론 규칙 토글
    const semiCheckbox = page
      .locator('label:has-text("세미콜론 사용")')
      .locator('..')
      .locator('button[role="checkbox"]');
    await semiCheckbox.click();

    // 코드가 업데이트될 때까지 대기 (debounce 300ms + 포맷팅 시간)
    await page.waitForTimeout(1000);

    const updatedCode = await codePreview.textContent();

    // 코드가 변경되어야 함
    expect(updatedCode).not.toBe(initialCode);
  });

  // T027: Prettier 다운로드 테스트
  test('should download Prettier config file', async ({ page }) => {
    // 다운로드 버튼 클릭
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: '다운로드' }).click();
    const download = await downloadPromise;

    // 파일명 확인
    expect(download.suggestedFilename()).toBe('.prettierrc');

    // 파일 내용 확인
    const path = await download.path();
    if (path) {
      const fs = require('fs');
      const content = fs.readFileSync(path, 'utf-8');
      const config = JSON.parse(content);

      // 설정이 포함되어 있는지 확인
      expect(config).toHaveProperty('semi');
      expect(config).toHaveProperty('singleQuote');
      expect(config).toHaveProperty('tabWidth');
      expect(config).toHaveProperty('printWidth');
    }
  });

  test('should reset rules on reset button click', async ({ page }) => {
    // 규칙 토글
    const semiCheckbox = page
      .locator('label:has-text("세미콜론 사용")')
      .locator('..')
      .locator('button[role="checkbox"]');
    await semiCheckbox.click();

    // unchecked 상태 확인
    await expect(semiCheckbox).toHaveAttribute('data-state', 'unchecked');

    // 초기화 버튼 클릭
    await page.getByRole('button', { name: '초기화' }).click();

    // checked 상태로 복원 확인
    await expect(semiCheckbox).toHaveAttribute('data-state', 'checked');
  });
});

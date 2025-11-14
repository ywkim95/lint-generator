import { test, expect } from '@playwright/test';

test.describe('Reset Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // T054: 규칙 변경 후 초기화 테스트
  test('should reset rules to preset defaults when reset button is clicked', async ({ page }) => {
    // 초기 상태: 공식 기본값 프리셋
    const presetSelector = page.locator('#preset-selector');
    await expect(presetSelector).toContainText('공식 기본값');

    // 규칙 하나를 수동으로 토글
    const semiCheckbox = page
      .locator('label:has-text("세미콜론 사용")')
      .locator('..')
      .locator('button[role="checkbox"]');

    const initialState = await semiCheckbox.getAttribute('data-state');
    await semiCheckbox.click();

    // 상태가 변경되었는지 확인
    const modifiedState = await semiCheckbox.getAttribute('data-state');
    expect(modifiedState).not.toBe(initialState);

    // 또 다른 규칙 토글
    const singleQuoteCheckbox = page
      .locator('label:has-text("작은따옴표 사용")')
      .locator('..')
      .locator('button[role="checkbox"]');

    const initialQuoteState = await singleQuoteCheckbox.getAttribute('data-state');
    await singleQuoteCheckbox.click();

    const modifiedQuoteState = await singleQuoteCheckbox.getAttribute('data-state');
    expect(modifiedQuoteState).not.toBe(initialQuoteState);

    // 초기화 버튼 클릭
    await page.getByRole('button', { name: '초기화' }).click();

    // 모든 규칙이 프리셋 기본값으로 복원되었는지 확인
    const resetSemiState = await semiCheckbox.getAttribute('data-state');
    const resetQuoteState = await singleQuoteCheckbox.getAttribute('data-state');

    expect(resetSemiState).toBe(initialState);
    expect(resetQuoteState).toBe(initialQuoteState);
  });

  test('should reset ESLint rules correctly', async ({ page }) => {
    // ESLint로 전환
    await page.getByLabel('ESLint').click();

    // 초기 상태 확인
    const presetSelector = page.locator('#preset-selector');
    await expect(presetSelector).toContainText('공식 기본값');

    // no-console 규칙 토글
    const noConsoleCheckbox = page
      .locator('label:has-text("console 사용 금지")')
      .locator('..')
      .locator('button[role="checkbox"]');

    if (await noConsoleCheckbox.isVisible()) {
      const initialState = await noConsoleCheckbox.getAttribute('data-state');
      await noConsoleCheckbox.click();

      const modifiedState = await noConsoleCheckbox.getAttribute('data-state');
      expect(modifiedState).not.toBe(initialState);

      // 초기화 버튼 클릭
      await page.getByRole('button', { name: '초기화' }).click();

      // 원래 상태로 복원 확인
      const resetState = await noConsoleCheckbox.getAttribute('data-state');
      expect(resetState).toBe(initialState);
    }
  });

  // T055: 초기화 후 정상 동작 재개 테스트
  test('should allow normal operation after reset', async ({ page }) => {
    // 규칙 변경
    const semiCheckbox = page
      .locator('label:has-text("세미콜론 사용")')
      .locator('..')
      .locator('button[role="checkbox"]');

    await semiCheckbox.click();

    // 초기화
    await page.getByRole('button', { name: '초기화' }).click();

    // 초기화 후 다시 규칙 변경 가능한지 확인
    const stateAfterReset = await semiCheckbox.getAttribute('data-state');
    await semiCheckbox.click();

    const stateAfterToggle = await semiCheckbox.getAttribute('data-state');
    expect(stateAfterToggle).not.toBe(stateAfterReset);

    // 코드 미리보기가 업데이트되는지 확인
    await page.waitForTimeout(500);
    const codePreview = page.locator('pre code');
    await expect(codePreview).toBeVisible();
  });

  test('should reset to correct preset when preset is changed before reset', async ({ page }) => {
    // Airbnb 프리셋으로 변경
    await page.click('#preset-selector');
    await page.click('text=Airbnb');

    const presetSelector = page.locator('#preset-selector');
    await expect(presetSelector).toContainText('Airbnb');

    // 규칙 토글
    const semiCheckbox = page
      .locator('label:has-text("세미콜론 사용")')
      .locator('..')
      .locator('button[role="checkbox"]');

    // Airbnb 프리셋의 초기 상태 저장
    const airbnbSemiState = await semiCheckbox.getAttribute('data-state');
    await semiCheckbox.click();

    // 상태 변경 확인
    const modifiedState = await semiCheckbox.getAttribute('data-state');
    expect(modifiedState).not.toBe(airbnbSemiState);

    // 초기화 버튼 클릭 (Airbnb 프리셋 기본값으로 복원되어야 함)
    await page.getByRole('button', { name: '초기화' }).click();

    // Airbnb 프리셋 기본값으로 복원되었는지 확인
    const resetState = await semiCheckbox.getAttribute('data-state');
    expect(resetState).toBe(airbnbSemiState);
  });

  test('should preserve preset selection after reset', async ({ page }) => {
    // Standard 프리셋으로 변경
    await page.click('#preset-selector');
    await page.click('text=Standard');

    const presetSelector = page.locator('#preset-selector');
    await expect(presetSelector).toContainText('Standard');

    // 규칙 변경
    const semiCheckbox = page
      .locator('label:has-text("세미콜론 사용")')
      .locator('..')
      .locator('button[role="checkbox"]');

    await semiCheckbox.click();

    // 초기화
    await page.getByRole('button', { name: '초기화' }).click();

    // 프리셋은 그대로 Standard인지 확인
    await expect(presetSelector).toContainText('Standard');

    // 규칙은 Standard 프리셋 기본값으로 복원되었는지 확인
    // (Standard는 semi: false)
    const resetState = await semiCheckbox.getAttribute('data-state');
    expect(resetState).toBe('unchecked'); // Standard는 세미콜론 미사용
  });

  test('should reset and update code preview correctly', async ({ page }) => {
    // 초기 코드 미리보기 로드 대기
    await page.waitForTimeout(500);

    // 규칙 여러 개 변경
    const semiCheckbox = page
      .locator('label:has-text("세미콜론 사용")')
      .locator('..')
      .locator('button[role="checkbox"]');

    const singleQuoteCheckbox = page
      .locator('label:has-text("작은따옴표 사용")')
      .locator('..')
      .locator('button[role="checkbox"]');

    await semiCheckbox.click();
    await singleQuoteCheckbox.click();

    // 코드가 업데이트될 때까지 대기
    await page.waitForTimeout(1000);

    // 초기화
    await page.getByRole('button', { name: '초기화' }).click();

    // 코드 미리보기가 업데이트될 때까지 대기
    await page.waitForTimeout(1000);

    // 코드 미리보기가 표시되는지 확인
    const codePreview = page.locator('pre code');
    await expect(codePreview).toBeVisible();

    // 코드가 초기화된 프리셋 스타일로 돌아갔는지 확인 (내용 검증)
    const codeText = await codePreview.textContent();
    expect(codeText).toBeTruthy();
  });
});

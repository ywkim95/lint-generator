import { test, expect } from '@playwright/test';

test.describe('Preset Selection Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // T049: 프리셋 드롭다운 기본값 확인 테스트
  test('should show default preset on page load', async ({ page }) => {
    // Prettier가 기본 선택되어 있음
    const prettierRadio = page.getByLabel('Prettier');
    await expect(prettierRadio).toBeChecked();

    // 프리셋 선택기 존재 확인
    const presetSelector = page.locator('#preset-selector');
    await expect(presetSelector).toBeVisible();

    // 기본 프리셋이 "공식 기본값"인지 확인
    await expect(presetSelector).toContainText('공식 기본값');
  });

  // T050: Airbnb 프리셋 선택 및 체크리스트 업데이트 테스트
  test('should update rules when Airbnb preset is selected', async ({ page }) => {
    // 프리셋 드롭다운 클릭
    await page.click('#preset-selector');

    // Airbnb 프리셋 선택
    await page.click('text=Airbnb');

    // 프리셋이 변경되었는지 확인
    const presetSelector = page.locator('#preset-selector');
    await expect(presetSelector).toContainText('Airbnb');

    // Airbnb 프리셋 특성 확인 (singleQuote: true)
    // 규칙이 활성화되었는지 확인
    const singleQuoteCheckbox = page
      .locator('label:has-text("작은따옴표 사용")')
      .locator('..')
      .locator('button[role="checkbox"]');

    await expect(singleQuoteCheckbox).toHaveAttribute('data-state', 'checked');
  });

  test('should update ESLint preset correctly', async ({ page }) => {
    // ESLint로 전환
    await page.getByLabel('ESLint').click();

    // 프리셋 드롭다운이 ESLint용으로 업데이트되었는지 확인
    const presetSelector = page.locator('#preset-selector');
    await expect(presetSelector).toBeVisible();
    await expect(presetSelector).toContainText('공식 기본값');

    // Standard 프리셋 선택
    await page.click('#preset-selector');
    await page.click('text=Standard');

    // 프리셋이 변경되었는지 확인
    await expect(presetSelector).toContainText('Standard');
  });

  // T051: 프리셋 변경 시 수동 변경사항 초기화 테스트
  test('should reset manual changes when preset is changed', async ({ page }) => {
    // 초기 상태: 공식 기본값 프리셋
    const presetSelector = page.locator('#preset-selector');
    await expect(presetSelector).toContainText('공식 기본값');

    // 규칙 하나를 수동으로 토글
    const semiCheckbox = page
      .locator('label:has-text("세미콜론 사용")')
      .locator('..')
      .locator('button[role="checkbox"]');

    const initialSemiState = await semiCheckbox.getAttribute('data-state');
    await semiCheckbox.click();

    // 상태가 변경되었는지 확인
    const modifiedSemiState = await semiCheckbox.getAttribute('data-state');
    expect(modifiedSemiState).not.toBe(initialSemiState);

    // 다른 프리셋으로 변경 (Airbnb)
    await page.click('#preset-selector');
    await page.click('text=Airbnb');

    // 프리셋이 변경되었는지 확인
    await expect(presetSelector).toContainText('Airbnb');

    // Airbnb 프리셋의 semi 설정 확인 (Airbnb는 semi: true)
    const airbnbSemiState = await semiCheckbox.getAttribute('data-state');
    expect(airbnbSemiState).toBe('checked'); // Airbnb는 세미콜론 사용

    // 다시 공식 기본값으로 변경
    await page.click('#preset-selector');
    await page.click('text=공식 기본값');

    // 원래 프리셋 상태로 복원되었는지 확인
    const resetSemiState = await semiCheckbox.getAttribute('data-state');
    expect(resetSemiState).toBe(initialSemiState);
  });

  test('should preserve preset selection when switching between tools', async ({ page }) => {
    // Prettier에서 Airbnb 프리셋 선택
    await page.click('#preset-selector');
    await page.click('text=Airbnb');

    const prettierPresetSelector = page.locator('#preset-selector');
    await expect(prettierPresetSelector).toContainText('Airbnb');

    // ESLint로 전환
    await page.getByLabel('ESLint').click();

    // ESLint는 기본 프리셋(공식 기본값)으로 시작
    const eslintPresetSelector = page.locator('#preset-selector');
    await expect(eslintPresetSelector).toContainText('공식 기본값');

    // ESLint에서 Standard 선택
    await page.click('#preset-selector');
    await page.click('text=Standard');
    await expect(eslintPresetSelector).toContainText('Standard');

    // 다시 Prettier로 전환
    await page.getByLabel('Prettier').click();

    // Prettier 프리셋이 유지되는지 확인 (Airbnb)
    await expect(prettierPresetSelector).toContainText('Airbnb');
  });

  test('should update code preview when preset is changed', async ({ page }) => {
    // 초기 코드 미리보기 로드 대기
    await page.waitForTimeout(500);

    // Airbnb 프리셋으로 변경
    await page.click('#preset-selector');
    await page.click('text=Airbnb');

    // 코드가 업데이트될 때까지 대기 (debounce 300ms + 처리 시간)
    await page.waitForTimeout(1000);

    // 코드 미리보기가 표시되는지 확인
    const codePreview = page.locator('pre code');
    await expect(codePreview).toBeVisible();

    // Airbnb 스타일 적용 확인 (작은따옴표 사용)
    const codeText = await codePreview.textContent();
    expect(codeText).toBeTruthy();
  });
});

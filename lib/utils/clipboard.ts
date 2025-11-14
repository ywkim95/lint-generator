/**
 * 텍스트를 클립보드에 복사합니다.
 *
 * @param text - 복사할 텍스트
 * @returns 복사 성공 여부
 *
 * @errors
 * - 권한 거부 시 `false` 반환
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

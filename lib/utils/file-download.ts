import { ConfigFile } from '@/types/config';

/**
 * 설정 파일을 브라우저에서 다운로드합니다.
 *
 * @param configFile - 다운로드할 설정 파일 객체
 *
 * @sideEffects
 * - 브라우저 다운로드 트리거 (Blob + anchor click)
 */
export function downloadConfigFile(configFile: ConfigFile): void {
  const json = JSON.stringify(configFile.content, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = configFile.filename;
  a.click();

  // Clean up object URL
  URL.revokeObjectURL(url);
}

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

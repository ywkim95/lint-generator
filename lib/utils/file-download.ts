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

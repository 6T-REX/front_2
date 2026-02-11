/**
 * 서울시 CCTV 정보 CSV에서 WGS84 위도·경도 및 소재지(도로명/지번) 추출
 * CSV 헤더에서 소재지도로명주소, 소재지지번주소 컬럼 인덱스를 찾아 라벨로 사용
 * (인코딩: EUC-KR 또는 UTF-8)
 */

export type CctvItem = { id: string; label: string; lat: number; lng: number };

/** 서울 시내 위·경도 범위 */
const SEOUL_LAT_MIN = 37.4;
const SEOUL_LAT_MAX = 37.7;
const SEOUL_LNG_MIN = 126.7;
const SEOUL_LNG_MAX = 127.2;

const COL_DORO = '소재지도로명주소';
const COL_JIBUN = '소재지지번주소';

function parseLatLngFromLine(line: string): { lat: number; lng: number } | null {
  const match = line.match(/(3[5-8]\.\d+),\s*(12[67]\.\d+)/);
  if (!match) return null;
  const lat = parseFloat(match[1]);
  const lng = parseFloat(match[2]);
  if (
    Number.isNaN(lat) ||
    Number.isNaN(lng) ||
    lat < SEOUL_LAT_MIN ||
    lat > SEOUL_LAT_MAX ||
    lng < SEOUL_LNG_MIN ||
    lng > SEOUL_LNG_MAX
  ) {
    return null;
  }
  return { lat, lng };
}

/** 헤더 라인에서 컬럼 인덱스 찾기 (쉼표 구분, 따옴표 내 쉼표는 미지원) */
function findColumnIndices(headerLine: string): { doro: number; jibun: number } {
  const parts = headerLine.split(',').map((p) => p.trim());
  let doro = -1;
  let jibun = -1;
  for (let i = 0; i < parts.length; i++) {
    if (parts[i] === COL_DORO) doro = i;
    if (parts[i] === COL_JIBUN) jibun = i;
  }
  return { doro, jibun };
}

/**
 * CSV 텍스트를 파싱해 CCTV 목록 반환 (최대 maxItems개)
 * 라벨: 소재지도로명주소 값 사용, 없으면 소재지지번주소 사용
 */
export function parseCctvCsv(csvText: string, maxItems = 2000): CctvItem[] {
  const lines = csvText.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) return [];

  const { doro, jibun } = findColumnIndices(lines[0]);
  const result: CctvItem[] = [];
  let index = 0;

  for (let i = 1; i < lines.length && result.length < maxItems; i++) {
    const line = lines[i];
    const coords = parseLatLngFromLine(line);
    if (!coords) continue;

    const parts = line.split(',');
    const doroVal = doro >= 0 && parts[doro] != null ? parts[doro].trim() : '';
    const jibunVal = jibun >= 0 && parts[jibun] != null ? parts[jibun].trim() : '';
    const label =
      doroVal ||
      jibunVal ||
      (parts.length > 2 && parts[2]?.trim() ? parts[2].trim() : '') ||
      `CCTV ${result.length + 1}`;
    const finalLabel = label.slice(0, 50);

    result.push({
      id: `CCTV-${index}`,
      label: finalLabel,
      lat: coords.lat,
      lng: coords.lng,
    });
    index += 1;
  }

  return result;
}

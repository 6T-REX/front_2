/**
 * OpenDataCCTV.xlsx 파싱
 * - CENTERNAME === "서울교통정보센터" 인 행만 사용
 * - 좌표 컬럼으로 지도에 표시, 이름은 CCTVNAME 사용
 */

import * as XLSX from 'xlsx';
import type { CctvItem } from './parseCctvCsv';

const CENTER_FILTER = '서울교통정보센터';
const COORD_PRECISION = 5;

/** 위·경도 후보 컬럼명 (우선순위) */
const LAT_KEYS = ['위도', 'WGS84위도', 'WGS84_위도', '위도(WGS84)', 'LAT', 'latitude', 'Lat', 'lat', 'Y', 'y', 'LATITUDE'];
const LNG_KEYS = ['경도', 'WGS84경도', 'WGS84_경도', '경도(WGS84)', 'LNG', 'longitude', 'Lng', 'lng', 'X', 'x', 'LONGITUDE'];

function getNum(row: Record<string, unknown>, keys: string[]): number | null {
  for (const k of keys) {
    const v = row[k];
    if (v === undefined || v === null || v === '') continue;
    const n = typeof v === 'number' ? v : Number(String(v).trim());
    if (!Number.isNaN(n)) return n;
  }
  return null;
}

function getStr(row: Record<string, unknown>, key: string): string {
  const v = row[key];
  if (v === undefined || v === null) return '';
  return String(v).trim();
}

/**
 * 시트의 실제 컬럼명(첫 행)에서 위도/경도 컬럼 이름 찾기
 */
function findCoordColumns(firstRow: Record<string, unknown>): { latKey: string | null; lngKey: string | null } {
  const keys = Object.keys(firstRow).map((k) => k.trim());
  let latKey: string | null = null;
  let lngKey: string | null = null;
  
  // 정확한 매칭 시도
  for (const k of keys) {
    const lower = k.toLowerCase().replace(/\s+/g, '');
    for (const latPattern of LAT_KEYS) {
      if (lower === latPattern.toLowerCase() || k === latPattern || lower.includes(latPattern.toLowerCase())) {
        latKey = k;
        break;
      }
    }
    for (const lngPattern of LNG_KEYS) {
      if (lower === lngPattern.toLowerCase() || k === lngPattern || lower.includes(lngPattern.toLowerCase())) {
        lngKey = k;
        break;
      }
    }
  }
  
  // 정확한 매칭 실패 시 정규식으로 찾기
  if (!latKey && keys.length > 0) {
    const maybeLat = keys.find((k) => {
      const lower = k.toLowerCase();
      return /위도|lat|latitude|y\s*좌표|y\s*coordinate/i.test(lower) && !/경도|lng|longitude|x/i.test(lower);
    });
    if (maybeLat) latKey = maybeLat;
  }
  if (!lngKey && keys.length > 0) {
    const maybeLng = keys.find((k) => {
      const lower = k.toLowerCase();
      return /경도|lng|longitude|x\s*좌표|x\s*coordinate/i.test(lower) && !/위도|lat|latitude|y/i.test(lower);
    });
    if (maybeLng) lngKey = maybeLng;
  }
  
  return { latKey, lngKey };
}

/**
 * OpenDataCCTV.xlsx ArrayBuffer를 파싱해 CctvItem[] 반환.
 * CENTERNAME === "서울교통정보센터" 인 행만 사용, 이름은 CCTVNAME, 위·경도 겹침 제거.
 */
export function parseOpenDataCctvXlsx(buffer: ArrayBuffer): CctvItem[] {
  try {
    const workbook = XLSX.read(buffer, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) {
      console.warn('[parseOpenDataCctvXlsx] No sheet found');
      return [];
    }
    const sheet = workbook.Sheets[firstSheetName];
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' });
    console.log('[parseOpenDataCctvXlsx] Total rows:', rows.length);
    if (rows.length === 0) return [];

    const first = rows[0];
    const columns = Object.keys(first);
    console.log('[parseOpenDataCctvXlsx] Columns:', columns.slice(0, 10), '...');
    const { latKey, lngKey } = findCoordColumns(first);
    console.log('[parseOpenDataCctvXlsx] Found latKey:', latKey, 'lngKey:', lngKey);
    if (!latKey || !lngKey) {
      console.warn('[parseOpenDataCctvXlsx] Could not find lat/lng columns');
      return [];
    }

    const result: CctvItem[] = [];
    const latKeys = [latKey, ...LAT_KEYS.filter((k) => k !== latKey)];
    const lngKeys = [lngKey, ...LNG_KEYS.filter((k) => k !== lngKey)];
    let filteredByCenter = 0;
    let filteredByCoords = 0;
    let filteredByRange = 0;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const centerName = getStr(row, 'CENTERNAME');
      if (centerName !== CENTER_FILTER) {
        filteredByCenter++;
        continue;
      }

      const lat = getNum(row, latKeys);
      const lng = getNum(row, lngKeys);
      if (lat == null || lng == null) {
        filteredByCoords++;
        continue;
      }
      if (lat < 37.4 || lat > 37.7 || lng < 126.7 || lng > 127.2) {
        filteredByRange++;
        continue;
      }

      const name = getStr(row, 'CCTVNAME') || `CCTV ${result.length}`;
      result.push({
        id: `CCTV-${i}`,
        label: name.slice(0, 80),
        lat,
        lng,
      });
    }
    console.log('[parseOpenDataCctvXlsx] Filtered - by CENTERNAME:', filteredByCenter, 'by coords:', filteredByCoords, 'by range:', filteredByRange);
    console.log('[parseOpenDataCctvXlsx] Result before dedup:', result.length);

    // 위·경도 겹치는 항목 제거
    const seen = new Map<string, CctvItem>();
    for (const item of result) {
      const key = `${item.lat.toFixed(COORD_PRECISION)},${item.lng.toFixed(COORD_PRECISION)}`;
      if (!seen.has(key)) seen.set(key, item);
    }
    const deduped = Array.from(seen.values());
    console.log('[parseOpenDataCctvXlsx] Final result after dedup:', deduped.length);
    return deduped.map((item, i) => ({ ...item, id: `CCTV-${i}` }));
  } catch (err) {
    console.error('[parseOpenDataCctvXlsx] Error:', err);
    throw err;
  }
}

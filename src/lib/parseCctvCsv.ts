/**
 * 서울시 CCTV 정보 CSV에서 WGS84 위도·경도 및 소재지(도로명/지번) 추출
 * CSV 헤더에서 소재지도로명주소, 소재지지번주소 컬럼 인덱스를 찾아 라벨로 사용
 * (인코딩: EUC-KR 또는 UTF-8)
 */

export type CctvItem = { 
  id: string; 
  label: string; 
  lat: number; 
  lng: number;
  videoUrl?: string; // CCTV 영상 스트림 URL
  cctvId?: string; // API에서 사용하는 CCTV ID
};

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

/** CSV 라인을 파싱 (따옴표로 감싸진 값도 처리) */
function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // 이스케이프된 따옴표
        current += '"';
        i++; // 다음 따옴표 건너뛰기
      } else {
        // 따옴표 시작/끝
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // 따옴표 밖의 쉼표는 필드 구분자
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim()); // 마지막 필드
  return result;
}

/** 헤더 라인에서 컬럼 인덱스 찾기 */
function findColumnIndices(headerLine: string, options?: ParseCctvCsvOptions): { doro: number; jibun: number; nameCol: number; filterCol: number; filterVal: string | null; latCol: number; lngCol: number } {
  const parts = parseCsvLine(headerLine);
  let doro = -1;
  let jibun = -1;
  let nameCol = -1;
  let filterCol = -1;
  let latCol = -1;
  let lngCol = -1;
  const filterVal = options?.filterValue || null;
  
  // 디버깅: 헤더 파싱 결과 확인
  if (options?.filterColumn || options?.nameColumn) {
    console.log('[findColumnIndices] Header parts:', parts);
    console.log('[findColumnIndices] Looking for:', {
      filterColumn: options?.filterColumn,
      nameColumn: options?.nameColumn,
      latColumn: options?.latColumn,
      lngColumn: options?.lngColumn
    });
  }
  
  for (let i = 0; i < parts.length; i++) {
    const col = parts[i].replace(/^"|"$/g, '').trim(); // 따옴표 제거 및 공백 제거
    if (col === COL_DORO) doro = i;
    if (col === COL_JIBUN) jibun = i;
    if (options?.nameColumn && col === options.nameColumn) {
      nameCol = i;
      console.log(`[findColumnIndices] Found nameColumn "${options.nameColumn}" at index ${i}`);
    }
    if (options?.filterColumn && col === options.filterColumn) {
      filterCol = i;
      console.log(`[findColumnIndices] Found filterColumn "${options.filterColumn}" at index ${i}`);
    }
    if (options?.latColumn && col === options.latColumn) {
      latCol = i;
      console.log(`[findColumnIndices] Found latColumn "${options.latColumn}" at index ${i}`);
    }
    if (options?.lngColumn && col === options.lngColumn) {
      lngCol = i;
      console.log(`[findColumnIndices] Found lngColumn "${options.lngColumn}" at index ${i}`);
    }
  }
  
  if (options?.filterColumn && filterCol === -1) {
    console.error(`[findColumnIndices] ERROR: Could not find filterColumn "${options.filterColumn}" in header!`);
    console.error('[findColumnIndices] Available columns:', parts.map((p, i) => `${i}: "${p.replace(/^"|"$/g, '')}"`));
  }
  
  return { doro, jibun, nameCol, filterCol, filterVal, latCol, lngCol };
}

/** 위·경도 겹침 기준 (소수점 자리수, 약 1.1m 이내 동일 위치로 간주) */
const COORD_PRECISION = 5;

export interface ParseCctvCsvOptions {
  /** 이름으로 사용할 컬럼명 (예: 'CCTVNAME') */
  nameColumn?: string;
  /** 필터링할 컬럼명 (예: 'CENTERNAME') */
  filterColumn?: string;
  /** 필터링할 값 (예: '서울교통정보센터') */
  filterValue?: string;
  /** 위도 컬럼명 (예: '위도', 'LAT', 'WGS84위도') - 지정 시 해당 컬럼에서 위도 추출 */
  latColumn?: string;
  /** 경도 컬럼명 (예: '경도', 'LNG', 'WGS84경도') - 지정 시 해당 컬럼에서 경도 추출 */
  lngColumn?: string;
}

/**
 * CSV 텍스트를 파싱해 CCTV 목록 반환 (전체 데이터 사용).
 * 위·경도가 겹치는 항목은 하나만 유지하고 나머지는 제거한다.
 * 라벨: 소재지도로명주소 값 사용, 없으면 소재지지번주소 사용
 * 옵션: nameColumn(이름 컬럼), filterColumn/filterValue(필터링)
 */
export function parseCctvCsv(csvText: string, options?: ParseCctvCsvOptions): CctvItem[] {
  const lines = csvText.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) return [];

  const { doro, jibun, nameCol, filterCol, filterVal, latCol, lngCol } = findColumnIndices(lines[0], options);
  
  // 디버깅 로그 추가
  if (options?.filterColumn) {
    console.log('[parseCctvCsv] Filter options:', {
      filterColumn: options.filterColumn,
      filterValue: options.filterValue,
      filterColIndex: filterCol,
      latColIndex: latCol,
      lngColIndex: lngCol,
      nameColIndex: nameCol
    });
    console.log('[parseCctvCsv] Header line:', lines[0]);
    if (lines.length > 1) {
      const sampleParts = parseCsvLine(lines[1]);
      console.log('[parseCctvCsv] Sample row parts:', sampleParts);
      if (filterCol >= 0) {
        console.log('[parseCctvCsv] Sample filter value:', sampleParts[filterCol], 'expected:', filterVal);
      }
    }
  }
  
  const result: CctvItem[] = [];
  let index = 0;
  let filteredCount = 0;
  let coordFilteredCount = 0;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const parts = parseCsvLine(line);
    
    // 필터링: filterColumn이 있고 filterValue가 지정된 경우
    if (filterCol >= 0 && filterVal !== null) {
      const filterCell = parts[filterCol]?.replace(/^"|"$/g, '').trim();
      const filterValTrimmed = filterVal.trim();
      
      // 디버깅: 처음 몇 개 행만 상세 로그
      if (i <= 10) {
        console.log(`[parseCctvCsv] Row ${i}: filterCol=${filterCol}, parts[filterCol]="${parts[filterCol]}", filterCell="${filterCell}", filterVal="${filterValTrimmed}"`);
        console.log(`[parseCctvCsv] Row ${i} all parts:`, parts);
      }
      
      // 비교: 정확히 일치하거나 포함 관계 확인
      if (filterCell !== filterValTrimmed) {
        filteredCount++;
        if (i <= 5) {
          console.log(`[parseCctvCsv] Row ${i} filtered out: "${filterCell}" !== "${filterValTrimmed}" (length: ${filterCell.length} vs ${filterValTrimmed.length})`);
        }
        continue;
      }
    }

    // 위경도 추출: 컬럼 지정 시 해당 컬럼에서, 없으면 정규식으로 라인에서 찾기
    let coords: { lat: number; lng: number } | null = null;
    if (latCol >= 0 && lngCol >= 0) {
      const latStr = parts[latCol]?.replace(/^"|"$/g, '').trim();
      const lngStr = parts[lngCol]?.replace(/^"|"$/g, '').trim();
      if (latStr && lngStr) {
        const lat = parseFloat(latStr);
        const lng = parseFloat(lngStr);
        if (!Number.isNaN(lat) && !Number.isNaN(lng) &&
            lat >= SEOUL_LAT_MIN && lat <= SEOUL_LAT_MAX &&
            lng >= SEOUL_LNG_MIN && lng <= SEOUL_LNG_MAX) {
          coords = { lat, lng };
        } else {
          coordFilteredCount++;
          if (coordFilteredCount <= 5) {
            console.log(`[parseCctvCsv] Row ${i} coord out of range: lat=${lat}, lng=${lng}`);
          }
        }
      } else {
        coordFilteredCount++;
        if (coordFilteredCount <= 5) {
          console.log(`[parseCctvCsv] Row ${i} missing coords: latStr="${latStr}", lngStr="${lngStr}"`);
        }
      }
    } else {
      coords = parseLatLngFromLine(line);
    }
    if (!coords) continue;

    // 라벨 결정: nameColumn 우선, 없으면 기존 로직
    let label = '';
    if (nameCol >= 0 && parts[nameCol] != null) {
      label = parts[nameCol].replace(/^"|"$/g, '').trim();
    } else {
      const doroVal = doro >= 0 && parts[doro] != null ? parts[doro].replace(/^"|"$/g, '').trim() : '';
      const jibunVal = jibun >= 0 && parts[jibun] != null ? parts[jibun].replace(/^"|"$/g, '').trim() : '';
      const fallback = parts.length > 2 && parts[2] != null ? parts[2].replace(/^"|"$/g, '').trim() : '';
      label = doroVal || jibunVal || fallback || `CCTV ${result.length + 1}`;
    }
    const finalLabel = label.slice(0, 80);

    result.push({
      id: `CCTV-${index}`,
      label: finalLabel,
      lat: coords.lat,
      lng: coords.lng,
    });
    index += 1;
  }

  // 디버깅 로그
  if (options?.filterColumn) {
    console.log('[parseCctvCsv] Filtering stats:', {
      totalRows: lines.length - 1,
      filteredByCenter: filteredCount,
      filteredByCoords: coordFilteredCount,
      matchedRows: result.length
    });
  }

  // 위·경도 겹치는 항목 제거 (같은 좌표는 첫 번째만 유지)
  const seen = new Map<string, CctvItem>();
  for (const item of result) {
    const key = `${item.lat.toFixed(COORD_PRECISION)},${item.lng.toFixed(COORD_PRECISION)}`;
    if (!seen.has(key)) seen.set(key, item);
  }
  const deduped = Array.from(seen.values());
  // id 재부여 (연속 번호)
  return deduped.map((item, i) => ({ ...item, id: `CCTV-${i}` }));
}

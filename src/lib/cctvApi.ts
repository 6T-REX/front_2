/**
 * 서울시 교통정보센터 CCTV API 연동
 * API URL: http://www.utic.go.kr/guide/cctvOpenData.do
 */

const CCTV_API_KEY = 'i2oTqfL7FLgKXNMSpyt4sbrWvs4rtj5DM1WAunQzZ8';
const CCTV_API_BASE_URL = 'http://www.utic.go.kr/guide/cctvOpenData.do';

export interface CctvApiItem {
  cctvid: string;
  cctvname: string;
  centerlat: string;
  centerlng: string;
  videourl?: string;
}

/**
 * CCTV API에서 CCTV 목록 가져오기
 */
export async function fetchCctvList(): Promise<CctvApiItem[]> {
  try {
    const url = `${CCTV_API_BASE_URL}?key=${CCTV_API_KEY}`;
    console.log('[CCTV API] Fetching CCTV list from:', url);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`CCTV API error: ${response.status} ${response.statusText}`);
    }
    
    const text = await response.text();
    console.log('[CCTV API] Response received, length:', text.length);
    
    // XML 파싱
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, 'text/xml');
    
    // 에러 체크
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      console.error('[CCTV API] XML parse error:', parserError.textContent);
      throw new Error('Failed to parse XML response');
    }
    
    // CCTV 항목 추출
    const cctvItems = xmlDoc.querySelectorAll('item');
    const result: CctvApiItem[] = [];
    
    cctvItems.forEach((item) => {
      const cctvid = item.querySelector('cctvid')?.textContent || '';
      const cctvname = item.querySelector('cctvname')?.textContent || '';
      const centerlat = item.querySelector('centerlat')?.textContent || '';
      const centerlng = item.querySelector('centerlng')?.textContent || '';
      const videourl = item.querySelector('videourl')?.textContent || '';
      
      if (cctvid && cctvname) {
        result.push({
          cctvid,
          cctvname,
          centerlat,
          centerlng,
          videourl: videourl || undefined,
        });
      }
    });
    
    console.log('[CCTV API] Parsed', result.length, 'CCTV items');
    return result;
  } catch (error) {
    console.error('[CCTV API] Error fetching CCTV list:', error);
    throw error;
  }
}

/**
 * CCTV ID로 영상 URL 가져오기
 */
export function getCctvVideoUrl(cctvId: string): string {
  // API에서 제공하는 영상 URL 형식에 맞게 구성
  // 실제 API 응답에 따라 수정 필요
  return `${CCTV_API_BASE_URL}?key=${CCTV_API_KEY}&cctvid=${cctvId}`;
}

/**
 * CCTV 이름으로 CCTV ID 찾기
 */
export function findCctvIdByName(
  cctvList: CctvApiItem[],
  name: string
): string | null {
  const normalizedName = name.trim().toLowerCase();
  const found = cctvList.find(
    (item) => item.cctvname.trim().toLowerCase() === normalizedName
  );
  return found?.cctvid || null;
}

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Sparkles, Video, Clock, 
  ChevronRight, MapPin, Target, Shield,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { parseCctvCsv, type CctvItem } from '../../lib/parseCctvCsv';

const FALLBACK_CAMERAS: CctvItem[] = [
  { id: 'C01', label: '강남역 4번 출구', lat: 37.498095, lng: 127.027610 },
  { id: 'C02', label: '테헤란로 교차로', lat: 37.501408, lng: 127.039674 },
  { id: 'C03', label: '역삼 하이츠', lat: 37.499681, lng: 127.034302 },
  { id: 'C04', label: '코엑스 동문', lat: 37.511245, lng: 127.061004 },
  { id: 'C05', label: '선릉 공원', lat: 37.504560, lng: 127.049555 },
];

/** 두 위·경도 간 거리(m), Haversine */
function getDistanceMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/** 클릭 지점에서 가장 가까운 n개 CCTV (정확히 n개만) */
function findNearestCCTVs(list: CctvItem[], lat: number, lng: number, n: number): CctvItem[] {
  return [...list]
    .map((c) => ({ c, d: getDistanceMeters(lat, lng, c.lat, c.lng) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, n)
    .map((x) => x.c);
}

type MarkerPixel = { id: string; label: string; x: number; y: number };

export default function AIInvestigation() {
  const [selectedCams, setSelectedCams] = useState<string[]>(['C01', 'C02']);
  const [query, setQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [markerPixels, setMarkerPixels] = useState<MarkerPixel[]>([]);
  const [openInfoId, setOpenInfoId] = useState<string | null>(null);
  const [mapLevel, setMapLevel] = useState<number>(14);
  const [isSelectingPoint, setIsSelectingPoint] = useState(false);
  const [rippleCenter, setRippleCenter] = useState<{ x: number; y: number } | null>(null);
  const [cameras, setCameras] = useState<CctvItem[]>(FALLBACK_CAMERAS);
  const [clickedPin, setClickedPin] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedCctvIds, setSelectedCctvIds] = useState<Set<string>>(new Set());
  const [displayedCameraIds, setDisplayedCameraIds] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'map' | 'cctv'>('map');
  const mapRef = useRef<any>(null);
  const mapAreaRef = useRef<HTMLDivElement>(null);
  const camerasRef = useRef<CctvItem[]>(FALLBACK_CAMERAS);
  const circleRef = useRef<any>(null);

  const ZOOM_SHOW_MARKERS = 4; // 이 레벨 이하일 때 CCTV 표시 (12까지 = 더 가까이/줌 인해도 유지)

  const updatePixelPositions = (map: any, camList: CctvItem[]) => {
    const w = window as any;
    if (!map || !w.kakao?.maps) return;
    const proj = map.getProjection();
    if (!proj || typeof proj.containerPointFromCoords !== 'function') return;

    const next: MarkerPixel[] = camList.map((cam) => {
      const latLng = new w.kakao.maps.LatLng(cam.lat, cam.lng);
      const point = proj.containerPointFromCoords(latLng);
      const x =
        typeof (point as any)?.getX === 'function'
          ? (point as any).getX()
          : typeof (point as any)?.x === 'number'
            ? (point as any).x
            : 0;
      const y =
        typeof (point as any)?.getY === 'function'
          ? (point as any).getY()
          : typeof (point as any)?.y === 'number'
            ? (point as any).y
            : 0;
      return { id: cam.id, label: cam.label, x, y };
    });
    setMarkerPixels(next);
    if (typeof map.getLevel === 'function') setMapLevel(map.getLevel());
  };

  // 서울시 CCTV CSV 로드 (public/cctv_seoul.csv)
  useEffect(() => {
    const csvUrl = '/cctv_seoul.csv';
    fetch(csvUrl)
      .then((res) => {
        if (!res.ok) throw new Error('CSV not found');
        return res.arrayBuffer();
      })
      .then((buffer) => {
        let text: string;
        try {
          text = new TextDecoder('euc-kr').decode(buffer);
        } catch {
          text = new TextDecoder('utf-8').decode(buffer);
        }
        const list = parseCctvCsv(text, 2000);
        if (list.length > 0) {
          setCameras(list);
          camerasRef.current = list;
        }
      })
      .catch(() => {
        // CSV 없거나 파싱 실패 시 fallback 유지
      });
  }, []);

  useEffect(() => {
    camerasRef.current = cameras;
    if (mapRef.current) updatePixelPositions(mapRef.current, cameras);
  }, [cameras]);

  // Kakao 지도 초기화 + 위경도 → 픽셀 오버레이용
  useEffect(() => {
    const w = window as any;

    if (!w.kakao || !w.kakao.maps) {
      console.warn("Kakao Maps SDK가 아직 로드되지 않았습니다. (AIInvestigation)");
      return;
    }

    w.kakao.maps.load(() => {
      const container = document.getElementById("ai-map");
      if (!container) return;

      const options = {
        center: new w.kakao.maps.LatLng(37.5665, 126.978),
        level: 6,
      };

      const map = new w.kakao.maps.Map(container, options);
      mapRef.current = map;

      map.addOverlayMapTypeId(w.kakao.maps.MapTypeId.TRAFFIC);

      updatePixelPositions(map, camerasRef.current);

      const onMapChange = () => updatePixelPositions(map, camerasRef.current);
      w.kakao.maps.event.addListener(map, 'zoom_changed', onMapChange);
      w.kakao.maps.event.addListener(map, 'center_changed', onMapChange);
      w.kakao.maps.event.addListener(map, 'bounds_changed', onMapChange);
    });
  }, []);

  const toggleCam = (id: string) => {
    setSelectedCams(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  /** 검색 시 표시한 범위 원 + 선택된 CCTV 하이라이트 + 지도 아이콘 제거 */
  const clearSearchOverlays = () => {
    if (circleRef.current) {
      circleRef.current.setMap(null);
      circleRef.current = null;
    }
    setSelectedCctvIds(new Set());
    setDisplayedCameraIds(new Set());
    setViewMode('map');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsAnalyzing(true);
    setResults([]);
    setClickedPin(null);
    setRippleCenter(null);
    clearSearchOverlays();

    setTimeout(() => {
      setIsAnalyzing(false);
      addResult(1);
      setTimeout(() => addResult(2), 800);
      setTimeout(() => addResult(3), 1800);
      setIsSelectingPoint(true);
    }, 1500);
  };

  /** 지도 클릭 시 해당 위·경도로 지점 선택 적용 (원 + 선택 9대) */
  const applySelectionAtLatLng = (lat: number, lng: number) => {
    const map = mapRef.current;
    const w = window as any;
    if (!map || !w.kakao?.maps) return;

    const proj = map.getProjection();
    if (proj && typeof proj.containerPointFromCoords === 'function') {
      const latLng = new w.kakao.maps.LatLng(lat, lng);
      const point = proj.containerPointFromCoords(latLng);
      const x = typeof (point as any)?.getX === 'function' ? (point as any).getX() : (point as any)?.x ?? 0;
      const y = typeof (point as any)?.getY === 'function' ? (point as any).getY() : (point as any)?.y ?? 0;
      setRippleCenter({ x, y });
    }
    setIsSelectingPoint(false);
    setClickedPin({ lat, lng });

    const camList = camerasRef.current;
    if (camList.length === 0) return;

    const nearest9 = findNearestCCTVs(camList, lat, lng, 9).slice(0, 9);
    clearSearchOverlays();

    const radiusM = Math.max(
      ...nearest9.map((c) => getDistanceMeters(lat, lng, c.lat, c.lng)),
      100
    );
    const circle = new w.kakao.maps.Circle({
      center: new w.kakao.maps.LatLng(lat, lng),
      radius: radiusM * 1.05,
      strokeWeight: 2,
      strokeColor: '#06b6d4',
      strokeOpacity: 0.9,
      fillColor: '#06b6d4',
      fillOpacity: 0.12,
    });
    circle.setMap(map);
    circleRef.current = circle;
    setSelectedCctvIds(new Set(nearest9.map((c) => c.id)));
    setDisplayedCameraIds(new Set(nearest9.map((c) => c.id)));
    setResults((prev) =>
      prev.map((r, i) => ({ ...r, cctvId: r.cctvId ?? nearest9[i % 9]?.id ?? null }))
    );
  };

  /** 현재 보이는 지도 범위 안의 CCTV만 아이콘 표시 */
  const showCctvInVisibleBounds = () => {
    const map = mapRef.current;
    const w = window as any;
    if (!map || !w.kakao?.maps) return;
    const bounds = map.getBounds();
    if (!bounds || typeof bounds.getSouthWest !== 'function') return;
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    const latMin = Math.min(sw.getLat(), ne.getLat());
    const latMax = Math.max(sw.getLat(), ne.getLat());
    const lngMin = Math.min(sw.getLng(), ne.getLng());
    const lngMax = Math.max(sw.getLng(), ne.getLng());
    const inBounds = camerasRef.current.filter(
      (c) => c.lat >= latMin && c.lat <= latMax && c.lng >= lngMin && c.lng <= lngMax
    );
    setDisplayedCameraIds(new Set(inBounds.map((c) => c.id)));
  };

  // 지점 선택 모드일 때 지도 클릭 리스너 (지도는 그대로 드래그·줌 가능)
  useEffect(() => {
    const map = mapRef.current;
    const w = window as any;
    if (!isSelectingPoint || !map || !w.kakao?.maps.event) return;

    const listener = (mouseEvent: any) => {
      const latLng = mouseEvent.latLng;
      if (!latLng) return;
      const lat = typeof latLng.getLat === 'function' ? latLng.getLat() : latLng.lat;
      const lng = typeof latLng.getLng === 'function' ? latLng.getLng() : latLng.lng;
      applySelectionAtLatLng(lat, lng);
    };
    w.kakao.maps.event.addListener(map, 'click', listener);
    return () => {
      w.kakao.maps.event.removeListener(map, 'click', listener);
    };
  }, [isSelectingPoint]);

  // Ctrl+`: 지도 ↔ CCTV 화면 전환 (Alt+Tab은 OS에서 가로챔)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && (e.key === '`' || e.key === 'Backquote')) {
        e.preventDefault();
        setViewMode((prev) => (prev === 'map' ? 'cctv' : 'map'));
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const selectedCctvList = cameras.filter((c) => selectedCctvIds.has(c.id)).slice(0, 9);

  const addResult = (id: number) => {
    const newResult = {
      id: Date.now(),
      plate: id === 1 ? '12-GA-3456' : id === 2 ? '55-NA-9988' : '02-HA-4411',
      model: id === 1 ? '현대 소나타 (검정)' : '기아 K5 (검정)',
      match: id === 1 ? 98 : id === 2 ? 82 : 45,
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'}),
      loc: id === 1 ? '강남역' : '테헤란로',
      img: id === 1 
        ? 'https://images.unsplash.com/photo-1649963233289-b9ecd40c4c77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' 
        : 'https://images.unsplash.com/photo-1638381717660-00e0f825e145?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
      cctvId: null as string | null,
    };
    setResults(prev => [newResult, ...prev]);
  };

  /** 감지 스트림에서 한 건 클릭 → 그 객체가 감지된 CCTV를 새 중심으로 9개 다시 찾기 */
  const handleResultClick = (res: { cctvId?: string | null }) => {
    const cctvId = res.cctvId;
    if (!cctvId) return;
    const cctv = camerasRef.current.find((c) => c.id === cctvId);
    if (!cctv) return;
    const w = window as any;
    applySelectionAtLatLng(cctv.lat, cctv.lng);
    setViewMode('map');
    if (mapRef.current && w.kakao?.maps) {
      mapRef.current.panTo(new w.kakao.maps.LatLng(cctv.lat, cctv.lng));
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0F172A] flex">
      {/* MAP AREA */}
      <div
        ref={mapAreaRef}
        className="flex-1 relative overflow-hidden group"
      >
        {/* Kakao Map (API만 사용, 마커는 아래 오버레이로) */}
        <div id="ai-map" className="absolute inset-0 z-0" />

        {/* 지점 선택 안내: 지도는 그대로 움직일 수 있고, 클릭 시 해당 위치 선택 */}
        <AnimatePresence>
          {isSelectingPoint && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 pointer-events-none"
            >
              <div className="px-5 py-3 rounded-xl bg-slate-800/95 border border-slate-600 shadow-xl backdrop-blur-sm text-center flex items-center gap-3">
                <MapPin className="w-6 h-6 text-cyan-400 flex-shrink-0" />
                <p className="text-white font-medium text-sm">
                  지도에서 추적할 지점을 클릭하세요
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 선택한 지점 주변 회색 그라데이션 리플 애니메이션 */}
        {rippleCenter && (
          <div className="absolute inset-0 z-[12] pointer-events-none">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="absolute w-48 h-48 rounded-full"
                style={{
                  left: rippleCenter.x,
                  top: rippleCenter.y,
                  transform: 'translate(-50%, -50%)',
                  background: 'radial-gradient(circle, rgba(148,163,184,0.25) 0%, rgba(148,163,184,0.08) 40%, transparent 70%)',
                  animation: 'map-point-ripple 2.2s ease-out infinite',
                  animationDelay: `${i * 0.7}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* CCTV 아이콘: displayedCameraIds에 있는 것만 표시 (처음엔 없음 → 지도 클릭 시 9개 / 버튼 시 보이는 범위) */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {displayedCameraIds.size > 0 &&
            markerPixels
              .filter((mp) => displayedCameraIds.has(mp.id))
              .map((mp) => (
            <div
              key={mp.id}
              className="absolute pointer-events-auto cursor-pointer"
              style={{
                left: mp.x,
                top: mp.y,
                transform: 'translate(-50%, -100%)',
              }}
              onClick={(e) => {
                e.stopPropagation();
                toggleCam(mp.id);
                setOpenInfoId((prev) => (prev === mp.id ? null : mp.id));
              }}
              onMouseEnter={() => setOpenInfoId(mp.id)}
              onMouseLeave={() => setOpenInfoId(null)}
            >
              <div
                className={`flex flex-col items-center transition-transform ${
                  selectedCams.includes(mp.id)
                    ? 'scale-110'
                    : 'hover:scale-105'
                }`}
              >
                <div
                  className={`flex items-center justify-center rounded-full p-0.5 ${
                    selectedCams.includes(mp.id)
                      ? 'drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]'
                      : ''
                  } ${selectedCctvIds.has(mp.id) ? 'ring-2 ring-green-500' : ''}`}
                >
                  <img
                    src="/cctv-icon.png"
                    alt="CCTV"
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
                {(openInfoId === mp.id || selectedCams.includes(mp.id)) && (
                  <div className="mt-1 px-2 py-1 rounded bg-slate-900/95 text-white text-xs whitespace-nowrap border border-slate-600 shadow-lg">
                    {mp.label}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CCTV 화면 전체 오버레이 (Ctrl+` 로 전환) */}
        <AnimatePresence>
          {viewMode === 'cctv' && selectedCctvList.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-30 bg-slate-950 flex flex-col p-4 gap-3"
            >
              <div className="flex items-center justify-between flex-shrink-0">
                <span className="text-sm font-semibold text-slate-300">선택된 CCTV 화면</span>
                <span className="text-xs text-slate-500">Ctrl+` · 지도 보기</span>
              </div>
              <div className="flex-1 grid grid-cols-3 gap-2 min-h-0">
                {selectedCctvList.map((cctv, idx) => (
                  <div
                    key={cctv.id}
                    className="rounded-lg overflow-hidden border border-slate-600 bg-slate-800/90 flex flex-col min-h-0"
                  >
                    <div className="flex-1 min-h-0 bg-slate-900 flex items-center justify-center">
                      <div className="flex flex-col items-center gap-2 text-slate-500">
                        <Video className="w-10 h-10 opacity-50" />
                        <span className="text-xs font-mono">CCTV-{idx + 1}</span>
                      </div>
                    </div>
                    <div className="px-2 py-1.5 bg-slate-900/80 border-t border-slate-700/50 flex-shrink-0">
                      <p className="text-[10px] text-slate-400 truncate" title={cctv.label}>
                        {cctv.label || `CCTV ${idx + 1}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* RIGHT CONTROL PANEL (Drawer) */}
      <div className="w-[400px] flex-shrink-0 bg-slate-900/80 backdrop-blur-2xl border-l border-slate-700/50 flex flex-col shadow-2xl z-30">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-700/50">
           <div className="flex items-center gap-3 mb-2">
             <div className="bg-cyan-500/10 p-2 rounded-lg border border-cyan-500/20">
               <Sparkles className="h-5 w-5 text-cyan-400" />
             </div>
             <h2 className="text-xl font-bold text-white tracking-wide">AI 스마트 검색</h2>
           </div>
           <p className="text-xs text-slate-400">카메라를 선택하고 추적할 대상을 설명하세요.</p>
           <button
             type="button"
             onClick={showCctvInVisibleBounds}
             className="mt-3 w-full py-2 px-3 rounded-lg border border-slate-600 bg-slate-800/80 hover:bg-slate-700/80 hover:border-slate-500 text-slate-300 text-sm font-medium transition-colors flex items-center justify-center gap-2"
           >
             <MapPin className="w-4 h-4" />
             현재 지점에서 CCTV 찾기
           </button>
        </div>

        {/* Input Area */}
        <div className="p-6 space-y-4">
           <div className="relative">
             <textarea 
               value={query}
               onChange={(e) => setQuery(e.target.value)}
               placeholder="예시: '지난 30분 동안 강남역 근처에서 감지된 검은색 소나타를 찾아줘.'"
               className="w-full h-32 bg-slate-950/50 border border-slate-700 rounded-xl p-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 resize-none font-mono leading-relaxed"
             />
             <div className="absolute bottom-3 right-3 text-[10px] text-slate-600">NLP MODEL V4.2</div>
           </div>
           
           <button 
             onClick={handleSearch}
             disabled={isAnalyzing}
             className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-900/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
           >
             {isAnalyzing ? (
               <>
                 <Sparkles className="h-5 w-5 animate-spin" /> 영상 분석 중...
               </>
             ) : (
               <>
                 <Target className="h-5 w-5 group-hover:scale-110 transition-transform" /> 분석 및 추적
               </>
             )}
           </button>
        </div>

        {/* 선택된 CCTV · Alt+Tab 안내 */}
        {selectedCctvIds.size > 0 && (
          <div className="border-t border-slate-700/50 flex-shrink-0 p-3 bg-slate-900/50">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">선택 CCTV {selectedCctvIds.size}대</span>
              <span className="text-[10px] text-cyan-400/90 font-mono">
                {viewMode === 'map' ? 'Ctrl+` → CCTV 화면' : 'Ctrl+` → 지도'}
              </span>
            </div>
          </div>
        )}

        {/* Results Stream */}
        <div className="flex-1 overflow-hidden flex flex-col bg-slate-950/30">
          <div className="p-4 bg-slate-900/50 border-y border-slate-800 flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">감지 스트림</span>
            {results.length > 0 && <span className="bg-cyan-500/20 text-cyan-400 text-[10px] px-2 py-0.5 rounded-full">{results.length} 건 일치</span>}
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
             <AnimatePresence>
               {results.map((res, idx) => (
                 <motion.div 
                   key={res.id}
                   initial={{ opacity: 0, x: 50 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: idx * 0.1 }}
                   role="button"
                   tabIndex={0}
                   onClick={() => handleResultClick(res)}
                   onKeyDown={(e) => e.key === 'Enter' && handleResultClick(res)}
                   className={`bg-slate-900 border rounded-xl overflow-hidden transition-colors group cursor-pointer ${
                     res.cctvId ? 'border-slate-700 hover:border-cyan-500/50' : 'border-slate-700 opacity-90'
                   }`}
                 >
                    <div className="flex">
                      <div className="w-24 h-24 bg-black relative">
                         <img src={res.img} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                         <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-1">
                           <span className="text-[10px] text-white font-mono">{res.time}</span>
                         </div>
                      </div>
                      <div className="flex-1 p-3 flex flex-col justify-between">
                         <div>
                           <div className="flex justify-between items-start">
                             <h4 className="text-cyan-400 font-bold font-mono text-sm">{res.plate}</h4>
                             <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${res.match > 90 ? 'bg-red-500 text-black' : 'bg-slate-700 text-slate-300'}`}>
                               {res.match}%
                             </span>
                           </div>
                           <p className="text-xs text-slate-300 mt-1">{res.model}</p>
                         </div>
                         <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-2">
                           <MapPin className="h-3 w-3" /> {res.loc}
                           {res.cctvId && (
                             <span className="text-[9px] text-cyan-500/80 ml-1">· 클릭 시 해당 CCTV 중심</span>
                           )}
                         </div>
                      </div>
                    </div>
                 </motion.div>
               ))}
               
               {!isAnalyzing && results.length === 0 && (
                 <div className="h-40 flex flex-col items-center justify-center text-slate-600 space-y-3">
                    <Shield className="h-12 w-12 opacity-20" />
                    <p className="text-xs text-center px-6">시스템 준비 완료. 검색 조건을 입력하여 스캔을 시작하세요.</p>
                 </div>
               )}
             </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}

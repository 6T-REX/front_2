import React, { useEffect } from 'react';
import { 
  Zap, AlertTriangle, CloudLightning, Navigation, 
  Wind, Droplets, AlertOctagon 
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock Data
const volumeData = [
  { time: '08:00', real: 4200, history: 4000 },
  { time: '09:00', real: 4500, history: 4300 },
  { time: '10:00', real: 3800, history: 3900 },
  { time: '11:00', real: 3200, history: 3400 },
  { time: '12:00', real: 3600, history: 3500 },
  { time: '13:00', real: 3900, history: 3800 },
  { time: '14:00', real: 4100, history: 4000 },
];

const incidents = [
  { id: 1, type: 'accident', title: '차량 충돌', loc: '경부고속도로 상행', time: '10분', severity: 'high' },
  { id: 2, type: 'roadwork', title: '도로 공사', loc: '테헤란로', time: '1시간', severity: 'medium' },
  { id: 3, type: 'weather', title: '안개 주의', loc: '올림픽대로', time: '20분', severity: 'low' },
  { id: 4, type: 'accident', title: '정차 차량', loc: '한남대교 북단', time: '5분', severity: 'medium' },
];

export default function CityOverview() {
  useEffect(() => {
    const w = window as any;

    // Kakao SDK가 아직 로드되지 않았으면 앱이 깨지지 않도록 방어
    if (!w.kakao || !w.kakao.maps) {
      console.warn("Kakao Maps SDK가 아직 로드되지 않았습니다.");
      return;
    }

    w.kakao.maps.load(() => {
      const container = document.getElementById("city-map");
      if (!container) return;

      const options = {
        center: new w.kakao.maps.LatLng(37.566826, 126.9786567), // 서울 시청 (공식 샘플과 동일)
        level: 3, // 샘플과 동일 레벨(교통 레이어 잘 보이도록)
      };

      const map = new w.kakao.maps.Map(container, options);

      // 공식 샘플 방식으로 실시간 교통정보 레이어 추가
      map.addOverlayMapTypeId(w.kakao.maps.MapTypeId.TRAFFIC);
    });
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0F172A]">
      {/* Kakao Map 배경 (실시간 교통 흐름) */}
      <div id="city-map" className="absolute inset-0 z-0" />

      {/* Floating Widget 1 (Top Left): Traffic Metrics */}
      <div className="absolute top-6 left-6 z-10 w-96 bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5 shadow-2xl animate-in fade-in slide-in-from-left-10 duration-500">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold tracking-wide flex items-center gap-2">
            <Zap className="text-cyan-400 h-5 w-5" /> 교통 지표
          </h2>
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div> 실시간</span>
          </div>
        </div>

        <div className="flex items-center gap-6 mb-6">
          {/* Gauge */}
          <div className="relative w-28 h-28 flex-shrink-0">
             <svg className="w-full h-full -rotate-90">
               <circle cx="56" cy="56" r="46" fill="none" stroke="#1e293b" strokeWidth="8" />
               <circle cx="56" cy="56" r="46" fill="none" stroke="#06b6d4" strokeWidth="8" strokeDasharray="289" strokeDashoffset="80" strokeLinecap="round" className="drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]" />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
               <span className="text-3xl font-bold font-mono text-white">42</span>
               <span className="text-[10px] text-slate-400 uppercase tracking-widest">km/h</span>
             </div>
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">교통 혼잡도</span>
              <span className="text-yellow-400 font-mono">보통</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
               <div className="h-full bg-yellow-400 w-[45%]"></div>
            </div>
            <div className="flex justify-between items-center text-xs pt-1">
              <span className="text-slate-400">교통량</span>
              <span className="text-cyan-400 font-mono">높음</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
               <div className="h-full bg-cyan-400 w-[78%]"></div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-32 w-full">
           <div className="flex justify-between text-[10px] text-slate-500 mb-1 px-1">
             <span>교통량 추이</span>
             <span className="flex gap-2">
               <span className="text-cyan-400">실시간</span>
               <span className="text-slate-400 border-b border-dotted border-slate-400">평균</span>
             </span>
           </div>
           <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeData}>
                <defs>
                  <linearGradient id="colorRealCity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="real" stroke="#06b6d4" strokeWidth={2} fill="url(#colorRealCity)" />
                <Area type="monotone" dataKey="history" stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" fill="none" />
              </AreaChart>
           </ResponsiveContainer>
        </div>
      </div>

      {/* Floating Widget 2 (Bottom Left): Incident Feed */}
      <div className="absolute bottom-6 left-6 z-10 w-80 max-h-[40vh] bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5 shadow-2xl flex flex-col animate-in fade-in slide-in-from-bottom-10 duration-500 delay-100">
        <h3 className="text-white font-bold tracking-wide flex items-center gap-2 mb-3">
          <AlertOctagon className="text-red-500 h-5 w-5" /> 실시간 경보
        </h3>
        <div className="overflow-y-auto pr-2 space-y-3 custom-scrollbar flex-1">
           {incidents.map((inc) => (
             <div key={inc.id} className="group flex items-start gap-3 p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/30 transition-all cursor-pointer">
               <div className={`p-2 rounded-lg ${
                  inc.type === 'accident' ? 'bg-red-500/20 text-red-400' :
                  inc.type === 'roadwork' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-blue-500/20 text-blue-400'
               }`}>
                 {inc.type === 'accident' && <AlertTriangle className="h-4 w-4" />}
                 {inc.type === 'roadwork' && <Navigation className="h-4 w-4" />}
                 {inc.type === 'weather' && <CloudLightning className="h-4 w-4" />}
               </div>
               <div>
                 <div className="text-sm font-semibold text-slate-200">{inc.title}</div>
                 <div className="text-xs text-slate-400">{inc.loc}</div>
                 <div className="text-[10px] text-slate-500 mt-1 font-mono">{inc.time} 전</div>
               </div>
             </div>
           ))}
        </div>
      </div>
      
      {/* City Status Pills Top Right */}
      <div className="absolute top-6 right-6 z-10 flex gap-3">
         <div className="bg-slate-900/80 backdrop-blur border border-slate-700 rounded-full px-4 py-2 text-xs font-mono text-slate-300 flex items-center gap-2">
            <Wind className="h-3 w-3" /> 14 km/h
         </div>
         <div className="bg-slate-900/80 backdrop-blur border border-slate-700 rounded-full px-4 py-2 text-xs font-mono text-slate-300 flex items-center gap-2">
            <Droplets className="h-3 w-3" /> 62%
         </div>
      </div>
    </div>
  );
}

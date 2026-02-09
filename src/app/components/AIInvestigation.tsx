import React, { useState, useEffect } from 'react';
import { 
  Search, Sparkles, Video, Clock, 
  ChevronRight, MapPin, Target, Shield,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Mock CCTV Data
const cameras = [
  { id: 'C01', x: 25, y: 35, label: '강남역 4번 출구' },
  { id: 'C02', x: 40, y: 55, label: '테헤란로 교차로' },
  { id: 'C03', x: 65, y: 30, label: '역삼 하이츠' },
  { id: 'C04', x: 55, y: 70, label: '코엑스 동문' },
  { id: 'C05', x: 30, y: 75, label: '선릉 공원' },
];

export default function AIInvestigation() {
  const [selectedCams, setSelectedCams] = useState<string[]>(['C01', 'C02']);
  const [query, setQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const toggleCam = (id: string) => {
    setSelectedCams(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsAnalyzing(true);
    setResults([]); // Clear previous

    // Simulate AI Stream processing
    setTimeout(() => {
      setIsAnalyzing(false);
      addResult(1);
      setTimeout(() => addResult(2), 800);
      setTimeout(() => addResult(3), 1800);
    }, 1500);
  };

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
        : 'https://images.unsplash.com/photo-1638381717660-00e0f825e145?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
    };
    setResults(prev => [newResult, ...prev]);
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0F172A] flex">
      {/* MAP AREA */}
      <div className="flex-1 relative overflow-hidden group">
         {/* Map Background */}
         <div className="absolute inset-0 bg-cover bg-center opacity-60 scale-105" 
              style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1575388902449-6bca946ad549?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080")' }}>
         </div>
         <div className="absolute inset-0 bg-slate-900/40"></div>

         {/* Grid Overlay */}
         <div className="absolute inset-0 opacity-10" 
              style={{ backgroundImage: 'linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
         </div>

         {/* Interactive Cams */}
         {cameras.map(cam => {
           const isSelected = selectedCams.includes(cam.id);
           return (
             <button
               key={cam.id}
               onClick={() => toggleCam(cam.id)}
               className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 group/cam ${isSelected ? 'scale-125 z-20' : 'scale-100 z-10 hover:scale-110'}`}
               style={{ left: `${cam.x}%`, top: `${cam.y}%` }}
             >
               <div className={`relative flex items-center justify-center w-12 h-12 rounded-full backdrop-blur-sm border-2 ${isSelected ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.5)]' : 'bg-slate-900/60 border-slate-600'}`}>
                 <Video className={`w-6 h-6 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                 {/* Status Dot */}
                 <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
               </div>
               
               {/* Label */}
               <div className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 bg-black/80 text-[10px] text-white rounded border border-slate-700 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover/cam:opacity-100'}`}>
                 {cam.label}
               </div>
             </button>
           );
         })}
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
                   className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden hover:border-cyan-500/40 transition-colors group"
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

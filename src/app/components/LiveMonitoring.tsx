import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, CheckCircle, Car, Maximize2, MoreVertical, Disc } from 'lucide-react';

const CAMERAS = [
  { 
    id: 1, 
    name: 'Main Intersection A', 
    src: 'https://images.unsplash.com/photo-1764724683125-37690ef92beb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFmZmljJTIwc3VydmVpbGxhbmNlJTIwY2N0diUyMHN0cmVldCUyMGhpZ2h3YXklMjBzZWN1cml0eSUyMGNhbWVyYSUyMGZvb3RhZ2V8ZW58MXx8fHwxNzcwMjYxNDk4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    detections: [
      { id: 'd1', x: 30, y: 40, w: 15, h: 12, label: '12가3456', type: 'target', confidence: 98 },
      { id: 'd2', x: 60, y: 55, w: 12, h: 10, label: '78나9012', type: 'normal', confidence: 92 },
    ]
  },
  { 
    id: 2, 
    name: 'Highway Exit 4', 
    src: 'https://images.unsplash.com/photo-1578854107362-f07d9e57f25e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWdod2F5JTIwb3ZlcmhlYWQlMjBjYW1lcmElMjB2aWV3JTIwY2Fyc3xlbnwxfHx8fDE3NzAyNjE1MDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    detections: [
      { id: 'd3', x: 45, y: 60, w: 10, h: 8, label: '55다1234', type: 'normal', confidence: 89 },
    ]
  },
  { 
    id: 3, 
    name: 'Downtown Ave', 
    src: 'https://images.unsplash.com/photo-1766367959391-a2d508ed766a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwc3RyZWV0JTIwdHJhZmZpYyUyMG5pZ2h0JTIwY2N0dnxlbnwxfHx8fDE3NzAyNjE1MDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    detections: []
  },
  { 
    id: 4, 
    name: 'Tunnel Entrance', 
    src: 'https://images.unsplash.com/photo-1764724683125-37690ef92beb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFmZmljJTIwc3VydmVpbGxhbmNlJTIwY2N0diUyMHN0cmVldCUyMGhpZ2h3YXklMjBzZWN1cml0eSUyMGNhbWVyYSUyMGZvb3RhZ2V8ZW58MXx8fHwxNzcwMjYxNDk4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', // Reusing first image
    detections: [
       { id: 'd4', x: 20, y: 30, w: 14, h: 10, label: '99라8888', type: 'normal', confidence: 95 },
    ]
  }
];

const INITIAL_LOGS = [
  { id: 1, time: '10:42:05', plate: '12가3456', model: 'Hyundai Sonata', color: 'Silver', location: 'Main Intersection A', type: 'target', thumbnail: 'https://images.unsplash.com/photo-1764724683125-37690ef92beb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFmZmljJTIwc3VydmVpbGxhbmNlJTIwY2N0diUyMHN0cmVldCUyMGhpZ2h3YXklMjBzZWN1cml0eSUyMGNhbWVyYSUyMGZvb3RhZ2V8ZW58MXx8fHwxNzcwMjYxNDk4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
  { id: 2, time: '10:41:58', plate: '78나9012', model: 'Kia K5', color: 'White', location: 'Main Intersection A', type: 'normal', thumbnail: null },
  { id: 3, time: '10:41:45', plate: '55다1234', model: 'BMW 520d', color: 'Black', location: 'Highway Exit 4', type: 'normal', thumbnail: null },
  { id: 4, time: '10:41:30', plate: '99라8888', model: 'Genesis G80', color: 'Black', location: 'Tunnel Entrance', type: 'normal', thumbnail: null },
  { id: 5, time: '10:41:12', plate: '32마1212', model: 'Mercedes E-Class', color: 'Grey', location: 'Main Intersection A', type: 'normal', thumbnail: null },
];

export default function LiveMonitoring() {
  const [logs, setLogs] = useState(INITIAL_LOGS);
  
  // Simulate incoming logs
  useEffect(() => {
    const interval = setInterval(() => {
      const newLog = {
        id: Date.now(),
        time: new Date().toLocaleTimeString('en-US', { hour12: false }),
        plate: `${Math.floor(Math.random()*99)}수${Math.floor(Math.random()*9999)}`,
        model: 'Unknown Sedan',
        color: ['White', 'Black', 'Silver', 'Blue'][Math.floor(Math.random()*4)],
        location: CAMERAS[Math.floor(Math.random()*CAMERAS.length)].name,
        type: Math.random() > 0.9 ? 'target' : 'normal',
        thumbnail: null
      };
      
      setLogs(prev => [newLog, ...prev].slice(0, 20));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-8rem)] gap-4">
      {/* Left: Video Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 h-full overflow-y-auto lg:overflow-hidden">
        {CAMERAS.map((cam) => (
          <div key={cam.id} className="relative bg-black rounded-xl overflow-hidden border border-zinc-800 group h-64 md:h-auto">
             <img 
               src={cam.src} 
               alt={cam.name} 
               className="w-full h-full object-cover opacity-80"
             />
             
             {/* Overlay UI */}
             <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-start">
               <div>
                 <h4 className="text-white font-mono text-sm font-bold flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                   {cam.name}
                 </h4>
                 <p className="text-[10px] text-zinc-400 font-mono mt-0.5">REC • 1080p • 30FPS</p>
               </div>
               <div className="flex gap-2">
                 <button className="p-1.5 hover:bg-white/10 rounded">
                   <Maximize2 className="h-4 w-4 text-white" />
                 </button>
               </div>
             </div>

             {/* Bounding Boxes */}
             {cam.detections.map((det) => (
               <div
                 key={det.id}
                 className="absolute"
                 style={{
                   left: `${det.x}%`,
                   top: `${det.y}%`,
                   width: `${det.w}%`,
                   height: `${det.h}%`,
                 }}
               >
                 {det.type === 'target' ? (
                   <motion.div 
                     className="absolute inset-0 border-2 border-red-500 shadow-[0_0_10px_#ef4444] rounded-sm"
                     animate={{ opacity: [1, 0.5, 1] }}
                     transition={{ duration: 1, repeat: Infinity }}
                   >
                     {/* Label */}
                     <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] px-1.5 py-0.5 whitespace-nowrap font-mono font-bold">
                       {det.label} | ALERT
                     </div>
                   </motion.div>
                 ) : (
                   <div className="absolute inset-0 border border-green-400/50 rounded-sm">
                     <div className="absolute -top-5 left-0 bg-green-500/80 text-black text-[9px] px-1 py-0.5 whitespace-nowrap font-mono font-bold backdrop-blur-sm">
                       {det.label}
                     </div>
                   </div>
                 )}
               </div>
             ))}
          </div>
        ))}
      </div>

      {/* Right: Event Log */}
      <div className="w-full lg:w-96 bg-[#18181b]/60 backdrop-blur-md border border-zinc-800 rounded-xl flex flex-col h-full">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="font-bold text-white flex items-center gap-2">
            <Disc className="h-4 w-4 text-cyan-400 animate-[spin_3s_linear_infinite]" /> 
            Real-time Events
          </h3>
          <button className="text-xs text-cyan-400 hover:underline">Export Log</button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-thin scrollbar-thumb-zinc-800">
          {logs.map((log) => (
             <div 
               key={log.id} 
               className={`p-3 rounded-lg border flex gap-3 transition-all ${
                 log.type === 'target' 
                   ? 'bg-red-500/10 border-red-500/30 shadow-[inset_0_0_10px_rgba(239,68,68,0.1)]' 
                   : 'bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800/80'
               }`}
             >
               {log.type === 'target' ? (
                 <div className="w-16 h-16 bg-black rounded overflow-hidden flex-shrink-0 border border-red-500/30">
                   {log.thumbnail && <img src={log.thumbnail} alt="Evidence" className="w-full h-full object-cover" />}
                 </div>
               ) : (
                 <div className="w-16 h-16 bg-zinc-800 rounded flex items-center justify-center flex-shrink-0">
                   <Car className="h-6 w-6 text-zinc-600" />
                 </div>
               )}
               
               <div className="flex-1 min-w-0">
                 <div className="flex justify-between items-start mb-1">
                   <span className={`font-mono font-bold text-sm ${log.type === 'target' ? 'text-red-400' : 'text-white'}`}>
                     {log.plate}
                   </span>
                   <span className="text-[10px] text-zinc-500 font-mono">{log.time}</span>
                 </div>
                 <p className="text-xs text-zinc-400 truncate">{log.model} • {log.color}</p>
                 <p className="text-[10px] text-zinc-600 mt-1 flex items-center gap-1">
                    <AlertTriangle className={`h-3 w-3 ${log.type === 'target' ? 'text-red-500' : 'hidden'}`} />
                    {log.location}
                 </p>
               </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}

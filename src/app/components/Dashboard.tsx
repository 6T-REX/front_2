import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ShieldCheck, Car, Crosshair, Wifi, WifiOff } from 'lucide-react';

const data = [
  { time: '00:00', volume: 120 },
  { time: '04:00', volume: 80 },
  { time: '08:00', volume: 450 },
  { time: '12:00', volume: 680 },
  { time: '16:00', volume: 590 },
  { time: '20:00', volume: 300 },
  { time: '24:00', volume: 150 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Widgets */}
        <div className="bg-[#18181b]/60 backdrop-blur-sm border border-zinc-800 rounded-xl p-6 flex items-start justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Car className="h-24 w-24 text-cyan-400" />
          </div>
          <div>
            <p className="text-zinc-400 text-sm font-medium">Total Vehicles Today</p>
            <h3 className="text-3xl font-mono font-bold text-white mt-2">14,293</h3>
            <p className="text-xs text-green-400 mt-1 flex items-center">
              <span>+12% from yesterday</span>
            </p>
          </div>
          <div className="bg-cyan-500/10 p-3 rounded-lg border border-cyan-500/20">
            <Car className="h-6 w-6 text-cyan-400" />
          </div>
        </div>

        <div className="bg-[#18181b]/60 backdrop-blur-sm border border-zinc-800 rounded-xl p-6 flex items-start justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Crosshair className="h-24 w-24 text-red-500" />
          </div>
          <div>
            <p className="text-zinc-400 text-sm font-medium">Active Targets Tracked</p>
            <h3 className="text-3xl font-mono font-bold text-white mt-2">3</h3>
            <p className="text-xs text-red-400 mt-1 flex items-center">
              <span className="animate-pulse mr-1">●</span> Live tracking
            </p>
          </div>
          <div className="bg-red-500/10 p-3 rounded-lg border border-red-500/20">
            <Crosshair className="h-6 w-6 text-red-500" />
          </div>
        </div>

        <div className="bg-[#18181b]/60 backdrop-blur-sm border border-zinc-800 rounded-xl p-6 flex items-start justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ShieldCheck className="h-24 w-24 text-green-400" />
          </div>
          <div>
            <p className="text-zinc-400 text-sm font-medium">System Health</p>
            <h3 className="text-3xl font-mono font-bold text-white mt-2">98.2%</h3>
            <p className="text-xs text-zinc-500 mt-1">
              All systems operational
            </p>
          </div>
          <div className="bg-green-500/10 p-3 rounded-lg border border-green-500/20">
            <ShieldCheck className="h-6 w-6 text-green-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
        {/* Map */}
        <div className="lg:col-span-2 bg-[#18181b]/60 backdrop-blur-sm border border-zinc-800 rounded-xl p-1 flex flex-col relative overflow-hidden">
          <div className="absolute top-4 left-4 z-10 bg-[#0A0A0A]/90 backdrop-blur border border-zinc-800 p-2 rounded-lg">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Wifi className="h-4 w-4 text-green-400" /> Cam Network Map
            </h3>
          </div>
          
          {/* Simulated Map */}
          <div className="flex-1 bg-[#0f1012] relative rounded-lg overflow-hidden group">
            {/* Grid lines for map effect */}
            <div className="absolute inset-0" 
                 style={{ 
                   backgroundImage: 'linear-gradient(#1f1f22 1px, transparent 1px), linear-gradient(90deg, #1f1f22 1px, transparent 1px)',
                   backgroundSize: '40px 40px'
                 }}>
            </div>
            
            {/* Map Roads (Stylized) */}
            <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none">
               <path d="M100 0 V 600" stroke="#333" strokeWidth="8" fill="none" />
               <path d="M400 0 V 600" stroke="#333" strokeWidth="8" fill="none" />
               <path d="M0 200 H 1000" stroke="#333" strokeWidth="8" fill="none" />
               <path d="M0 400 H 1000" stroke="#333" strokeWidth="8" fill="none" />
               <circle cx="100" cy="200" r="20" fill="#222" />
               <circle cx="400" cy="400" r="20" fill="#222" />
            </svg>

            {/* Cameras */}
            {[
              { x: '20%', y: '30%', status: 'online', id: 'CAM-01' },
              { x: '50%', y: '60%', status: 'online', id: 'CAM-02' },
              { x: '80%', y: '25%', status: 'online', id: 'CAM-03' },
              { x: '35%', y: '80%', status: 'offline', id: 'CAM-04' },
              { x: '70%', y: '50%', status: 'online', id: 'CAM-05' },
            ].map((cam, i) => (
              <div 
                key={i}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group/cam"
                style={{ left: cam.x, top: cam.y }}
              >
                <div className="relative">
                   <div className={`h-4 w-4 rounded-full ${cam.status === 'online' ? 'bg-green-500' : 'bg-red-500'} shadow-[0_0_10px_currentColor] animate-pulse`}></div>
                   {cam.status === 'online' && (
                     <div className="absolute -inset-2 rounded-full border border-green-500/30 animate-ping"></div>
                   )}
                   <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/80 text-[10px] text-white px-2 py-0.5 rounded border border-zinc-800 whitespace-nowrap opacity-0 group-hover/cam:opacity-100 transition-opacity">
                     {cam.id} • {cam.status.toUpperCase()}
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="bg-[#18181b]/60 backdrop-blur-sm border border-zinc-800 rounded-xl p-6 flex flex-col">
          <h3 className="text-white font-medium mb-6 flex items-center justify-between">
            Traffic Volume
            <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">Last 24h</span>
          </h3>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  stroke="#52525b" 
                  tick={{fontSize: 12}} 
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#52525b" 
                  tick={{fontSize: 12}} 
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
                  itemStyle={{ color: '#22d3ee' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="volume" 
                  stroke="#22d3ee" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorVolume)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
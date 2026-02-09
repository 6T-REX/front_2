import React, { useState } from 'react';
import { Calendar, Search, Filter, Grid, List, Download, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

export default function History() {
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const historyData = [
    { id: 1, time: '2023-10-25 14:30:22', cam: 'CAM-01', plate: '12가3456', model: 'Hyundai Sonata', color: 'Silver', confidence: 98, type: 'target' },
    { id: 2, time: '2023-10-25 14:28:10', cam: 'CAM-02', plate: '55나1212', model: 'Kia K5', color: 'White', confidence: 95, type: 'normal' },
    { id: 3, time: '2023-10-25 14:25:05', cam: 'CAM-01', plate: '33다4444', model: 'BMW 520d', color: 'Black', confidence: 92, type: 'normal' },
    { id: 4, time: '2023-10-25 14:20:55', cam: 'CAM-03', plate: '88라9090', model: 'Genesis G80', color: 'Black', confidence: 99, type: 'normal' },
    { id: 5, time: '2023-10-25 14:15:30', cam: 'CAM-01', plate: '12가3456', model: 'Hyundai Sonata', color: 'Silver', confidence: 97, type: 'target' },
    { id: 6, time: '2023-10-25 14:10:12', cam: 'CAM-04', plate: '77마1234', model: 'Mercedes E-Class', color: 'Grey', confidence: 94, type: 'normal' },
    { id: 7, time: '2023-10-25 14:05:00', cam: 'CAM-02', plate: '11바5678', model: 'Audi A6', color: 'White', confidence: 91, type: 'normal' },
    { id: 8, time: '2023-10-25 14:00:45', cam: 'CAM-01', plate: '99사1234', model: 'Kia Sportage', color: 'Black', confidence: 89, type: 'target' },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="bg-[#18181b]/60 backdrop-blur-md border border-zinc-800 rounded-xl p-4">
        <div className="flex flex-col lg:flex-row justify-between gap-4 mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Search className="h-5 w-5 text-cyan-400" /> Detection History
          </h2>
          <div className="flex items-center gap-2">
             <button 
               onClick={() => setViewMode('table')}
               className={`p-2 rounded transition-colors ${viewMode === 'table' ? 'bg-cyan-500/20 text-cyan-400' : 'text-zinc-500 hover:text-white'}`}
             >
               <List className="h-4 w-4" />
             </button>
             <button 
               onClick={() => setViewMode('grid')}
               className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-cyan-500/20 text-cyan-400' : 'text-zinc-500 hover:text-white'}`}
             >
               <Grid className="h-4 w-4" />
             </button>
             <div className="h-4 w-px bg-zinc-700 mx-2"></div>
             <button className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs text-white rounded transition-colors border border-zinc-700">
               <Download className="h-3 w-3" /> Export CSV
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
             <input 
               type="text" 
               placeholder="Search License Plate..." 
               className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
             />
          </div>
          <div className="relative">
             <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
             <input 
               type="date" 
               className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 [&::-webkit-calendar-picker-indicator]:invert"
             />
          </div>
          <div className="relative">
             <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
             <select className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 appearance-none">
               <option value="">All Cameras</option>
               <option value="CAM-01">CAM-01 (Main)</option>
               <option value="CAM-02">CAM-02 (Exit)</option>
             </select>
          </div>
          <div className="relative">
             <div className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-white border border-zinc-500"></div>
             <select className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 appearance-none">
               <option value="">All Colors</option>
               <option value="Black">Black</option>
               <option value="White">White</option>
               <option value="Silver">Silver</option>
             </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-[#18181b]/60 backdrop-blur-md border border-zinc-800 rounded-xl overflow-hidden min-h-[500px]">
        {viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-900/50 text-xs text-zinc-400 uppercase tracking-wider border-b border-zinc-800">
                  <th className="p-4 font-medium">Timestamp</th>
                  <th className="p-4 font-medium">Camera ID</th>
                  <th className="p-4 font-medium">Plate Number</th>
                  <th className="p-4 font-medium">Model / Color</th>
                  <th className="p-4 font-medium">Confidence</th>
                  <th className="p-4 font-medium text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {historyData.map((item) => (
                  <tr key={item.id} className={`group hover:bg-zinc-800/30 transition-colors ${item.type === 'target' ? 'bg-red-500/5' : ''}`}>
                    <td className="p-4 text-sm text-zinc-400 font-mono">{item.time}</td>
                    <td className="p-4 text-sm text-zinc-300">{item.cam}</td>
                    <td className="p-4">
                      <span className={`font-mono font-bold ${item.type === 'target' ? 'text-red-400' : 'text-white'}`}>
                        {item.plate}
                      </span>
                      {item.type === 'target' && <span className="ml-2 text-[10px] bg-red-500 text-white px-1 py-0.5 rounded">ALERT</span>}
                    </td>
                    <td className="p-4 text-sm text-zinc-400">{item.model} <span className="text-zinc-600">•</span> {item.color}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${item.confidence > 90 ? 'bg-green-500' : 'bg-yellow-500'}`} 
                            style={{ width: `${item.confidence}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-zinc-400">{item.confidence}%</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                       <button className="text-cyan-400 hover:text-cyan-300 p-1">
                         <Eye className="h-4 w-4" />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {historyData.map((item) => (
              <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden group hover:border-cyan-500/50 transition-all">
                <div className="aspect-video bg-black relative">
                   <div className="absolute inset-0 flex items-center justify-center text-zinc-600">
                     <span className="text-xs">Image Preview</span>
                   </div>
                   {item.type === 'target' && (
                     <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">ALERT</div>
                   )}
                   <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <button className="px-3 py-1.5 bg-cyan-500 text-white text-xs rounded font-medium">View Full</button>
                   </div>
                </div>
                <div className="p-3">
                  <div className="flex justify-between items-start">
                    <span className={`font-mono font-bold text-sm ${item.type === 'target' ? 'text-red-400' : 'text-white'}`}>
                      {item.plate}
                    </span>
                    <span className="text-[10px] text-zinc-500">{item.time.split(' ')[1]}</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">{item.model} • {item.color}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Pagination */}
        <div className="p-4 border-t border-zinc-800 flex items-center justify-between">
          <span className="text-xs text-zinc-500">Showing 1-8 of 1,293 records</span>
          <div className="flex gap-1">
            <button className="p-1 rounded hover:bg-zinc-800 text-zinc-400"><ChevronLeft className="h-4 w-4" /></button>
            <button className="p-1 rounded hover:bg-zinc-800 text-zinc-400"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

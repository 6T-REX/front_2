import React, { useState } from 'react';
import { Upload, Plus, Search, Trash2, Edit2, ShieldAlert } from 'lucide-react';

export default function TargetRegistration() {
  const [activeTab, setActiveTab] = useState<'form' | 'list'>('form');

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white tracking-tight">Target Management</h2>
        <div className="flex space-x-2 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
          <button 
            onClick={() => setActiveTab('form')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${activeTab === 'form' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500 hover:text-white'}`}
          >
            Register New Target
          </button>
          <button 
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${activeTab === 'list' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500 hover:text-white'}`}
          >
            Watchlist Database
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-1">
           <div className="bg-[#18181b]/60 backdrop-blur-md border border-zinc-800 rounded-xl p-6">
             <div className="flex items-center gap-3 mb-6">
               <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/20">
                 <ShieldAlert className="h-6 w-6 text-red-500" />
               </div>
               <div>
                 <h3 className="text-lg font-medium text-white">Add to Watchlist</h3>
                 <p className="text-xs text-zinc-500">Register vehicle for instant alerts</p>
               </div>
             </div>

             <form className="space-y-4">
               <div>
                 <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">License Plate Number</label>
                 <input 
                   type="text" 
                   placeholder="e.g. 12가3456" 
                   className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono"
                 />
               </div>

               <div>
                 <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Vehicle Model</label>
                 <select className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 appearance-none">
                    <option>Select Model...</option>
                    <option>Hyundai Sonata</option>
                    <option>Kia K5</option>
                    <option>Mercedes E-Class</option>
                    <option>BMW 5 Series</option>
                    <option>Unknown</option>
                 </select>
               </div>

               <div>
                 <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Color</label>
                 <div className="flex gap-2">
                   {['#000000', '#ffffff', '#c0c0c0', '#1e40af', '#b91c1c'].map((color) => (
                     <button 
                       key={color} 
                       type="button"
                       className="w-8 h-8 rounded-full border-2 border-zinc-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50"
                       style={{ backgroundColor: color }}
                     ></button>
                   ))}
                 </div>
               </div>

               <div>
                 <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Owner Name (Optional)</label>
                 <input 
                   type="text" 
                   placeholder="John Doe" 
                   className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                 />
               </div>

               <div className="pt-2">
                 <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">Reference Image</label>
                 <div className="border-2 border-dashed border-zinc-700 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-zinc-800/50 hover:border-zinc-500 transition-colors">
                    <Upload className="h-8 w-8 text-zinc-500 mb-2" />
                    <p className="text-sm text-zinc-400">Click to upload or drag & drop</p>
                    <p className="text-xs text-zinc-600 mt-1">JPG, PNG up to 5MB</p>
                 </div>
               </div>

               <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-medium py-3 rounded-lg mt-4 transition-colors shadow-[0_0_20px_rgba(8,145,178,0.3)] flex items-center justify-center gap-2">
                 <Plus className="h-4 w-4" /> Add Target
               </button>
             </form>
           </div>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2">
          <div className="bg-[#18181b]/60 backdrop-blur-md border border-zinc-800 rounded-xl overflow-hidden flex flex-col h-full">
            <div className="p-4 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="font-bold text-white">Active Watchlist</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input 
                  type="text" 
                  placeholder="Search plates..." 
                  className="bg-zinc-900 border border-zinc-700 rounded-full pl-9 pr-4 py-1.5 text-sm text-white focus:outline-none focus:border-cyan-500 w-full sm:w-64"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-900/50 text-xs text-zinc-400 uppercase tracking-wider border-b border-zinc-800">
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Plate Number</th>
                    <th className="p-4 font-medium">Vehicle Info</th>
                    <th className="p-4 font-medium">Added By</th>
                    <th className="p-4 font-medium">Date Added</th>
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {[
                    { id: 1, plate: '12가3456', model: 'Hyundai Sonata', color: 'Silver', date: '2023-10-12', addedBy: 'Admin', status: 'Active' },
                    { id: 2, plate: '99사1234', model: 'Kia Sportage', color: 'Black', date: '2023-10-15', addedBy: 'Officer Kim', status: 'Active' },
                    { id: 3, plate: '33바9999', model: 'BMW X5', color: 'White', date: '2023-10-20', addedBy: 'System', status: 'Inactive' },
                  ].map((target) => (
                    <tr key={target.id} className="group hover:bg-zinc-800/30 transition-colors">
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${
                          target.status === 'Active' 
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                            : 'bg-zinc-700/30 text-zinc-400 border border-zinc-700'
                        }`}>
                          {target.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-mono font-bold text-white">{target.plate}</span>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-zinc-300">{target.model}</div>
                        <div className="text-xs text-zinc-500">{target.color}</div>
                      </td>
                      <td className="p-4 text-sm text-zinc-400">{target.addedBy}</td>
                      <td className="p-4 text-sm text-zinc-500">{target.date}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1.5 hover:bg-cyan-500/10 hover:text-cyan-400 rounded transition-colors">
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button className="p-1.5 hover:bg-red-500/10 hover:text-red-400 rounded transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

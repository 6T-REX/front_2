import React from 'react';
import { Bell, Cpu, Zap, User } from 'lucide-react';

export default function TopBar() {
  return (
    <header className="h-16 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-zinc-800 flex items-center justify-between px-6 z-10 sticky top-0">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2 text-zinc-400">
          <Cpu className="h-4 w-4" />
          <span className="text-xs font-mono">CPU: <span className="text-green-400">12%</span></span>
        </div>
        <div className="flex items-center space-x-2 text-zinc-400">
          <Zap className="h-4 w-4" />
          <span className="text-xs font-mono">GPU: <span className="text-green-400">34%</span></span>
        </div>
        <div className="flex items-center space-x-2 text-zinc-400">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs font-mono tracking-wider text-green-400">SYSTEM ONLINE</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-zinc-800">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border border-[#0A0A0A]"></span>
        </button>
        
        <div className="flex items-center space-x-3 pl-4 border-l border-zinc-800">
          <div className="text-right hidden md:block">
            <div className="text-sm font-medium text-white">Admin Officer</div>
            <div className="text-xs text-zinc-500">Security Level 5</div>
          </div>
          <div className="h-9 w-9 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
            <User className="h-5 w-5 text-zinc-400" />
          </div>
        </div>
      </div>
    </header>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { LayoutDashboard, Eye, Settings, Map, Network, ChevronLeft, ChevronRight, LogOut, User } from 'lucide-react';

function classNames(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: any) => void;
  isCollapsed: boolean;
  toggleSidebar: () => void;
  onLogout: () => void;
}

export default function Sidebar({ currentView, setCurrentView, isCollapsed, toggleSidebar, onLogout }: SidebarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const menuItems = [
    { id: 'overview', label: '도시 관제', icon: Map, description: '통합 현황판' },
    { id: 'investigation', label: 'AI 정밀 추적', icon: Network, description: '개별 추적' },
    { id: 'settings', label: '시스템 설정', icon: Settings, description: '환경 설정' },
  ];

  return (
    <div 
      className={classNames(
        "flex-shrink-0 bg-[#0F172A] border-r border-slate-800 flex flex-col z-20 shadow-xl relative transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Toggle Button */}
      <button 
        onClick={toggleSidebar}
        className="absolute -right-3 top-24 w-6 h-6 bg-slate-800 border border-slate-600 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-cyan-600 hover:border-cyan-500 transition-colors z-50 shadow-md"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Branding */}
      <div className={classNames(
        "h-20 flex items-center border-b border-slate-800/50 transition-all duration-300 overflow-hidden",
        isCollapsed ? "justify-center px-0" : "justify-start px-6"
      )}>
        <div className="relative flex-shrink-0">
          <div className="absolute inset-0 bg-cyan-500 blur-md opacity-20 rounded-full"></div>
          <Eye className="relative h-8 w-8 text-cyan-400" />
        </div>
        
        <div className={classNames(
          "ml-3 transition-all duration-300 whitespace-nowrap overflow-hidden",
          isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
        )}>
          <h1 className="font-bold text-lg text-white tracking-widest font-mono">NEURAL<span className="text-cyan-400">EYE</span></h1>
          <p className="text-[10px] text-slate-500 tracking-wider">교통 관제 AI</p>
        </div>
      </div>

      {/* Menu */}
      <div className="flex-1 py-8 space-y-4 px-3">
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={classNames(
                'w-full flex items-center p-3 rounded-xl transition-all duration-300 group relative overflow-hidden',
                isActive 
                  ? 'bg-gradient-to-r from-cyan-900/40 to-blue-900/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent',
                isCollapsed ? "justify-center" : "justify-start"
              )}
            >
              <item.icon 
                className={classNames(
                  "h-6 w-6 flex-shrink-0 transition-all duration-300",
                  isActive ? "text-cyan-400 scale-110 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" : "text-slate-500 group-hover:text-slate-200"
                )} 
              />
              
              <div className={classNames(
                "ml-4 text-left transition-all duration-300 overflow-hidden whitespace-nowrap",
                isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100 block"
              )}>
                <span className={classNames("block text-sm font-semibold tracking-wide", isActive ? "text-white" : "")}>
                  {item.label}
                </span>
                <span className="block text-[10px] text-slate-600 group-hover:text-slate-500 transition-colors">
                  {item.description}
                </span>
              </div>
              
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-cyan-400 rounded-r shadow-[0_0_10px_#06b6d4]"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer / User Menu */}
      <div className="p-4 border-t border-slate-800/50 bg-slate-900/30 overflow-visible relative" ref={menuRef}>
        
        {/* Dropdown Menu */}
        {showUserMenu && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 z-50">
            <button 
              onClick={() => {
                setCurrentView('settings');
                setShowUserMenu(false);
              }}
              className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-3 transition-colors"
            >
              <User size={16} /> 내 정보 확인
            </button>
            <div className="h-px bg-slate-700 mx-2"></div>
            <button 
              onClick={onLogout}
              className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center gap-3 transition-colors"
            >
              <LogOut size={16} /> 로그아웃
            </button>
          </div>
        )}

        <button 
          onClick={() => setShowUserMenu(!showUserMenu)}
          className={classNames(
            "flex items-center gap-3 transition-all duration-300 w-full hover:bg-slate-800/50 rounded-lg p-2 -ml-2",
             isCollapsed ? "justify-center" : "justify-start"
          )}
        >
          <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-lg relative">
            A
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-slate-900 rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <div className={classNames(
            "transition-all duration-300 whitespace-nowrap overflow-hidden text-left",
            isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
          )}>
            <div className="text-xs font-bold text-slate-200">관리자</div>
            <div className="text-[10px] text-green-400">
              접속 중
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

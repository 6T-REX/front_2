import React, { useState } from 'react';
import { Eye, ArrowRight, Lock, User } from 'lucide-react';

interface LoginProps {
  onLogin: (userRole: 'user' | 'admin', userName: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    let userRole: 'user' | 'admin' = 'user';
    let userName = '김가네';

    const idLower = id.toLowerCase();
    if (idLower === 'admin0') {
      userRole = 'admin';
      userName = '김인경';
    } else if (idLower === 'admin1') {
      userRole = 'admin';
      userName = '강창우';
    } else if (idLower === 'admin2') {
      userRole = 'admin';
      userName = '박승수';
    } else if (idLower === 'admin') {
      userRole = 'admin';
      userName = '김인경';
    } else if (idLower === 'user') {
      userRole = 'user';
      userName = '김가네';
    }

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onLogin(userRole, userName);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full bg-[#0F172A] flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519608487953-e999c86e7455?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/80 to-transparent"></div>
      
      {/* Animated Particles/Grid (Simulated) */}
      <div className="absolute inset-0 opacity-20" 
           style={{ backgroundImage: 'linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)', backgroundSize: '50px 50px' }}>
      </div>

      <div className="relative z-10 w-full max-w-md p-8">
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-8 transform transition-all hover:scale-[1.01] duration-500">
          
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-6 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Eye className="w-8 h-8 text-cyan-400" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-widest font-mono mb-2">NEURAL<span className="text-cyan-400">EYE</span></h1>
            <p className="text-slate-400 text-sm tracking-wide">교통 관제 시스템 보안 접속</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider ml-1">아이디</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                <input 
                  type="text" 
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                  placeholder="admin"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider ml-1">비밀번호</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full mt-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-900/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-1"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  시스템 접속 <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-[10px] text-slate-500">
              승인된 관계자 외 접속을 금합니다.<br/>
              접속 IP는 보안을 위해 기록됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

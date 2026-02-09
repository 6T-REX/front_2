import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import CityOverview from "./components/CityOverview";
import AIInvestigation from "./components/AIInvestigation";
import Login from "./components/Login";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<
    "overview" | "investigation" | "settings"
  >("overview");
  const [isSidebarCollapsed, setIsSidebarCollapsed] =
    useState(false);

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="flex h-screen bg-[#0F172A] text-white font-sans overflow-hidden">
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={() =>
          setIsSidebarCollapsed(!isSidebarCollapsed)
        }
        onLogout={() => setIsLoggedIn(false)}
      />

      <main className="flex-1 relative overflow-hidden transition-all duration-300">
        {currentView === "overview" && <CityOverview />}
        {currentView === "investigation" && <AIInvestigation />}
        {currentView === "settings" && (
          <div className="h-full flex flex-col items-center justify-center bg-[#0F172A] relative overflow-hidden">
            <div
              className="absolute inset-0 bg-cover opacity-10"
              style={{
                backgroundImage:
                  'url("https://images.unsplash.com/photo-1575388902449-6bca946ad549?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080")',
              }}
            ></div>
            <div className="z-10 text-center p-8 bg-slate-900/50 backdrop-blur-xl border border-slate-700 rounded-2xl max-w-md">
              <h2 className="text-2xl font-bold text-white mb-2">
                시스템 설정
              </h2>
              <p className="text-slate-400 mb-6">
                설정 패널 접근에는 관리자 권한이 필요합니다.
              </p>
              <div className="flex gap-2 justify-center">
                <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded border border-slate-600 transition-colors">
                  문서 보기
                </button>
                <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded shadow-lg transition-colors">
                  고객 지원 문의
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import CityOverview from "./components/CityOverview";
import AIInvestigation from "./components/AIInvestigation";
import { SystemSettings } from "./components/system-settings";
import Login from "./components/Login";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<"user" | "admin">("user");
  const [userName, setUserName] = useState<string>("김가네");
  const [currentView, setCurrentView] = useState<
    "overview" | "investigation" | "settings"
  >("overview");
  const [isSidebarCollapsed, setIsSidebarCollapsed] =
    useState(false);

  if (!isLoggedIn) {
    return (
      <Login
        onLogin={(role, name) => {
          setUserRole(role);
          setUserName(name);
          setIsLoggedIn(true);
        }}
      />
    );
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
        onLogout={() => {
          setIsLoggedIn(false);
          setUserRole("user");
          setUserName("김가네");
        }}
        userName={userName}
        userRole={userRole}
      />

      <main className="flex-1 relative overflow-hidden transition-all duration-300">
        {currentView === "overview" && <CityOverview />}
        {currentView === "investigation" && <AIInvestigation />}
        {currentView === "settings" && (
          <SystemSettings userRole={userRole} userName={userName} />
        )}
      </main>
    </div>
  );
}
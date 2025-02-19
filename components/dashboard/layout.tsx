"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { ChartBar, FileStack, FileUp, LayoutGrid, Menu } from "lucide-react";
import DashboardHeader from "./dash-header";
import DocumentUpload from "@/components/dashboard/sections/file-upload";
import HistoryContent from "@/components/dashboard/sections/history-content";
import ProductivityTools from "./sections/productivity-tools";
import DashboardComp from "./sections/dashboard";

interface DashboardCompProps {
  user: User;
  signOut: () => void;
}

export default function MainLayout({ user, signOut }: DashboardCompProps) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const TabButton = ({ 
    icon: Icon, 
    label, 
    tabName 
  }: { 
    icon: any, 
    label: string, 
    tabName: string 
  }) => (
    <button
      onClick={() => handleTabClick(tabName)}
      className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-3 ${
        activeTab === tabName
          ? "bg-indigo-50 text-indigo-600"
          : "text-gray-600 hover:bg-gray-50"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="relative min-h-screen bg-gray-50">
      <div
        className={`fixed top-0 left-0 h-full w-64 z-40 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } bg-white shadow-lg pt-16 border-r border-gray-100`}
      >
        <nav className="flex flex-col p-4 space-y-2">
          <TabButton icon={LayoutGrid} label="Dashboard" tabName="dashboard" />
          <TabButton icon={FileUp} label="Syllabus Upload" tabName="upload" />
          <TabButton icon={ChartBar} label="Productivity Tools" tabName="productivity" />
          <TabButton icon={FileStack} label="History" tabName="history" />
        </nav>

        {!user.app_metadata.providers.includes("google") && (
          <div className="absolute bottom-4 left-4 right-4 space-y-4">
            <div className="p-4 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
              <h3 className="text-sm font-medium">Sync Google Account</h3>
              <p className="mt-1 text-xs opacity-90">
                Your Google account is not connected. Sync your account to
                enable add to calendar feature.
              </p>
              <button
                onClick={() => router.push("/sign-in?reauth=true")}
                className="mt-2 w-full px-3 py-1.5 text-sm font-medium bg-white text-indigo-600 rounded-md hover:bg-gray-50 transition-colors"
              >
                Sync Account
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="min-h-screen pb-20 md:pb-0">
        <DashboardHeader user={user} signOut={signOut} />
        <main className="pt-20">
          {activeTab === "dashboard" && (
            <div className={`transition-all duration-300 ${isSidebarOpen ? "md:pl-64" : "md:pl-0"}`}>
              <DashboardComp isSidebarOpen={isSidebarOpen} />
            </div>
          )}
          {activeTab === "upload" && (
            <DocumentUpload
              isSidebarOpen={isSidebarOpen}
              userAuthGoogle={user.app_metadata.providers.includes("google")}
            />
          )}
          {activeTab === "productivity" && (
            <div className={`transition-all duration-300 ${isSidebarOpen ? "md:pl-64" : "md:pl-0"}`}>
              <ProductivityTools isSidebarOpen={isSidebarOpen} />
            </div>
          )}
          {activeTab === "history" && (
            <div className={`transition-all duration-300 ${isSidebarOpen ? "md:pl-64" : "md:pl-0"}`}>
              <HistoryContent isSidebarOpen={isSidebarOpen} />
            </div>
          )}
        </main>
      </div>

      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed bottom-8 right-4 md:hidden p-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
        aria-label="Toggle Sidebar"
      >
        <Menu className="w-6 h-6" />
      </button>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
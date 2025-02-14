"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { Menu } from "lucide-react";
import DashboardHeader from "./dash-header";
import DocumentUpload from "./file-upload";
import HistoryContent from "./history-content";

interface DashboardCompProps {
  user: User;
  signOut: () => void;
}

export default function DashboardComp({ user, signOut }: DashboardCompProps) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("upload");
  const [isMobile, setIsMobile] = useState(false);

  // Handle window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is the md breakpoint in Tailwind
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };

    // Check initial size
    checkMobile();

    // Add resize listener
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    // Only close sidebar on mobile
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const handleAddToGoogleCalendar = async () => {
    try {
      const response = await fetch("/add-to-calendar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ assignments: [] }),
      });

      const contentType = response.headers.get("Content-Type");

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        console.log(data);
      } else {
        router.push("/sign-in?reauth=true");
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 z-40 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } bg-white shadow-lg pt-16 border-r border-gray-100`}
      >
        <nav className="flex flex-col p-4 space-y-2">
          <button
            onClick={() => handleTabClick("upload")}
            className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "upload"
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => {
              handleTabClick("history");
              handleAddToGoogleCalendar();
            }}
            className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${
              activeTab === "history"
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span>History</span>
          </button>
        </nav>

        {/* Google Sign in Card */}
        {!user.app_metadata.providers.includes("google") && (
          <div className="absolute bottom-4 left-4 right-4 space-y-4">
            <div className="p-4 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
              <h3 className="text-sm font-medium">Sync Google Account</h3>
              <p className="mt-1 text-xs opacity-90">
                Your Google account is not connected. Sync your account to
                enable add to calendar feature.
              </p>
              <button
                onClick={() => {
                  router.push("/sign-in?reauth=true");
                }}
                className="mt-2 w-full px-3 py-1.5 text-sm font-medium bg-white text-indigo-600 rounded-md hover:bg-gray-50 transition-colors"
              >
                Sync Account
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="min-h-screen pb-20 md:pb-0">
        <DashboardHeader user={user} signOut={signOut} />
        <main className="pt-20">
          {activeTab === "upload" && (
            <DocumentUpload isSidebarOpen={isSidebarOpen} />
          )}
          {activeTab === "history" && (
            <div
              className={`transition-all duration-300 ${
                isSidebarOpen ? "md:pl-64" : "md:pl-0"
              }`}
            >
              <HistoryContent isSidebarOpen={isSidebarOpen} />
            </div>
          )}
        </main>
      </div>

      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed bottom-8 right-4 md:hidden p-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
        aria-label="Toggle Sidebar"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Backdrop */}
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
"use client";

import { User } from "@supabase/supabase-js";
import { LogOut, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

interface DashboardHeaderProps {
  user: User;
  signOut: () => void;
}

export default function DashboardHeader({
  user,
  signOut,
}: DashboardHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const customerPortalLink: string =
    "https://billing.stripe.com/p/login/test_4gw0039xSc0Kdzy5kk";

  // Handle clicks outside of the dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      {/* Header */}
      <header className="fixed w-full top-0 z-[50] backdrop-blur-lg bg-white/30 border-b border-gray-200">
        <div className="px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center space-x-2">
                <Image
                  src={"/logo.png"}
                  alt="todue-logo"
                  width={28}
                  height={28}
                  className="rounded-lg"
                />
                <span className="text-lg md:text-xl font-bold text-indigo-600">
                  Todue
                </span>
              </div>
            </Link>

            {/* Right side controls */}
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => {
                    setIsDropdownOpen(!isDropdownOpen);
                  }}
                  className="flex items-center space-x-2"
                >
                  <div className="relative h-8 w-8">
                    <Image
                      src={user?.user_metadata.avatar_url || "/placeholder-profile.svg"}
                      alt={"Profile"}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-700">
                    {user?.user_metadata.full_name || user?.email}
                  </span>
                </button>

                <div 
                  className={`absolute right-0 mt-2 w-48 py-2 bg-white rounded-xl shadow-lg border border-gray-200 transform transition-all duration-200 ease-in-out ${
                    isDropdownOpen 
                      ? "opacity-100 translate-y-0" 
                      : "opacity-0 translate-y-2 pointer-events-none"
                  }`}
                >
                  <Link
                    href={
                      customerPortalLink + "?prefilled_email=" + user?.email
                    }
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                  >
                    <Settings size={16} className="mr-2" />
                    Billing
                  </Link>
                  <button
                    onClick={signOut}
                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors duration-150"
                  >
                    <LogOut size={16} className="mr-2" />
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
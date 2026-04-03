"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Activity,
  LayoutDashboard,
  LineChart,
  Github,
  Linkedin,
  UserCircle,
  Settings,
  LogOut
} from 'lucide-react';
import { LimelightNav, NavItem } from "@/components/ui/limelight-nav";
import SkyToggle from "@/components/ui/sky-toggle";

const allNavItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Resume', href: '/resume', icon: LineChart },
  { name: 'LinkedIn', href: '/LinkedIn', icon: LayoutDashboard }, 
  { name: 'Github', href: '/github', icon: LayoutDashboard },
  { name: 'Portfolio', href: '/portfolio', icon: UserCircle }
];

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  // --- Dropdown State & Logic ---
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 1. Defined all items for the specific pages of your project
  const allNavItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Resume', href: '/resume', icon: LineChart },
    { name: 'LinkedIn', href: '/linkedin', icon: Linkedin },
    { name: 'Github', href: '/github', icon: Github },
    { name: 'Portfolio', href: '/portfolio', icon: UserCircle }
  ];

  // 2. Map items directly for the Limelight component
  const navItemsForLimelight: NavItem[] = useMemo(() => {
    return allNavItems.map(item => ({
      id: item.href,
      label: item.name,
      icon: <item.icon size={18} />,
      onClick: () => router.push(item.href)
    }));
  }, [router]);

  const activeIndex = useMemo(() => {
    const index = navItemsForLimelight.findIndex(item => item.id === pathname);
    return index !== -1 ? index : 0;
  }, [pathname, navItemsForLimelight]);

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 dark:bg-black/90 backdrop-blur-xl text-foreground border-b border-border dark:border-white/5 transition-all duration-500">
      <div className="max-w-[1600px] mx-auto px-8">
        <div className="flex items-center justify-between h-20">

          {/* LEFT: Branding */}
          <div
            className="flex items-center gap-4 pr-8 border-r border-border dark:border-white/10 group cursor-pointer"
            onClick={() => router.push('/dashboard')}
          >
            <div className="p-2 bg-indigo-600 rounded-lg shadow-[0_0_15px_rgba(79,70,229,0.3)] group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tighter uppercase italic leading-none text-foreground">
                Axiom.io <span className="text-indigo-600 dark:text-indigo-400">ID</span>
              </span>
              <span className="text-[9px] text-indigo-600 font-bold tracking-[0.3em] uppercase mt-1">
                Audit Engine v1.0
              </span>
            </div>
          </div>

          {/* CENTER: Limelight Navigation */}
          <div className="hidden xl:flex flex-1 justify-center px-4">
            <LimelightNav
              items={navItemsForLimelight}
              defaultActiveIndex={activeIndex}
              className="bg-transparent border-none h-20 text-slate-800 dark:text-slate-400 font-bold"
              limelightClassName="bg-indigo-600 dark:bg-indigo-500 shadow-[0_0_20px_#6366f1]"
              iconClassName="w-4 h-4"
            />
          </div>

          {/* RIGHT: Theme Toggle & Profile Dropdown */}
          <div className="flex items-center gap-6 pl-8 border-l border-border dark:border-white/10">

            <div className="hidden sm:block scale-75 transform-gpu origin-right">
              <SkyToggle />
            </div>

            {/* Profile Dropdown Menu */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 dark:text-indigo-400 hover:bg-indigo-500/20 cursor-pointer transition-all"
              >
                <UserCircle size={20} />
              </button>

              {/* The Dropdown Card */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-zinc-900 border border-border dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-border dark:border-white/5">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Signed in as</p>
                    <p className="text-sm text-foreground font-bold truncate">Developer</p>
                  </div>

                  <div className="p-2 space-y-1">
                    {/* Link to Settings Page */}
                    <Link
                      href="/settings"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-slate-600 dark:text-zinc-300 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors group"
                    >
                      <Settings size={16} className="text-slate-400 dark:text-zinc-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors" />
                      Update Profile
                    </Link>

                    <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors group">
                      <LogOut size={16} className="text-red-400 dark:text-red-500/70 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
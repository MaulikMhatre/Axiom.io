"use client";

import React, { useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { 
  Activity, 
  LayoutDashboard, 
  LineChart, 
  Github, 
  Linkedin, 
  UserCircle 
} from 'lucide-react';
import { LimelightNav, NavItem } from "@/components/ui/limelight-nav";
import SkyToggle from "@/components/ui/sky-toggle";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();

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

  // 3. Track which page is currently active for the "glow" effect
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
                Phronex <span className="text-indigo-600 dark:text-indigo-400">ID</span>
              </span>
              <span className="text-[9px] text-indigo-600 font-bold tracking-[0.3em] uppercase mt-1">
                Audit Engine v1.0
              </span>
            </div>
          </div>

          {/* CENTER: Limelight Navigation (The Glowy Bar) */}
          <div className="hidden xl:flex flex-1 justify-center px-4">
            <LimelightNav 
              items={navItemsForLimelight}
              defaultActiveIndex={activeIndex}
              className="bg-transparent border-none h-20 text-slate-800 dark:text-slate-400 font-bold" 
              limelightClassName="bg-indigo-600 dark:bg-indigo-500 shadow-[0_0_20px_#6366f1]"
              iconClassName="w-4 h-4"
            />
          </div>

          {/* RIGHT: Theme Toggle & Profile Placeholder */}
          <div className="flex items-center gap-6 pl-8 border-l border-border dark:border-white/10">
            
            <div className="hidden sm:block scale-75 transform-gpu origin-right">
              <SkyToggle />
            </div>

            {/* Profile Avatar Placeholder (Replaces Logout) */}
            <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 hover:bg-indigo-500/20 cursor-pointer transition-all">
              <UserCircle size={20} />
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
// @ts-nocheck

"use client";

import React, { useEffect, useState } from "react";
import {
  Home,
  Users,
  Pickaxe,
  DollarSign,
  ChartColumnDecreasing,
  MessageCircle,
  Bell,
  School,
  CalendarDays,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useSelector } from "react-redux";
import { Badge } from "./ui/badge";
import toast from "react-hot-toast";
import Image from "next/image";

// Menu configuration
const adminMenu = [
  { name: "Dashboard", icon: Home, href: "/finance/dashboard" },
  { name: "Projects", icon: Pickaxe, href: "/finance/projects" },
  { name: "Finances", icon: DollarSign, href: "/finance/finances" },
  { name: "Report", icon: ChartColumnDecreasing, href: "/finance/report" },
  {
    name: "Message",
    icon: MessageCircle,
    href: "/finance/message",
    count: true,
  },
];

export default function FinanceSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const pathname = usePathname();
  const router = useRouter();

  const userData = useSelector((state: any) => state.user);
  let countryCode = userData?.code?.toLowerCase() || "us";

  const fetchMessageCount = async () => {
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/messages/count`
      );
      setMessageCount(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchMessageCount();
  }, []);

  const handleLogout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const logout = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/logout`
      );

      if (logout.status) {
        router.push("/auth/login");
        toast.success("Logout success");
      }
    } catch (error) {
      toast.error("Logout Fail");
    }
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-[#FFF5E6] backdrop-blur-md border-b px-4 py-3 sticky top-0 z-50">
        <h1 className="text-lg font-semibold text-[#4A2C2A]">
          Finance
        </h1>
        <button
          className="p-2 rounded-lg bg-[#FFEDD5] hover:bg-[#FFD6A1]"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 md:w-72 bg-[#FF6F00] text-white border-r shadow-xl flex flex-col transition-transform duration-200 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="px-4 py-5 border-b border-white/20 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 text-white flex items-center justify-center rounded-xl">
            <Image
              src={`https://flagcdn.com/w160/${countryCode}.png`}
              height={23}
              width={23}
              alt="Country Flag"
              className="object-fit"
            />
          </div>

          <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-white">Finance</h2>
            <p className="text-xs text-white/80">Fund & Assets</p>
            <Badge className="bg-white/20 text-white border-white/30">
              {userData.countryName}
            </Badge>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin scrollbar-thumb-white/30">
          {adminMenu.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-150",
                  active
                    ? "bg-gradient-to-r from-[#FFD180] to-[#FFD180] text-black shadow-lg"
                    : "text-white/90 hover:bg-[#FF8F33]"
                )}
              >
                <Icon size={18} />
                {item.name}

                {item.count && messageCount > 0 ? (
                  <div className="relative left-20">
                    <p className="bg-white absolute rounded-full w-4 h-4 flex items-center justify-center text-black border border-red-500">
                      {messageCount}
                    </p>
                    <Bell size={22} color="white" className="opacity-90" />
                  </div>
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/20 px-4 py-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-white/90 hover:text-white transition-colors text-sm font-medium w-full"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm md:hidden z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

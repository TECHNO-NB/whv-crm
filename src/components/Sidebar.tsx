// @ts-nocheck

"use client";

import React, { useEffect, useState } from "react";
import {
  Home,
  Building,
  Truck,
  Wrench,
  CalendarDays,
  ClipboardList,
  Package,
  FileText,
  PhoneCall,
  Settings,
  LogOut,
  Menu,
  X,
  Users,
  Pickaxe,
  DollarSign,
  ChartColumnDecreasing,
  MessageCircle,
  Bell,
  School,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import axios from "axios";

// ✅ Admin-specific menu configuration
const adminMenu = [
  { name: "Dashboard", icon: Home, href: "/admin/dashboard" },
  { name: "Users", icon: Users, href: "/admin/users" },
  { name: "Projects", icon: Pickaxe, href: "/admin/projects" },
  { name: "Finances", icon: DollarSign, href: "/admin/finances" },
  { name: "Report", icon: ChartColumnDecreasing, href: "/admin/report" },
  { name: "Message", icon: MessageCircle, href: "/admin/message", count: true },
  { name: "Notification", icon: Bell, href: "/admin/notification" },
  { name: "School", icon: School, href: "/admin/school" },

  // 📅 Event & Meeting Management
  { name: "Events & Meetings", icon: CalendarDays, href: "/admin/events" },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const pathname = usePathname();

  // ✅ Fixed role (Admin only)
  const currentRole = "admin";

  const fetchMessageCount = async () => {
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/messages/count`
      );
      setMessageCount(res.data.data);
      console.log(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchMessageCount();
  }, []);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-white/80 backdrop-blur-md border-b px-4 py-3 sticky top-0 z-50">
        <h1 className="text-lg font-semibold text-gray-800">Admin Dashboard</h1>
        <button
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 md:w-72 bg-white dark:bg-gray-900 border-r shadow-md flex flex-col transition-transform duration-200 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="px-4 py-5 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-xl font-bold text-lg">
            A
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Admin Manager
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Infrastructure & Assets
            </p>
          </div>
          <div className="ml-auto font-semibold text-sm bg-blue-600 px-2 py-0 text-white border-2 rounded-2xl">
            ADMIN
          </div>
        </div>

        {/* Scrollable Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
          {adminMenu.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex w-full items-center relative gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-150",
                  active
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                )}
              >
                <Icon size={18} />
                {item.name}

                {item.count && messageCount > 0 ? (
                  <div className=" relative left-20">
                    <p className="bg-white absolute rounded-full w-4 h-4 text-center flex items-center justify-center text-black border border-red-500">
                      {messageCount}
                    </p>
                    <Bell color="red" fill="red" size={25} className="" />
                  </div>
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-100 dark:border-gray-800 px-4 py-4 flex-shrink-0">
          <button className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-red-600 transition-colors text-sm font-medium w-full">
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

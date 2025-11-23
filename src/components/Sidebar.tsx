// @ts-nocheck

"use client";

import React, { useEffect, useState } from "react";
import {
  Home,
  Users,
  Pickaxe,
  DollarSign,
  ChartColumnDecreasing,
  BanknoteArrowDown,
  MessageCircle,
  Bell,
  School,
  CalendarDays,
  TicketsPlane,
  Scale,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import axios from "axios";
import toast from "react-hot-toast";
import Image from "next/image";
import { useSelector } from "react-redux";

// Sidebar menu items
const adminMenu = [
  { name: "Dashboard", icon: Home, href: "/admin/dashboard" },
  { name: "Users", icon: Users, href: "/admin/users" },
  { name: "Projects", icon: Pickaxe, href: "/admin/projects" },
  { name: "Finances", icon: DollarSign, href: "/admin/finances" },
  { name: "Report", icon: ChartColumnDecreasing, href: "/admin/report" },
  { name: "Message", icon: MessageCircle, href: "/admin/message", count: true },
  { name: "Notification", icon: Bell, href: "/admin/notification" },
  { name: "School", icon: School, href: "/admin/school" },
  { name: "Events & Meetings", icon: CalendarDays, href: "/admin/events" },
  {
    name: "Projects Review",
    icon: Pickaxe,
    href: "/admin/project-approved",
  },
  {
    name: "Expense Review",
    icon: BanknoteArrowDown,
    href: "/admin/expense-review",
  },
  {
    name: "Tickets",
    icon: TicketsPlane,
    href: "/admin/tickets",
  },
  {
    name: "Legal",
    icon: Scale,
    href: "/admin/legal",
  },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const pathname = usePathname();
  const router = useRouter();

  const { code } = useSelector((state: any) => state.user);
  let countryCode = code?.toLowerCase() || "us";

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
      <div className="md:hidden flex items-center justify-between bg-[#FFF7EE] border-b px-4 py-3 sticky top-0 z-50">
        <h1 className="text-lg font-semibold text-gray-800">Admin Dashboard</h1>
        <button
          className="p-2 rounded-lg bg-orange-100 hover:bg-orange-200"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 md:w-72 bg-gradient-to-b from-[#FF8A00] to-[#E65100] text-white shadow-xl flex flex-col transition-transform duration-200 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="px-4 py-5 border-b border-white/20 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 flex items-center justify-center rounded-xl">
            <Image
              src={`https://flagcdn.com/w160/${countryCode}.png`}
              height={25}
              width={25}
              alt="Country Flag"
              className="rounded-md object-cover"
            />
          </div>

          <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-white">
              Admin Manager
            </h2>
            <p className="text-xs text-white/80">Infrastructure & Assets</p>
          </div>

          <div className="ml-auto font-semibold text-xs bg-[#FFE0B2] text-black px-2 py-0.5 rounded-xl">
            ADMIN
          </div>
        </div>

        {/* Scrollable Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {adminMenu.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-all",
                  active
                    ? "bg-[#FFD180] text-black shadow-md"
                    : "text-white hover:bg-white/20"
                )}
              >
                <Icon size={18} />
                {item.name}

                {item.count && messageCount > 0 ? (
                  <span className="ml-auto flex items-center gap-2">
                    <span className="bg-white text-black rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold border border-orange-700">
                      {messageCount}
                    </span>
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/20 px-4 py-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-white hover:text-[#FF5722] w-full transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm md:hidden z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

// @ts-nocheck
"use client";
import React, { useEffect, useState } from "react";
import {
  Plus,
  Briefcase,
  FileText,
  Mail,
  Users,
  BarChart4,
  Mailbox,
  CheckCircle,
  MessageCircle,
  Calendar,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import Link from "next/link";
import axios from "axios";

// --- Mock Data ---
const recentActivity = [
  {
    id: 1,
    type: "project",
    title: 'New project "Temple Construction - Mumbai" created',
    description: "Project initiated with budget allocation of $50,000",
    user: "Rajesh Kumar",
    time: "30m ago",
    icon: Briefcase,
    iconColor: "text-orange-500",
  },
  {
    id: 2,
    type: "approval",
    title: "Expense report approved",
    description: "Monthly operational expenses for Delhi center - $3,200",
    user: "Priya Sharma",
    time: "1h ago",
    icon: CheckCircle,
    iconColor: "text-green-500",
  },
  {
    id: 3,
    type: "communication",
    title: "Newsletter sent to 15,000 subscribers",
    description: "Monthly spiritual guidance newsletter distributed globally",
    user: "Amit Patel",
    time: "2h ago",
    icon: Mailbox,
    iconColor: "text-yellow-500",
  },
];

const events = [
  {
    id: 1,
    title: "Meditation Workshop",
    description: "Guided meditation for all volunteers",
    startAt: "2025-11-25T10:00:00Z",
    location: "Main Hall - Mumbai Center",
  },
  {
    id: 2,
    title: "Annual Fundraising Gala",
    description: "Fundraising dinner and silent auction",
    startAt: "2025-12-01T18:30:00Z",
    location: "Convention Center, Delhi",
  },
  {
    id: 3,
    title: "Yoga Retreat",
    description: "Weekend yoga retreat for staff and volunteers",
    startAt: "2025-12-15T08:00:00Z",
    location: "Goa Beach Resort",
  },
];

// --- Quick Actions ---
const quickActions = {
  admin: [
    {
      name: "Create Project",
      icon: Plus,
      color: "bg-orange-500",
      link: "/admin/projects",
    },
    {
      name: "Add Donation",
      icon: Users,
      color: "bg-green-500",
      link: "/admin/finances",
    },
    {
      name: "Report",
      icon: FileText,
      color: "bg-blue-500",
      link: "/admin/report",
    },
    {
      name: "Manage Expenses",
      icon: Briefcase,
      color: "bg-purple-500",
      link: "/admin/finances",
    },
    {
      name: "Send Messages",
      icon: Mail,
      color: "bg-yellow-500",
      link: "/admin/message",
    },
    {
      name: "View Finances",
      icon: BarChart4,
      color: "bg-red-500",
      link: "/admin/finances",
    },
  ],
  country_manager: [
    {
      name: "Create Project",
      icon: Plus,
      color: "bg-orange-500",
      link: "/manager/projects",
    },
    {
      name: "Add Donation",
      icon: Users,
      color: "bg-green-500",
      link: "/manager/finances",
    },
    {
      name: "Report",
      icon: FileText,
      color: "bg-blue-500",
      link: "/manager/report",
    },
    {
      name: "Manage Expenses",
      icon: Briefcase,
      color: "bg-purple-500",
      link: "/manager/finances",
    },
    {
      name: "Send Messages",
      icon: Mail,
      color: "bg-yellow-500",
      link: "/manager/message",
    },
    {
      name: "View Finances",
      icon: BarChart4,
      color: "bg-red-500",
      link: "/manager/finances",
    },
  ],
  it: [
    {
      name: "Send Messages",
      icon: Mail,
      color: "bg-yellow-500",
      link: "/IT/message",
    },
    {
      name: "Tickets",
      icon: BarChart4,
      color: "bg-red-500",
      link: "/IT/tickets",
    },
  ],
  hr: [
    { name: "USer", icon: Users, color: "bg-green-500", link: "/HR/users" },
    {
      name: "Events",
      icon: FileText,
      color: "bg-blue-500",
      link: "/HR/events",
    },
    {
      name: "Send Messages",
      icon: Mail,
      color: "bg-yellow-500",
      link: "/HR/message",
    },
  ],
  legal: [
    {
      name: "Legal",
      icon: FileText,
      color: "bg-blue-500",
      link: "/legal/legal",
    },

    {
      name: "Send Messages",
      icon: Mail,
      color: "bg-yellow-500",
      link: "/legal/message",
    },
  ],
  finance: [
    {
      name: "Create Project",
      icon: Plus,
      color: "bg-orange-500",
      link: "/finance/projects",
    },
    {
      name: "Add Donation",
      icon: Users,
      color: "bg-green-500",
      link: "/finance/finances",
    },
    {
      name: "Report",
      icon: FileText,
      color: "bg-blue-500",
      link: "/finance/report",
    },
    {
      name: "Manage Expenses",
      icon: Briefcase,
      color: "bg-purple-500",
      link: "/finance/finances",
    },
    {
      name: "Send Messages",
      icon: Mail,
      color: "bg-yellow-500",
      link: "/finance/message",
    },
    {
      name: "View Finances",
      icon: BarChart4,
      color: "bg-red-500",
      link: "/finance/finances",
    },
  ],
  volunteer: [
    {
      name: "Send Messages",
      icon: Mail,
      color: "bg-yellow-500",
      link: "/volunteer/message",
    },
  ],
};

// --- Utility Components ---
const UserInfo = ({ user, time }: { user: string; time: string }) => (
  <div className="flex items-center text-xs text-gray-500 mt-1">
    {user && (
      <div className="flex items-center mr-3">
        <div className="w-4 h-4 rounded-full bg-gray-300 mr-1 flex items-center justify-center text-[10px] text-gray-700 font-semibold">
          {user[0]}
        </div>
        {user}
      </div>
    )}
    <span>{time}</span>
  </div>
);

const QuickActionButton = ({ name, icon: Icon, color, link }: any) => (
  <Link href={link || "#"} className="w-full">
    <Button
      variant="outline"
      className="flex flex-col items-center justify-center h-24 w-full p-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow"
    >
      <Icon className={`w-6 h-6 mb-1 ${color.replace("bg", "text")}`} />
      <span className="text-xs font-semibold text-gray-700 text-center">
        {name}
      </span>
    </Button>
  </Link>
);

// --- Main Component ---
export default function DashboardOverviewPage({ data, events }: any) {
  if (!data) return null;
  const userData = useSelector((state: any) => state.user);
  const [recent, setRecent] = useState([]);
  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/recent`
        );
        setRecent(res.data.data);
        console.log("recent", res.data.data);
      } catch (err) {
        console.error("Events load error:", err);
      } finally {
      }
    };

    fetchRecent();
  }, [userData]);

  return (
    <div className="mt-8 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* --- Recent Activity --- */}
        <Card className="lg:col-span-2 shadow-lg h-fit">
          <CardHeader className="flex items-center justify-between pb-3">
            <CardTitle className="text-xl font-semibold text-gray-800">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recent.map((activity) => {
              const Icon = recentActivity[0].icon;
              return (
                <div
                  key={activity.id}
                  className="flex items-start border-b border-gray-100 pb-4 last:border-b-0"
                >
                  <div
                    className={`p-2 rounded-full mr-4 border-2 
                      "text",
                      "border"
                    `}
                  >
                    <Icon
                      className={`w-5 h-5 ${recentActivity[0].iconColor}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 truncate">
                      {activity.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-0.5">
                      {activity.description}
                    </p>
                    <UserInfo user={activity.user} time={activity.time} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* --- Quick Actions --- */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-lg">
            <CardHeader className="flex items-center justify-between pb-3">
              <CardTitle className="text-xl font-semibold text-gray-800">
                Quick Actions
              </CardTitle>
              <p className="text-sm text-gray-500 capitalize">
                {userData.role || "User"} Role
              </p>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="grid grid-cols-3 gap-3">
                {quickActions[userData.role]?.map((action, index) => (
                  <QuickActionButton key={index} {...action} />
                )) || (
                  <p className="text-sm text-gray-400 col-span-3">
                    No actions available.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* --- Notifications & Events --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Notifications */}
        <Card className="shadow-lg max-h-[480px] overflow-y-auto">
          <CardHeader className="flex items-center justify-between pb-0">
            <CardTitle className="text-xl font-semibold text-gray-800">
              Notifications For You
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2 space-y-2">
            {data.notificationForYou.map((activity: any) => (
              <div
                key={activity.id}
                className="flex items-start border-b border-gray-200 pb-3 last:border-b-0"
              >
                <div className="p-2 rounded-full mr-3 border-2 border-gray-300 bg-gray-50">
                  <MessageCircle className="w-5 h-5 text-gray-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 truncate">
                    {activity.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {activity.body}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(activity.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Events */}
        <Card className="shadow-lg max-h-[480px] overflow-y-auto">
          <CardHeader className="flex items-center justify-between pb-3">
            <CardTitle className="text-xl font-semibold text-gray-800">
              Events And Meeting
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {events?.map((event) => (
              <div
                key={event.id}
                className="flex items-start border-b border-gray-100 pb-4 last:border-b-0"
              >
                <div className="p-2 rounded-full mr-4 border-2 border-blue-300 bg-blue-50">
                  <Calendar className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 truncate">
                    {event.title}
                  </h3>
                  {event.description && (
                    <p className="text-sm text-gray-600 mt-0.5">
                      {event.description}
                    </p>
                  )}
                  <div className="flex items-center text-sm text-gray-500 mt-1 gap-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(event.startAt).toLocaleString()}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center text-sm text-gray-400">
        &copy; 2009 World Hindu Vision CRM. Dashboard overview.
      </footer>
    </div>
  );
}

// @ts-nocheck
"use client";
import React from "react";
import {
  Plus,
  Briefcase,
  FileText,
  Mail,
  Users,
  BarChart4,
  ListChecks,
  FileTextIcon,
  Mailbox,
  Target,
  Clock,
  ArrowRight,
  TrendingUp,
  CheckCircle,
  XCircle,
  DollarSign,
  Edit,
  MessageCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// --- Mock Data for Recent Activity ---
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
  {
    id: 4,
    type: "milestone",
    title: "Yoga Center - London reached 500 members",
    description:
      "Milestone achieved ahead of schedule with 120% target completion",
    user: "Sunita Reddy",
    time: "3h ago",
    icon: Target,
    iconColor: "text-indigo-500",
  },
  {
    id: 5,
    type: "pending",
    title: "Pending approval required",
    description: "Budget revision for Cultural Festival - Toronto needs review",
    user: "", // No specific user listed, just action needed
    time: "4h ago",
    icon: Clock,
    iconColor: "text-amber-500",
  },
];

// --- Quick Actions Data ---
const quickActions = [
  { name: "Create Project", icon: Plus, color: "bg-orange-500" },
  { name: "Add Donor", icon: Users, color: "bg-green-500" },
  { name: "Generate Report", icon: FileText, color: "bg-blue-500" },
  { name: "Manage Grants", icon: Briefcase, color: "bg-purple-500" },
  { name: "Send Newsletter", icon: Mail, color: "bg-yellow-500" },
  { name: "View Finances", icon: BarChart4, color: "bg-red-500" },
];

// --- Utility Components ---

// Component for the user name and time stamp
const UserInfo = ({ user, time }: { user: string; time: string }) => (
  <div className="flex items-center text-xs text-gray-500 mt-1">
    {user && (
      <div className="flex items-center mr-3">
        {/* Placeholder for User Avatar */}
        <div className="w-4 h-4 rounded-full bg-gray-300 mr-1 flex items-center justify-center text-[10px] text-gray-700 font-semibold">
          {user[0]}
        </div>
        {user}
      </div>
    )}
    <span>{time}</span>
  </div>
);

// Component for a single Quick Action button
const QuickActionButton = ({
  name,
  icon: Icon,
  color,
}: (typeof quickActions)[0]) => (
  <Button
    variant="outline"
    className={`flex flex-col items-center justify-center h-24 w-full p-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow`}
  >
    <Icon className={`w-6 h-6 mb-1 ${color.replace("bg", "text")}`} />
    <span className="text-xs font-semibold text-gray-700 text-center">
      {name}
    </span>
  </Button>
);

// --- Main Dashboard Overview Component ---
export default function DashboardOverviewPage({ data }: any) {

  if(!data) return null;
  return (
    <div className="  mt-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* --- 1. Recent Activity (2/3 width) --- */}
        <Card className="lg:col-span-2 shadow-lg h-fit">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-xl font-semibold text-gray-800">
              Recent Activity
            </CardTitle>
            <Button
              variant="link"
              className="text-orange-500 hover:text-orange-600 p-0 h-auto font-semibold"
            >
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => {
              const Icon = activity.icon;
              return (
                <div
                  key={activity.id}
                  className="flex items-start border-b border-gray-100 pb-4 last:border-b-0"
                >
                  <div
                    className={`p-2 rounded-full mr-4 border-2 ${activity.iconColor.replace(
                      "text",
                      "border"
                    )}`}
                  >
                    <Icon className={`w-5 h-5 ${activity.iconColor}`} />
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

        {/* --- 2. Quick Actions (1/3 width) --- */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-xl font-semibold text-gray-800">
                Quick Actions
              </CardTitle>
              <p className="text-sm text-gray-500">Administrator Role</p>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="grid grid-cols-3 gap-3">
                {quickActions.map((action, index) => (
                  <QuickActionButton key={index} {...action} />
                ))}
              </div>
              <Button
                variant="outline"
                className="w-full mt-6 text-gray-700 border-gray-300 hover:bg-gray-100"
              >
                View All Functions <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Placeholder for the second card (e.g., Reports/Notifications) if needed */}
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-0">
              <CardTitle className="text-xl font-semibold text-gray-800">
                Notifition For You
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="">
                {data.notificationForYou.map((activity: any) => {
                  const Icon = MessageCircle;

                  return (
                    <div
                      key={activity.id}
                      className="flex items-start border-b border-gray-200 pb-4 last:border-b-0"
                    >
                      {/* Icon Box */}
                      <div className="p-2 rounded-full mr-3 border-2 border-gray-300 bg-gray-50">
                        <Icon className="w-5 h-5 text-gray-700" />
                      </div>

                      {/* Text Section */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 truncate">
                          {activity.title}
                        </h3>

                        <p className="text-sm text-gray-600 mt-0.5">
                          {activity.body}
                        </p>

                        <p className="text-sm text-gray-600 mt-0.5">
                          {new Date(activity.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Fixed Footer (Optional, based on your previous component) */}
      <footer className="mt-8 text-center text-sm text-gray-400">
        <p>
          &copy; 2009 World Hindu Vision CRM. Dashboard
          overview.
        </p>
      </footer>
    </div>
  );
}

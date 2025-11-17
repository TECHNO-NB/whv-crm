
"use client"
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Users, Globe, DollarSign, ClipboardList, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import DashboardOverviewPage from "@/components/OverView";

const page = () => {
    const stats = [
{ title: "Total Projects", value: 48, icon: <ClipboardList />, color: "bg-orange-500" },
{ title: "Active Volunteers", value: 320, icon: <Users />, color: "bg-amber-500" },
{ title: "Countries", value: 14, icon: <Globe />, color: "bg-yellow-500" },
{ title: "Donations", value: "$1.2M", icon: <DollarSign />, color: "bg-green-500" },
];
  return (
    <div>
      <div className="min-h-screen bg-orange-50 p-6 ml-28">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-orange-700">
            🌏 World Hindu Vision - NGO Dashboard
          </h1>
          <Button className="bg-orange-600 hover:bg-orange-700 text-white">
            + Add Project
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="shadow-md border-none">
                <CardHeader className="flex flex-row justify-between items-center">
                  <CardTitle className="text-lg text-slate-700">
                    {item.title}
                  </CardTitle>
                  <div className={`p-3 rounded-full text-white ${item.color}`}>
                    {item.icon}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-semibold text-slate-900">
                    {item.value}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="grid gap-6 mt-8 md:grid-cols-2">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-orange-700 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" /> Project Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 text-sm">
                Visual representation of active vs completed projects and
                performance trends. Integrate charts here using{" "}
                <code>recharts</code> or <code>nivo</code>.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-orange-700 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" /> Communication Updates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-slate-600 text-sm space-y-2">
                <li>• New announcement: "Global Volunteer Meet - Nov 20"</li>
                <li>• 5 unread messages from Project Nepal team</li>
                <li>• Budget report review scheduled tomorrow</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      <DashboardOverviewPage/>
      </div>
    </div>
  );
};

export default page;

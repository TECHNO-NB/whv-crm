// @ts-nocheck

"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Users,
  Globe,
  DollarSign,
  ClipboardList,
  MessageSquare,
} from "lucide-react";
import { motion } from "framer-motion";
import DashboardOverviewPage from "@/components/OverView";

interface DashboardData {
  totalProjects: number;
  activeVolunteers: number;
  totalCountries: number;
  totalDonation: number;
  totalMessages: number;
  topCountryDonations: {
    country: string;
    project: string;
    totalDonation: number;
  }[];
}

const Page = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/dashboard`,
          { withCredentials: true }
        );

        setData(res.data.data);
      } catch (error) {
        console.error("❌ Error fetching dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-[#EA580C] font-semibold">
        Loading Dashboard...
      </div>
    );

  if (!data)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600 font-semibold">
        Failed to load dashboard data.
      </div>
    );

  const cards = [
    {
      title: "Total Projects",
      value: data.totalProjects,
      icon: <ClipboardList />,
      color: "bg-[#EA580C]",
    },
    {
      title: "Active Volunteers",
      value: data.activeVolunteers,
      icon: <Users />,
      color: "bg-[#D97706]",
    },
    {
      title: "Countries",
      value: data.totalCountries,
      icon: <Globe />,
      color: "bg-[#F59E0B]",
    },
    {
      title: "Total Donations",
      value: `$${data.totalDonation.toLocaleString()}`,
      icon: <DollarSign />,
      color: "bg-[#16A34A]",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFDDC7] text-white
  p-6 ml-28">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#C2410C]">
          World Hindu Vision - NGO Dashboard
        </h1>
      </div>

      {/* Top Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="shadow-md border border-orange-100 bg-white rounded-xl">
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle className="text-lg text-[#7C2D12]">
                  {item.title}
                </CardTitle>
                <div
                  className={`p-3 rounded-full text-white shadow-sm ${item.color}`}
                >
                  {item.icon}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold text-[#4B2E1A]">
                  {item.value}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Middle Charts Section */}
      <div className="grid gap-6 mt-8 md:grid-cols-2">
        {/* Top Donating Countries */}
        <Card className="border border-orange-100 bg-white shadow-md rounded-xl">
          <CardHeader>
            <CardTitle className="text-[#C2410C] flex items-center gap-2">
              <BarChart3 className="w-5 h-5" /> Top Donating Countries
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.topCountryDonations.length > 0 ? (
              <ul className="space-y-2 text-[#4B2E1A] text-sm">
                {data.topCountryDonations.map((country, index) => (
                  <li
                    key={index}
                    className="flex justify-between border-b border-orange-100 pb-1"
                  >
                    <span>
                      {country.country} — {country.project}
                    </span>
                    <span className="font-semibold text-[#C2410C]">
                      ${country.totalDonation.toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[#A16207] text-sm">
                No donation data available.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Communication Updates */}
        <Card className="border border-orange-100 bg-white shadow-md rounded-xl">
          <CardHeader>
            <CardTitle className="text-[#C2410C] flex items-center gap-2">
              <MessageSquare className="w-5 h-5" /> Communication Updates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-[#4B2E1A] text-sm space-y-2">
              <li>• Total Messages: {data.totalMessages}</li>
              <li>• Budget review scheduled tomorrow</li>
              <li>• Volunteer meeting planned next week</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Chart Overview Component */}
      <DashboardOverviewPage data={data} />
    </div>
  );
};

export default Page;

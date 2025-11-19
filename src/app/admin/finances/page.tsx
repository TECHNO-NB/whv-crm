// @ts-nocheck
"use client";

import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import {
  DollarSign,
  BarChart3,
  TrendingUp,
  Handshake,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Goal,
  List,
  PiggyBank,
  Briefcase,
  User,
  PlusCircle,
  Globe,
  Wallet,
  TrendingDown,
  Award,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import AddExpenseDialog from "@/components/AddExpenseModal";
import AddDonationDialog from "@/components/AddDonationDialog";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

// --- Constants ---
const YEARS = [2023, 2024, 2025];
const COUNTRIES = [
  { value: "all", label: "All Countries" },
  { value: "Nepal", label: "Nepal" },
  { value: "Tanzania", label: "Tanzania" },
  { value: "India", label: "India" },
];

// --- Helper Functions ---
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-white border border-gray-200 shadow-md rounded-lg text-sm">
        <p className="font-semibold text-gray-700 mb-1">{label}</p>
        {payload.map((p: any, index: number) => (
          <p key={index} style={{ color: p.color }} className="flex justify-between">
            {p.name}: <span className="font-medium ml-2">{formatCurrency(p.value)}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// --- Select Components ---
const YearSelect = ({ value, onChange, label }: any) => (
  <div className="space-y-2">
    {label && <Label>{label}</Label>}
    <Select value={String(value)} onValueChange={(val) => onChange(Number(val))}>
      <SelectTrigger>
        <SelectValue placeholder="Select year" />
      </SelectTrigger>
      <SelectContent>
        {YEARS.map((year) => (
          <SelectItem key={year} value={String(year)}>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
              {year}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

const CountrySelect = ({ value, onChange, label, includeAll = false }: any) => (
  <div className="space-y-2">
    {label && <Label>{label}</Label>}
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select country" />
      </SelectTrigger>
      <SelectContent>
        {COUNTRIES.filter((c) => includeAll || c.value !== "all").map((c) => (
          <SelectItem key={c.value} value={c.value}>
            <div className="flex items-center">
              <Globe className="w-4 h-4 mr-2 text-gray-400" />
              {c.label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

// --- Leading Manager Component ---
const LeadingManagerProfile = ({ manager }: any) => (
  <Card className="shadow-lg border-t-4 border-purple-500 lg:col-span-1">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-6">
      <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
        <Award className="w-4 h-4 mr-1 text-purple-500" /> TOP PERFORMER
      </CardTitle>
    </CardHeader>
    <CardContent className="flex items-center space-x-4 pt-4">
      <Avatar className="w-16 h-16 shadow-md border-2 border-purple-200">
        {manager.avatarUrl ? (
          <AvatarImage src={manager.avatarUrl} alt={manager.name} />
        ) : (
          <AvatarFallback>
            {manager.name?.split(" ").map((n: any) => n[0]).join("")}
          </AvatarFallback>
        )}
      </Avatar>
      <div>
        <h3 className="text-xl font-bold text-gray-800">{manager.name}</h3>
        <p className="text-sm text-purple-600 font-semibold">{manager.title}</p>
        <p className="text-xs text-gray-500 mt-1">
          {manager.performanceMetric ? formatCurrency(manager.performanceMetric) : "-"} ({manager.metricLabel || "-"})
        </p>
      </div>
    </CardContent>
  </Card>
);

// --- Country Performance Chart ---
const CountryPerformanceChart = ({ data }: any) => {
  const rankedData = useMemo(() => {
    return data
      .map((item: any) => ({
        ...item,
        countryLabel: item.country.split(" ")[0],
      }))
      .sort((a: any, b: any) => b.netBalance - a.netBalance);
  }, [data]);

  const topPerformers = rankedData.slice(0, 3);
  const bottomPerformers = rankedData.slice(-3).reverse();
  const chartData = [...topPerformers, ...bottomPerformers];

  return (
    <Card className="shadow-lg lg:col-span-3">
      <CardHeader className="pt-4 px-6">
        <CardTitle className="text-xl font-semibold flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-green-600" /> Country Financial Performance (Net Balance)
        </CardTitle>
        <p className="text-sm text-gray-500">
          Comparing top 3 and bottom 3 countries by Net Balance (Income - Expenses).
        </p>
      </CardHeader>
      <CardContent className="h-96 pt-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis type="number" tickFormatter={(val) => formatCurrency(val)} stroke="#777" />
            <YAxis dataKey="countryLabel" type="category" stroke="#777" tickLine={false} interval={0} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: "10px" }} />
            <Bar dataKey="income" fill="#10B981" name="Income" stackId="a" />
            <Bar dataKey="expenses" fill="#EF4444" name="Expenses" stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// --- Main Dashboard Page ---
export default function FinancialDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [apiData, setApiData] = useState<any>(null);

  const [isExpenseOpen, setIsExpenseOpen] = useState(false);
  const [isDonationOpen, setIsDonationOpen] = useState(false);

  const [selectedYear, setSelectedYear] = useState(YEARS[YEARS.length - 1]);
  const [selectedCountry, setSelectedCountry] = useState("all");

  // --- Fetch API ---
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/financedashboard/`,
          { withCredentials: true }
        );
        setApiData(res.data.data);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading dashboard...</p>
      </div>
    );
  }

  // --- Map API Data ---
  const financialData = {
    totalIncome: apiData?.totalDonationIncome?.[0]?.total_donations || 0,
    totalExpenses: apiData?.totalExpenses?.[0]?.total_expenses || 0,
    netBalance: apiData?.netBalance || 0,
    currentMonthIncome: apiData?.totalDonationIncome?.[0]?.total_donations || 0,
    lastMonthIncome: 0,
    currentMonthExpenses: apiData?.totalExpenses?.[0]?.total_expenses || 0,
    lastMonthExpenses: 0,
    goalAchieved: 0,
    fundraisingGoal: 100000,
  };

  const expenseBreakdown = apiData?.topExpensesCategory?.map((c: any) => ({
    category: c.category,
    amount: c.total_amount,
    color: "bg-red",
  })) || [];

  const leadingManagerData = apiData?.topPerformerCountry?.find((m: any) => m.manager_name) || {
    name: "No Manager",
    title: "",
    performanceMetric: 0,
    metricLabel: "",
    avatarUrl: "",
  };

  const countryPerformanceData = apiData?.topPerformerCountry?.map((c: any) => ({
    country: c.country_name,
    income: c.total_donations,
    expenses: c.total_expenses,
    netBalance: c.net_balance,
  })) || [];

  const calculateTrend = (current: number, last: number) => ((current - last) / (last || 1)) * 100;
  const incomeChange = calculateTrend(financialData.currentMonthIncome, financialData.lastMonthIncome);
  const expenseChange = calculateTrend(financialData.currentMonthExpenses, financialData.lastMonthExpenses);
  const trendIcon = (change: number) => change >= 0 ? <ArrowUpRight className="w-4 h-4 text-green-500" /> : <ArrowDownRight className="w-4 h-4 text-red-500" />;
  const trendColor = (change: number) => change >= 0 ? "text-green-500" : "text-red-500";

  // Dummy monthly data for line chart
  const monthlyFinancials = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(0, i).toLocaleString("default", { month: "short" }),
    income: financialData.totalIncome / 12,
    expenses: financialData.totalExpenses / 12,
  }));

  return (
    <div className="min-h-screen ml-26 bg-gray-50 p-4 md:p-8">
      {/* --- Header --- */}
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <DollarSign className="w-8 h-8 mr-2 text-orange-500" /> Financial
        </h1>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full xl:w-auto">
          <div className="flex space-x-4">
            <div className="min-w-[150px]">
              <YearSelect value={selectedYear} onChange={setSelectedYear} label="Filter by Year" />
            </div>
            <div className="min-w-[200px]">
              <CountrySelect value={selectedCountry} onChange={setSelectedCountry} label="Filter by Country" includeAll />
            </div>
          </div>
          <div className="flex space-x-2 justify-end">
            <Button variant="outline" onClick={() => setIsExpenseOpen(true)} className="border-red-400 text-red-600 hover:bg-red-50 flex-shrink-0 hidden md:inline-flex">
              <PlusCircle className="w-4 h-4 mr-2" /> Expense
            </Button>
            <Button variant="outline" onClick={() => setIsDonationOpen(true)} className="border-green-400 text-green-600 hover:bg-green-50 flex-shrink-0 hidden md:inline-flex">
              <PlusCircle className="w-4 h-4 mr-2" /> Donation
            </Button>
          </div>
        </div>
      </header>

      {/* --- Top Cards --- */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <LeadingManagerProfile manager={{
          name: leadingManagerData.manager_name || "No Manager",
          title: leadingManagerData.country_name || "",
          performanceMetric: leadingManagerData.net_balance,
          metricLabel: "Net Balance",
          avatarUrl: leadingManagerData.avatar,
        }} />

        {/* Total Income */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow border-t-4 border-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Income (YTD)</CardTitle>
            <DollarSign className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800">{formatCurrency(financialData.totalIncome)}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              {trendIcon(incomeChange)} <span className={trendColor(incomeChange)}>{Math.abs(incomeChange).toFixed(1)}%</span> vs Last Month
            </p>
          </CardContent>
        </Card>

        {/* Total Expenses */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow border-t-4 border-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Expenses (YTD)</CardTitle>
            <BarChart3 className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800">{formatCurrency(financialData.totalExpenses)}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              {trendIcon(expenseChange * -1)} <span className={trendColor(expenseChange * -1)}>{Math.abs(expenseChange).toFixed(1)}%</span> vs Last Month
            </p>
          </CardContent>
        </Card>

        {/* Net Balance */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow border-t-4 border-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Net Balance</CardTitle>
            <Handshake className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800">{formatCurrency(financialData.netBalance)}</div>
            <p className="text-xs text-muted-foreground mt-1">Current available operating fund</p>
          </CardContent>
        </Card>
      </div>

        <div></div>
      {/* --- Expense Breakdown --- */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card className="shadow-lg">
          <CardHeader className="pt-4 px-6">
            <CardTitle className="text-lg font-semibold flex items-center">
              <List className="w-4 h-4 mr-2" /> Expense Allocation
            </CardTitle>
          </CardHeader>
          <CardContent className="h-40 space-y-3 pt-4 overflow-y-auto">
            {expenseBreakdown.map((item: any, index: number) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span>{item.category}</span>
                  <span>{formatCurrency(item.amount)}</span>
                </div>
                <Progress value={(item.amount / financialData.totalExpenses) * 100} className="h-2 bg-red-200 [&>div]:bg-red-500" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* --- Monthly Trend Chart --- */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <Card className="shadow-lg">
          <CardHeader className="pt-4 px-6">
            <CardTitle className="text-lg font-semibold">Monthly Income & Expense Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-80 pt-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyFinancials}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="month" stroke="#777" />
                <YAxis domain={[0, Math.max(financialData.totalIncome, financialData.totalExpenses)]} stroke="#777" />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: "10px" }} />
                <Line type="monotone" dataKey="income" stroke="#10B981" name="Income" strokeWidth={2} />
                <Line type="monotone" dataKey="expenses" stroke="#EF4444" name="Expenses" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* --- Country Performance --- */}
        <CountryPerformanceChart data={countryPerformanceData} />
      </div>

      {/* --- Dialogs --- */}
      <AddExpenseDialog isOpen={isExpenseOpen} setIsOpen={setIsExpenseOpen} />
      <AddDonationDialog isOpen={isDonationOpen} setIsOpen={setIsDonationOpen} />
    </div>
  );
}

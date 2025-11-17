// @ts-nocheck

"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FileText,
  Download,
  Filter,
  Search,
  Clock,
  Database,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// --- Helper Data ---
const REPORT_TYPES = [
  { value: "pnl", label: "Profit & Loss Statement" },
  { value: "balance", label: "Balance Sheet" },
  { value: "cash_flow", label: "Cash Flow Analysis" },
  { value: "donor", label: "Donor Contribution Report" },
  { value: "budget", label: "Budget vs. Actual Report" },
];

const COUNTRIES = [
  { value: "all", label: "All Global Operations" },
  { value: "us", label: "United States" },
  { value: "in", label: "India" },
  { value: "uk", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
];

const YEARS = [2025, 2024, 2023, 2022];

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

// --- Main Component ---
export default function FinancialReportsPage() {
  const [reportType, setReportType] = useState("pnl");
  const [year, setYear] = useState(YEARS[0].toString());
  const [country, setCountry] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [generatedReports, setGeneratedReports] = useState([]);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Fetch financial dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    axios.defaults.withCredentials = true;
    try {
      const res = await axios.get(
        "http://localhost:4000/api/v1/financial/dashboard"
      );
      setDashboardData(res.data.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Generate new report logic
  const generateReport = () => {
    const typeLabel = REPORT_TYPES.find((r) => r.value === reportType)?.label;
    if (!typeLabel) return;

    const newReport = {
      id: Date.now(),
      type: typeLabel,
      period: `${year} FY`,
      scope: COUNTRIES.find((c) => c.value === country)?.label || "Unknown",
      date: new Date().toISOString().slice(0, 10),
      format: "PDF",
      status: "In Progress",
    };
 {/* @ts-ignore */}
    setGeneratedReports((prev) => [newReport, ...prev]);

    setTimeout(() => {
       {/* @ts-ignore */}
      setGeneratedReports((prev) =>
        prev.map((r:any) =>
          r.id === newReport.id
            ? {
                ...r,
                status: "Completed",
                format:
                  r.type.includes("Budget") || r.type.includes("Donor")
                    ? "XLSX"
                    : "PDF",
              }
            : r
        )
      );
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 ml-26">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <FileText className="w-8 h-8 mr-2 text-blue-600" /> Financial
          Reporting Center
        </h1>
        <p className="text-gray-500 mt-1">
          Generate, view, and analyze financial reports.
        </p>
      </header>

      {/* === Dashboard Charts === */}
      {dashboardData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Donations vs Expenses */}
          <Card>
            <CardHeader>
              <CardTitle>Donations vs Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={[
                    { name: "Donations", amount: dashboardData.totalIncome },
                    { name: "Expenses", amount: dashboardData.totalExpenses },
                  ]}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="amount" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Monthly Financials */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Income & Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dashboardData.monthlyFinancials}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="income" fill="#3b82f6" name="Income" />
                  <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Expense Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Top Expenses by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={dashboardData.expenseBreakdown}
                    dataKey="_sum.amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                     {/* @ts-ignore */}
                    {dashboardData.expenseBreakdown.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Income Sources */}
          <Card>
            <CardHeader>
              <CardTitle>Top Income Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={dashboardData.incomeSources}
                    dataKey="_sum.amount"
                    nameKey="source"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                     {/* @ts-ignore */}
                    {dashboardData.incomeSources.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Quarterly Budget vs Actual */}
          <Card>
            <CardHeader>
              <CardTitle>Quarterly Budget vs Actual</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dashboardData.quarterlyBudget}>
                  <XAxis dataKey="quarter" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="budget" fill="#3b82f6" name="Budget" />
                  <Bar dataKey="actual" fill="#10b981" name="Actual" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* --- Report Generation Panel --- */}
      {/* <Card className="shadow-xl mb-8 border-t-4 border-blue-500">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center text-blue-700">
            <Database className="w-5 h-5 mr-2" /> Generate New Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="report-type">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger id="report-type" className="bg-white">
                  <SelectValue placeholder="Select Report Type" />
                </SelectTrigger>
                <SelectContent>
                  {REPORT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="report-year">Reporting Year</Label>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger id="report-year" className="bg-white">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  {YEARS.map((y) => (
                    <SelectItem key={y} value={y.toString()}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="report-country">Scope / Country</Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger id="report-country" className="bg-white">
                  <SelectValue placeholder="Select Scope" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={generateReport}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors h-10"
              disabled={!reportType || !year || !country}
            >
              <FileText className="w-4 h-4 mr-2" /> Generate Report
            </Button>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}

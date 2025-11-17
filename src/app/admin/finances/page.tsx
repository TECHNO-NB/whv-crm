"use client";
import React, { useState, useMemo } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Assuming an Avatar component exists
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// --- Recharts Imports (Required to render charts) ---
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

// --- FIXED MOCK DATA & CONFIGS ---

const COUNTRIES = [
  { value: "all", label: "All Countries" },
  { value: "us", label: "United States" },
  { value: "in", label: "India" },
  { value: "uk", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
  { value: "au", label: "Australia" },
  { value: "de", label: "Germany" },
];

const YEARS = [2023, 2024, 2025]; // Mock available years

const financialData = {
  totalIncome: 1253000,
  totalExpenses: 895000,
  netBalance: 358000,
  fundraisingGoal: 1500000,
  goalAchieved: 1100000,
  // Monthly trend data
  currentMonthIncome: 85000,
  lastMonthIncome: 75000,
  currentMonthExpenses: 62000,
  lastMonthExpenses: 55000,
};

const expenseBreakdown = [
  { category: "Program Activities", amount: 420000, color: "bg-red-500" },
  { category: "Administrative Costs", amount: 210000, color: "bg-red-400" },
  { category: "Personnel/Salaries", amount: 155000, color: "bg-red-300" },
  { category: "Fundraising/Marketing", amount: 70000, color: "bg-red-200" },
  { category: "Travel & Logistics", amount: 40000, color: "bg-red-100" },
];
const EXPENSE_CATEGORIES = expenseBreakdown.map((e) => e.category);

const incomeSources = [
  { source: "Individual Donations", amount: 450000, icon: PiggyBank },
  { source: "Government Grants", amount: 350000, icon: Briefcase },
  { source: "Corporate Partnerships", amount: 250000, icon: Handshake },
  { source: "Membership Fees", amount: 200000, icon: User },
];
const GENERAL_INCOME_SOURCES = incomeSources
  .filter((s) => s.source !== "Individual Donations")
  .map((s) => s.source);

// DATA: Monthly Trend Data for Chart
const monthlyFinancials = [
  { month: "Jan", income: 70000, expenses: 50000 },
  { month: "Feb", income: 65000, expenses: 55000 },
  { month: "Mar", income: 80000, expenses: 60000 },
  { month: "Apr", income: 75000, expenses: 55000 },
  { month: "May", income: 85000, expenses: 62000 },
  { month: "Jun", income: 90000, expenses: 68000 },
];

// DATA: Quarterly Budget vs. Actual Data
const quarterlyBudget = [
  { quarter: "Q1", budget: 250000, actual: 235000 },
  { quarter: "Q2", budget: 300000, actual: 305000 },
  { quarter: "Q3", budget: 350000, actual: 330000 },
  { quarter: "Q4", budget: 400000, actual: 280000 },
];

// NEW MOCK DATA: Yearly Budgets
const initialYearlyBudgets = [
  { year: 2025, country: "us", incomeBudget: 800000, expenseBudget: 700000 },
  { year: 2025, country: "in", incomeBudget: 400000, expenseBudget: 300000 },
  { year: 2024, country: "all", incomeBudget: 1500000, expenseBudget: 1200000 },
];

// NEW MOCK DATA: Performance by Country
const countryPerformanceData = [
  { country: "United States", income: 450000, expenses: 300000 },
  { country: "India", income: 300000, expenses: 200000 },
  { country: "United Kingdom", income: 150000, expenses: 100000 },
  { country: "Canada", income: 100000, expenses: 90000 },
  { country: "Australia", income: 80000, expenses: 95000 },
  { country: "Germany", income: 60000, expenses: 110000 },
];

// NEW MOCK DATA: Leading Manager
const leadingManager = {
  name: "Anya Sharma",
  title: "Chief Financial Officer",
  performanceMetric: financialData.netBalance,
  metricLabel: "YTD Net Balance",
  avatarUrl: "https://i.pravatar.cc/150?img=47", // Mock avatar
};

// Helper function to format currency
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);

// Custom Tooltip for Recharts to show currency
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-white border border-gray-200 shadow-md rounded-lg text-sm">
        <p className="font-semibold text-gray-700 mb-1">{label}</p>
        {payload.map((p: any, index: number) => (
          <p
            key={index}
            style={{ color: p.color }}
            className="flex justify-between"
          >
            {p.name}:{" "}
            <span className="font-medium ml-2">{formatCurrency(p.value)}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// --- REUSABLE SELECT COMPONENTS (omitted for brevity) ---
// ... (CountrySelect, YearSelect, AddExpenseDialog, AddDonationDialog, AddIncomeDialog, AddBudgetDialog) ...

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  includeAll?: boolean;
}
const CountrySelect: React.FC<CountrySelectProps> = ({
  value,
  onChange,
  label,
  includeAll = false,
}) => (
  <div className="space-y-2">
    {label && <Label>{label}</Label>}
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select country" />
      </SelectTrigger>
      <SelectContent>
        {COUNTRIES.filter((c) => includeAll || c.value !== "all").map(
          (country) => (
            <SelectItem key={country.value} value={country.value}>
              <div className="flex items-center">
                <Globe className="w-4 h-4 mr-2 text-gray-400" />
                {country.label}
              </div>
            </SelectItem>
          )
        )}
      </SelectContent>
    </Select>
  </div>
);
interface YearSelectProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
}
const YearSelect: React.FC<YearSelectProps> = ({ value, onChange, label }) => (
  <div className="space-y-2">
    {label && <Label>{label}</Label>}
    <Select
      value={String(value)}
      onValueChange={(val) => onChange(Number(val))}
    >
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
interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}
const AddExpenseDialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [description, setDescription] = useState("");
  const handleSave = () => {
    /* ... implementation ... */ onSave({
      type: "Expense",
      amount: parseFloat(amount),
      category,
      description,
      country,
      date: new Date().toISOString(),
    });
    setAmount("");
    setCategory("");
    setCountry("");
    setDescription("");
    onClose();
  };
  {
    /* @ts-ignore */
  }
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px}">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <List className="w-5 h-5 mr-2 text-red-500" /> Add New Expense
          </DialogTitle>
          <DialogDescription>
            Record a new outgoing transaction. Required fields are marked.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="expense-amount">Amount ($)</Label>
            <Input
              id="expense-amount"
              placeholder="e.g., 5000.00"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select expense category" />
              </SelectTrigger>
              <SelectContent>
                {EXPENSE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <CountrySelect
            value={country}
            onChange={setCountry}
            label="Country"
          />
          <div className="space-y-2">
            <Label htmlFor="expense-description">Description (Optional)</Label>
            <Textarea
              id="expense-description"
              placeholder="Short memo for this expense"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!amount || !category || !country}
            className="bg-red-500 hover:bg-red-600"
          >
            Add Expense
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
const AddDonationDialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [amount, setAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [country, setCountry] = useState<string>("");
  const handleSave = () => {
    /* ... implementation ... */ onSave({
      type: "Donation",
      amount: parseFloat(amount),
      donorName,
      country,
      date: new Date().toISOString(),
    });
    setAmount("");
    setDonorName("");
    setCountry("");
    onClose();
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px}">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <PiggyBank className="w-5 h-5 mr-2 text-green-500" /> Record
            Donation
          </DialogTitle>
          <DialogDescription>
            Input details for a new individual donation received.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="donation-amount">Amount ($)</Label>
            <Input
              id="donation-amount"
              placeholder="e.g., 50.00"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="donor-name">Donor Name / ID</Label>
            <Input
              id="donor-name"
              placeholder="John Doe or Donor #1234"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              required
            />
          </div>
          <CountrySelect
            value={country}
            onChange={setCountry}
            label="Country of Donor"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!amount || !donorName || !country}
            className="bg-green-500 hover:bg-green-600"
          >
            Record Donation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
const AddIncomeDialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const handleSave = () => {
    /* ... implementation ... */ onSave({
      type: "General Income",
      amount: parseFloat(amount),
      source,
      country,
      date: new Date().toISOString(),
    });
    setAmount("");
    setSource("");
    setCountry("");
    onClose();
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px}">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Briefcase className="w-5 h-5 mr-2 text-blue-500" /> Add General
            Income
          </DialogTitle>
          <DialogDescription>
            Record income from grants, partnerships, or fees.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="income-amount">Amount ($)</Label>
            <Input
              id="income-amount"
              placeholder="e.g., 25000.00"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Income Source</Label>
            <Select value={source} onValueChange={setSource}>
              <SelectTrigger>
                <SelectValue placeholder="Select income source" />
              </SelectTrigger>
              <SelectContent>
                {GENERAL_INCOME_SOURCES.map((src) => (
                  <SelectItem key={src} value={src}>
                    {src}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <CountrySelect
            value={country}
            onChange={setCountry}
            label="Country of Origin"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!amount || !source || !country}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Add Income
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
const AddBudgetDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  availableYears: number[];
}> = ({ isOpen, onClose, onSave, availableYears }) => {
  const [year, setYear] = useState<number>(
    availableYears[availableYears.length - 1] || new Date().getFullYear()
  );
  const [country, setCountry] = useState<string>("");
  const [incomeBudget, setIncomeBudget] = useState("");
  const [expenseBudget, setExpenseBudget] = useState("");
  const handleSave = () => {
    /* ... implementation ... */ onSave({
      year,
      country,
      incomeBudget: parseFloat(incomeBudget),
      expenseBudget: parseFloat(expenseBudget),
    });
    setCountry("");
    setIncomeBudget("");
    setExpenseBudget("");
    onClose();
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px}">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Wallet className="w-5 h-5 mr-2 text-orange-500" /> Set Annual
            Budget
          </DialogTitle>
          <DialogDescription>
            Define income and expense budgets for a specific country and year.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <YearSelect value={year} onChange={setYear} label="Financial Year" />
          <CountrySelect
            value={country}
            onChange={setCountry}
            label="Country Scope"
            includeAll={true}
          />
          <div className="space-y-2">
            <Label htmlFor="income-budget">Income Budget ($)</Label>
            <Input
              id="income-budget"
              placeholder="e.g., 1000000"
              type="number"
              value={incomeBudget}
              onChange={(e) => setIncomeBudget(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expense-budget">Expense Budget ($)</Label>
            <Input
              id="expense-budget"
              placeholder="e.g., 800000"
              type="number"
              value={expenseBudget}
              onChange={(e) => setExpenseBudget(e.target.value)}
              required
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!year || !country || !incomeBudget || !expenseBudget}
            className="bg-orange-500 hover:bg-orange-600"
          >
            Set Budget
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface ManagerData {
  name: string;
  title: string;
  performanceMetric: number;
  metricLabel: string;
  avatarUrl: string;
}

const LeadingManagerProfile: React.FC<{ manager: ManagerData }> = ({
  manager,
}) => {
  return (
    <Card className="shadow-lg border-t-4 border-purple-500 lg:col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-6">
        <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
          <Award className="w-4 h-4 mr-1 text-purple-500" /> TOP PERFORMER
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center space-x-4 pt-4">
        <Avatar className="w-16 h-16 shadow-md border-2 border-purple-200">
          <AvatarImage src={manager.avatarUrl} alt={manager.name} />
          <AvatarFallback>
            {manager.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-xl font-bold text-gray-800">{manager.name}</h3>
          <p className="text-sm text-purple-600 font-semibold">
            {manager.title}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            **{formatCurrency(manager.performanceMetric)}** (
            {manager.metricLabel})
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

// --- COUNTRY PERFORMANCE CHART COMPONENT (Updated) ---

interface PerformanceData {
  country: string;
  income: number;
  expenses: number;
  netBalance: number;
}

const CountryPerformanceChart: React.FC<{ data: PerformanceData[] }> = ({
  data,
}) => {
  // Sort and calculate Net Balance
  const rankedData = useMemo(() => {
    return data
      .map((item) => ({
        ...item,
        netBalance: item.income - item.expenses,
        countryLabel: item.country.split(" ")[0],
      }))
      .sort((a, b) => b.netBalance - a.netBalance);
  }, [data]);

  // Select Top 3 and Bottom 3
  const topPerformers = rankedData.slice(0, 3);
  const bottomPerformers = rankedData.slice(-3).reverse();

  const chartData = [...topPerformers, ...bottomPerformers];

  return (
    <Card className="shadow-lg lg:col-span-3">
      <CardHeader className="pt-4 px-6">
        <CardTitle className="text-xl font-semibold flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-green-600" /> Country
          Financial Performance (Net Balance)
        </CardTitle>
        <p className="text-sm text-gray-500">
          Comparing top 3 and bottom 3 countries by Net Balance (Income -
          Expenses).
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
            <XAxis
              type="number"
              tickFormatter={(value) => formatCurrency(value)}
              stroke="#777"
            />
            <YAxis
              dataKey="countryLabel"
              type="category"
              stroke="#777"
              tickLine={false}
              interval={0}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: "10px" }} />
            <Bar dataKey="income" fill="#10B981" name="Income" stackId="a" />
            <Bar
              dataKey="expenses"
              fill="#EF4444"
              name="Expenses"
              stackId="a"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// --- Dashboard Component ---
export default function FinancialDashboardPage() {
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [isIncomeOpen, setIsIncomeOpen] = useState(false);
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);

  // Filter States
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedYear, setSelectedYear] = useState(YEARS[YEARS.length - 1]);

  // Mutable Budget State
  const [yearlyBudgets, setYearlyBudgets] = useState(initialYearlyBudgets);

  // Transaction Handlers (currently just logging to console)
  const handleAddExpense = (data: any) => {
    console.log("New Expense Added:", data);
  };
  const handleAddDonation = (data: any) => {
    console.log("New Donation Recorded:", data);
  };
  const handleAddIncome = (data: any) => {
    console.log("New General Income Added:", data);
  };
  const handleAddBudget = (data: any) => {
    console.log("New Budget Set:", data);
    setYearlyBudgets((prev) => [...prev, data]);
  };

  // --- Data Calculations/Filtering (SIMULATED) ---
  const currentBudget = useMemo(() => {
    const countryBudget = yearlyBudgets.find(
      (b) => b.year === selectedYear && b.country === selectedCountry
    );
    if (countryBudget) return countryBudget;
    const allCountryBudget = yearlyBudgets.find(
      (b) => b.year === selectedYear && b.country === "all"
    );
    return (
      allCountryBudget || {
        incomeBudget: 0,
        expenseBudget: 0,
        year: selectedYear,
        country: selectedCountry,
      }
    );
  }, [selectedYear, selectedCountry, yearlyBudgets]);

  const goalProgress = Math.round(
    (financialData.goalAchieved / financialData.fundraisingGoal) * 100
  );
  const calculateTrend = (current: number, last: number) =>
    ((current - last) / last) * 100;
  const incomeChange = calculateTrend(
    financialData.currentMonthIncome,
    financialData.lastMonthIncome
  );
  const expenseChange = calculateTrend(
    financialData.currentMonthExpenses,
    financialData.lastMonthExpenses
  );
  const trendIcon = (change: number) =>
    change >= 0 ? (
      <ArrowUpRight className="w-4 h-4 text-green-500" />
    ) : (
      <ArrowDownRight className="w-4 h-4 text-red-500" />
    );
  const trendColor = (change: number) =>
    change >= 0 ? "text-green-500" : "text-red-500";
  const budgetIncomeProgress = Math.min(
    100,
    Math.round((financialData.totalIncome / currentBudget.incomeBudget) * 100)
  );
  const budgetExpenseProgress = Math.min(
    100,
    Math.round(
      (financialData.totalExpenses / currentBudget.expenseBudget) * 100
    )
  );

  return (
    <div className="min-h-screen ml-26 bg-gray-50 p-4 md:p-8">
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <DollarSign className="w-8 h-8 mr-2 text-orange-500" /> Financial
        </h1>

        {/* Filter and Add Transaction Group */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full xl:w-auto">
          {/* Filter Group */}
          <div className="flex space-x-4">
            {/* Year Filter */}
            <div className="min-w-[150px]">
              <YearSelect
                value={selectedYear}
                onChange={setSelectedYear}
                label="Filter by Year"
              />
            </div>
            {/* Country Filter */}
            <div className="min-w-[200px]">
              <CountrySelect
                value={selectedCountry}
                onChange={setSelectedCountry}
                label="Filter by Country"
                includeAll={true}
              />
            </div>
          </div>

          {/* Add Transaction Buttons */}
          <div className="flex space-x-2 justify-end">
            <Button
              onClick={() => setIsBudgetOpen(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white shadow-md flex-shrink-0"
            >
              <PlusCircle className="w-4 h-4 mr-2" /> Budget
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsExpenseOpen(true)}
              className="border-red-400 text-red-600 hover:bg-red-50 flex-shrink-0 hidden md:inline-flex"
            >
              <PlusCircle className="w-4 h-4 mr-2" /> Expense
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsDonationOpen(true)}
              className="border-green-400 text-green-600 hover:bg-green-50 flex-shrink-0 hidden md:inline-flex"
            >
              <PlusCircle className="w-4 h-4 mr-2" /> Donation
            </Button>
            <Button
              onClick={() => setIsIncomeOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white shadow-md flex-shrink-0 hidden md:inline-flex"
            >
              <PlusCircle className="w-4 h-4 mr-2" /> Income
            </Button>
            <Select
              onValueChange={(val) => {
                if (val === "expense") setIsExpenseOpen(true);
                if (val === "donation") setIsDonationOpen(true);
                if (val === "income") setIsIncomeOpen(true);
              }}
            >
              {/* @ts-ignore */}
              <SelectTrigger className="md:hidden w-fit flex-shrink-0">
                <PlusCircle className="w-4 h-4 mr-2" />{" "}
                <SelectValue placeholder="Add..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="donation">Donation</SelectItem>
                <SelectItem value="income">General Income</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      {/* --- NEW: Manager Profile & Key Metrics Row --- */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        {/* 1. Leading Manager Profile */}
        <LeadingManagerProfile manager={leadingManager} />

        {/* 2. Key Metric Cards (Adjusted to take 4 columns) */}

        {/* Total Income */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow border-t-4 border-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Income (YTD)
            </CardTitle>
            <DollarSign className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800">
              {formatCurrency(financialData.totalIncome)}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              {trendIcon(incomeChange)}{" "}
              <span className={trendColor(incomeChange)}>
                {Math.abs(incomeChange).toFixed(1)}%
              </span>{" "}
              vs Last Month
            </p>
          </CardContent>
        </Card>

        {/* Budgeted Income Progress */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow border-t-4 border-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Income Budget Progress ({selectedYear})
            </CardTitle>
            <Wallet className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800">
              {budgetIncomeProgress}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatCurrency(financialData.totalIncome)} /{" "}
              {formatCurrency(currentBudget.incomeBudget)}
            </p>
            <Progress
              value={budgetIncomeProgress}
              className="h-2 mt-2 bg-emerald-200 [&>div]:bg-emerald-500"
            />
          </CardContent>
        </Card>

        {/* Total Expenses */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow border-t-4 border-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Expenses (YTD)
            </CardTitle>
            <BarChart3 className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800">
              {formatCurrency(financialData.totalExpenses)}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              {trendIcon(expenseChange * -1)}{" "}
              <span className={trendColor(expenseChange * -1)}>
                {Math.abs(expenseChange).toFixed(1)}%
              </span>{" "}
              vs Last Month
            </p>
          </CardContent>
        </Card>

        {/* Net Balance */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow border-t-4 border-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Net Balance
            </CardTitle>
            <Handshake className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800">
              {formatCurrency(financialData.netBalance)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Current available operating fund
            </p>
          </CardContent>
        </Card>
      </div>

      <hr className="my-8 border-gray-200" />

      {/* --- 2. Goal & Breakdown Cards --- */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {/* Fundraising Goal Progress */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow border-t-4 border-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Fundraising Goal
            </CardTitle>
            <Goal className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800">
              {goalProgress}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatCurrency(financialData.goalAchieved)} /{" "}
              {formatCurrency(financialData.fundraisingGoal)}
            </p>
            <Progress
              value={goalProgress}
              className="h-2 mt-2 bg-orange-200 [&>div]:bg-orange-500"
            />
          </CardContent>
        </Card>

        {/* Top Income Sources */}
        <Card className="shadow-lg">
          <CardHeader className="pt-4 px-6">
            <CardTitle className="text-lg font-semibold flex items-center">
              <DollarSign className="w-4 h-4 mr-2" /> Top Income Sources
            </CardTitle>
          </CardHeader>
          <CardContent className="h-40 space-y-4 pt-4 overflow-y-auto">
            <ul className="text-sm text-gray-600 space-y-3">
              {incomeSources.map((source, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center border-b pb-2 last:border-b-0"
                >
                  <span className="flex items-center font-medium text-gray-700">
                    <source.icon className="w-4 h-4 mr-2 text-orange-500" />
                    {source.source}
                  </span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(source.amount)}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Expense Breakdown */}
        <Card className="shadow-lg">
          <CardHeader className="pt-4 px-6">
            <CardTitle className="text-lg font-semibold flex items-center">
              <List className="w-4 h-4 mr-2" /> Expense Allocation
            </CardTitle>
          </CardHeader>
          <CardContent className="h-40 space-y-3 pt-4 overflow-y-auto">
            {expenseBreakdown.map((item, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span>{item.category}</span>
                  <span>{formatCurrency(item.amount)}</span>
                </div>
                <Progress
                  value={(item.amount / financialData.totalExpenses) * 100}
                  className={`h-2 ${item.color.replace(
                    "bg-",
                    "bg-"
                  )}-200 [&>div]:bg-red-500`}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* --- 3. Charts --- */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        {/* Monthly Income/Expense Trend Chart */}
        <Card className="shadow-lg">
          <CardHeader className="pt-4 px-6">
            <CardTitle className="text-lg font-semibold">
              Monthly Income & Expense Trend
            </CardTitle>
            <p className="text-sm text-gray-500">
              Year: {selectedYear} | Country:{" "}
              {COUNTRIES.find((c) => c.value === selectedCountry)?.label}
            </p>
          </CardHeader>
          <CardContent className="h-80 pt-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyFinancials}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="month" stroke="#777" />
                <YAxis domain={[0, 100000]} tick={false} stroke="#fff" />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: "10px" }} />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#10B981"
                  activeDot={{ r: 8 }}
                  name="Income"
                  strokeWidth={3}
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="#EF4444"
                  activeDot={{ r: 8 }}
                  name="Expenses"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Budget vs Actual (Quarterly) Chart */}
        <Card className="shadow-lg">
          <CardHeader className="pt-4 px-6">
            <CardTitle className="text-lg font-semibold">
              Budget vs. Actual Spending (Quarterly)
            </CardTitle>
            <p className="text-sm text-gray-500">
              Year: {selectedYear} | Country:{" "}
              {COUNTRIES.find((c) => c.value === selectedCountry)?.label}
            </p>
          </CardHeader>
          <CardContent className="h-80 pt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={quarterlyBudget}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="quarter" stroke="#777" />
                <YAxis
                  domain={[0, 450000]}
                  tickFormatter={(value) => formatCurrency(value)}
                  stroke="#777"
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: "10px" }} />
                <Bar dataKey="budget" fill="#F97316" name="Budget" />
                <Bar dataKey="actual" fill="#3B82F6" name="Actual Spending" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* --- 4. Country Performance Chart (Bottom) --- */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* @ts-ignore */}
        <CountryPerformanceChart data={countryPerformanceData} />
      </div>

      {/* --- MODALS --- */}
      <AddExpenseDialog
        isOpen={isExpenseOpen}
        onClose={() => setIsExpenseOpen(false)}
        onSave={handleAddExpense}
      />
      <AddDonationDialog
        isOpen={isDonationOpen}
        onClose={() => setIsDonationOpen(false)}
        onSave={handleAddDonation}
      />
      <AddIncomeDialog
        isOpen={isIncomeOpen}
        onClose={() => setIsIncomeOpen(false)}
        onSave={handleAddIncome}
      />
      <AddBudgetDialog
        isOpen={isBudgetOpen}
        onClose={() => setIsBudgetOpen(false)}
        onSave={handleAddBudget}
        availableYears={YEARS}
      />

      {/* Fixed Footer */}
      <footer className="mt-8 text-center text-sm text-gray-400">
        <p>
          &copy; {new Date().getFullYear()} World Hindu Vision CRM. Financial
          data updated as of today.
        </p>
      </footer>
    </div>
  );
}

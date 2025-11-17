// @ts-nocheck

"use client"
import React from 'react';
import { DollarSign, BarChart3, TrendingUp, Handshake, Calendar, ArrowUpRight, ArrowDownRight, Goal, List, PiggyBank, Briefcase, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

// --- Recharts Imports (Required to render charts) ---
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    BarChart, Bar, 
} from 'recharts';

// --- Fixed Mock Data ---
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
    { category: 'Program Activities', amount: 420000, color: 'bg-red-500' },
    { category: 'Administrative Costs', amount: 210000, color: 'bg-red-400' },
    { category: 'Personnel/Salaries', amount: 155000, color: 'bg-red-300' },
    { category: 'Fundraising/Marketing', amount: 70000, color: 'bg-red-200' },
    { category: 'Travel & Logistics', amount: 40000, color: 'bg-red-100' },
];

const incomeSources = [
    { source: 'Individual Donations', amount: 450000, icon: PiggyBank },
    { source: 'Government Grants', amount: 350000, icon: Briefcase },
    { source: 'Corporate Partnerships', amount: 250000, icon: Handshake },
    { source: 'Membership Fees', amount: 200000, icon: User },
];

// DATA: Monthly Trend Data for Chart
const monthlyFinancials = [
    { month: 'Jan', income: 70000, expenses: 50000 },
    { month: 'Feb', income: 65000, expenses: 55000 },
    { month: 'Mar', income: 80000, expenses: 60000 },
    { month: 'Apr', income: 75000, expenses: 55000 },
    { month: 'May', income: 85000, expenses: 62000 },
    { month: 'Jun', income: 90000, expenses: 68000 },
];

// DATA: Quarterly Budget vs. Actual Data
const quarterlyBudget = [
    { quarter: 'Q1', budget: 250000, actual: 235000 },
    { quarter: 'Q2', budget: 300000, actual: 305000 },
    { quarter: 'Q3', budget: 350000, actual: 330000 },
    { quarter: 'Q4', budget: 400000, actual: 280000 },
];

// Helper function to format currency
const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);

// Custom Tooltip for Recharts to show currency
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

// --- Dashboard Component ---
export default function FinancialDashboardPage() {
    const goalProgress = Math.round((financialData.goalAchieved / financialData.fundraisingGoal) * 100);
    
    const calculateTrend = (current: number, last: number) => ((current - last) / last) * 100;
    
    const incomeChange = calculateTrend(financialData.currentMonthIncome, financialData.lastMonthIncome);
    const expenseChange = calculateTrend(financialData.currentMonthExpenses, financialData.lastMonthExpenses);

    const trendIcon = (change: number) => 
        change >= 0 ? <ArrowUpRight className="w-4 h-4 text-green-500" /> : <ArrowDownRight className="w-4 h-4 text-red-500" />;

    const trendColor = (change: number) => change >= 0 ? 'text-green-500' : 'text-red-500';

    return (
        // ✅ The 'w-full' ensures this main container uses all available horizontal space.
        <div className="min-h-screen ml-38  bg-gray-50 p-4 md:p-8">
            <header className="flex justify-between items-center mb-6 ">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                    <DollarSign className="w-8 h-8 mr-2 text-orange-500" /> **Financial Dashboard**
                </h1>
                <div className="flex space-x-2">
                    <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100"><Calendar className="w-4 h-4 mr-2" /> Select Period</Button>
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white shadow-md">
                        <TrendingUp className="w-4 h-4 mr-2" /> Generate Report
                    </Button>
                </div>
            </header>

            {/* --- 1. Key Metric Cards (Responsive Grid) --- */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                
                {/* Total Income */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow border-t-4 border-green-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Total Income (YTD)</CardTitle>
                        <DollarSign className="w-4 h-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-800">{formatCurrency(financialData.totalIncome)}</div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center">
                            {trendIcon(incomeChange)} 
                            <span className={trendColor(incomeChange)}>{Math.abs(incomeChange).toFixed(1)}%</span> vs Last Month
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
                            {trendIcon(expenseChange * -1)}
                            <span className={trendColor(expenseChange * -1)}>{Math.abs(expenseChange).toFixed(1)}%</span> vs Last Month
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
                        <p className="text-xs text-muted-foreground mt-1">
                            Current available operating fund
                        </p>
                    </CardContent>
                </Card>

                {/* Fundraising Goal Progress */}
                <Card className="shadow-lg hover:shadow-xl transition-shadow border-t-4 border-orange-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Fundraising Goal</CardTitle>
                        <Goal className="w-4 h-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-800">{goalProgress}%</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {formatCurrency(financialData.goalAchieved)} / {formatCurrency(financialData.fundraisingGoal)}
                        </p>
                        <Progress value={goalProgress} className="h-2 mt-2 bg-orange-200 [&>div]:bg-orange-500" />
                    </CardContent>
                </Card>
            </div>

            {/* --- 2. Charts and Detail Views (Responsive Grid) --- */}
            <div className="grid gap-6 lg:grid-cols-3">
                
                {/* Monthly Income/Expense Trend Chart */}
                <Card className="lg:col-span-2 shadow-lg">
                    <CardHeader className="pt-4 px-6">
                        <CardTitle className="text-lg font-semibold">Monthly Income & Expense Trend</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80 pt-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={monthlyFinancials}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                <XAxis dataKey="month" stroke="#777" />
                                <YAxis domain={[0, 100000]} tick={false} stroke="#fff" /> 
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                <Line 
                                    type="monotone" 
                                    dataKey="income" 
                                    stroke="#10B981" // Green
                                    activeDot={{ r: 8 }} 
                                    name="Income"
                                    strokeWidth={3}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="expenses" 
                                    stroke="#EF4444" // Red
                                    activeDot={{ r: 8 }} 
                                    name="Expenses"
                                    strokeWidth={3}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Expense Breakdown (Unchanged) */}
                <Card className="shadow-lg">
                    <CardHeader className="pt-4 px-6">
                        <CardTitle className="text-lg font-semibold flex items-center"><List className="w-4 h-4 mr-2" /> Expense Allocation</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80 space-y-4 pt-4">
                         {expenseBreakdown.map((item, index) => (
                            <div key={index} className="space-y-1">
                                <div className="flex justify-between items-center text-sm font-medium">
                                    <span>{item.category}</span>
                                    <span>{formatCurrency(item.amount)}</span>
                                </div>
                                <Progress 
                                    value={(item.amount / financialData.totalExpenses) * 100} 
                                    className={`h-2 ${item.color.replace('bg-', 'bg-')}-200 [&>div]:${item.color}`}
                                />
                            </div>
                         ))}
                    </CardContent>
                </Card>
                
                {/* Top Income Sources (Unchanged) */}
                <Card className="lg:col-span-1 shadow-lg">
                    <CardHeader className="pt-4 px-6">
                        <CardTitle className="text-lg font-semibold flex items-center"><DollarSign className="w-4 h-4 mr-2" /> Top Income Sources</CardTitle>
                    </CardHeader>
                    <CardContent className="h-60 space-y-4">
                        <ul className="text-sm text-gray-600 space-y-3">
                            {incomeSources.map((source, index) => (
                                <li key={index} className="flex justify-between items-center border-b pb-2 last:border-b-0">
                                    <span className="flex items-center font-medium text-gray-700">
                                        <source.icon className="w-4 h-4 mr-2 text-orange-500" />
                                        {source.source}
                                    </span>
                                    <span className="font-semibold text-green-600">{formatCurrency(source.amount)}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                {/* Budget vs Actual (Quarterly) Chart */}
                <Card className="lg:col-span-2 shadow-lg">
                    <CardHeader className="pt-4 px-6">
                        <CardTitle className="text-lg font-semibold">Budget vs. Actual Spending (Quarterly)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-60 pt-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={quarterlyBudget} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                <XAxis dataKey="quarter" stroke="#777" />
                                <YAxis domain={[0, 450000]} tickFormatter={(value) => formatCurrency(value)} stroke="#777" />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                <Bar dataKey="budget" fill="#F97316" name="Budget" /> {/* Orange */}
                                <Bar dataKey="actual" fill="#3B82F6" name="Actual Spending" /> {/* Blue */}
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Fixed Footer */}
            <footer className="mt-8 text-center text-sm text-gray-400">
                <p>&copy; {new Date().getFullYear()} World Hindu Vision CRM. Financial data updated as of today.</p>
            </footer>
        </div>
    );
}
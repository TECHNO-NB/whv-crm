// app/project/[id]/page.tsx (Updated)
// @ts-nocheck
'use client'

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress" // Requires Shadcn Progress component
import { DollarSign, MapPin, Calendar, Users, Briefcase, TrendingUp } from "lucide-react"

// --- 1. Data Types (Unchanged) ---

interface Donation {
    id: string;
    donorName: string;
    amount: number;
    method: string;
    status: string;
    receivedAt: string;
}

interface Worker {
    id: string;
    fullName: string;
    role: string;
    countryId: string;
    provinceId: string | null;
}

interface UserDetails {
    id: string;
    fullName: string;
    email: string;
    role: string;
    countryId: string;
}

interface LocationDetails {
    id: string;
    name: string;
    code: string;
    countryId: string;
}

interface ProjectData {
    id: string;
    title: string;
    approved: string;
    description: string;
    status: string;
    startDate: string;
    endDate: string | null;
    budget: number;
    spent: number;
    manager: UserDetails;
    province: LocationDetails;
    country: LocationDetails & { countryName: string };
    donations: Donation[];
    workers: Worker[];
}

// NOTE: This is the hardcoded data from the prompt for demo purposes.
const projectData: ProjectData = {
    "id": "9fe997f4-136a-4ba6-93f1-fda12caa2baa",
    "title": "Project 1: Medical Camp in Aichi",
    "approved": "pending",
    "description": "Project to support community welfare in Aichi, Japan.",
    "provinceId": "dc27b341-a70f-42f9-8f83-cd51a8c72e4b",
    "managerId": "ada70c1e-3dca-4019-9263-35bee75266c9",
    "status": "on_hold",
    "startDate": "2025-08-14T16:03:58.704Z",
    "endDate": "2029-03-13",
    "budget": 83551,
    "spent": 90000, // Faked spending for demo
    "documents": [],
    "countryId": "8fa8a2bc-4339-48ea-baaa-be614da597d0",
    "createdAt": "2025-11-20T11:39:22.422Z",
    "updatedAt": "2025-11-20T11:39:22.422Z",
    "manager": {
        "id": "ada70c1e-3dca-4019-9263-35bee75266c9",
        "fullName": "Priya Sharma (India)",
        "email": "priyasharmaindia22@orgdomain.com",
        "role": "country_manager",
        "countryId": "0838c4a7-6e96-457a-9289-6820d3696603",
    },
    "province": {
        "id": "dc27b341-a70f-42f9-8f83-cd51a8c72e4b",
        "name": "Aichi",
        "code": "AIC",
        "countryId": "8fa8a2bc-4339-48ea-baaa-be614da597d0",
    },
    "country": {
        "id": "8fa8a2bc-4339-48ea-baaa-be614da597d0",
        "countryName": "Japan",
        "code": "JP",
        "countryId": "8fa8a2bc-4339-48ea-baaa-be614da597d0",
    },
    "donations": [
        { "id": "b148b1b9-df84-49bd-abc6-4296bec6703f", "donorName": "Philanthropist 20", "amount": 2425, "method": "cheque", "status": "pending", "receivedAt": "2024-12-24T16:25:12.052Z" },
        { "id": "c0cf4ec7-97c9-4807-9f7e-6cc206175d05", "donorName": "Philanthropist 42", "amount": 1569, "method": "online", "status": "refunded", "receivedAt": "2025-06-30T15:15:42.177Z" },
        { "id": "c0cf4ec7-97c9-4807-9f7e-6cc206175d06", "donorName": "Donor 3", "amount": 15000, "method": "bank", "status": "received", "receivedAt": "2025-06-30T15:15:42.177Z" } // Added for higher total
    ],
    "workers": [
        { "id": "64be4ac2-c50f-475b-b010-f42935ac527e", "fullName": "Sarah Chen (Brazil)", "role": "volunteer", "countryId": "af71a495-c246-41c3-9a47-81673b780944", "provinceId": "75e4096d-d614-4520-88cc-315637c35a30" },
        { "id": "9db9f668-f3ea-43c5-8e55-46dd7bdad568", "fullName": "Sarah Chen (United Kingdom)", "role": "volunteer", "countryId": "a1cc14c7-9f67-4687-8dd9-096769c7d2aa", "provinceId": "a3d0a9a6-b14e-464f-be1b-fa4f74cde772" },
        { "id": "cdf73099-7256-4493-adc0-565b4c4bd47e", "fullName": "Maria Garcia (Japan)", "role": "hr", "countryId": "8fa8a2bc-4339-48ea-baaa-be614da597d0", "provinceId": "11ff93b5-ee56-4cbb-b39e-38a5e30190d3" }
    ]
}

// --- 2. Helper Functions for Formatting ---

const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
}).format(amount);

const formatDate = (dateString: string | null) => dateString ? new Date(dateString).toLocaleDateString() : 'N/A';

const statusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'active': return 'bg-green-600 hover:bg-green-700';
        case 'completed': return 'bg-blue-600 hover:bg-blue-700';
        case 'on_hold': case 'pending': return 'bg-yellow-600 hover:bg-yellow-700';
        case 'cancelled': case 'rejected': return 'bg-red-600 hover:bg-red-700';
        case 'received': return 'bg-purple-600 hover:bg-purple-700'; // New color for received donation
        default: return 'bg-gray-600 hover:bg-gray-700';
    }
};

// --- 3. New Progress Card Component ---

const ProgressCard = ({ data }: { data: ProjectData }) => {
    // Financial Metrics
    // NOTE: Removed 'totalReceivedDonations' calculation
    const budgetUtilization = Math.round((data.spent / data.budget) * 100);
    const budgetRemaining = data.budget - data.spent;

    // Time Metrics
    const start = new Date(data.startDate).getTime();
    // Use a conservative end date (e.g., today) if null for progress calculation
    const end = data.endDate ? new Date(data.endDate).getTime() : Date.now() + 86400000; // Assume 1 day buffer if ongoing
    const totalDuration = end - start;
    const elapsedDuration = Date.now() - start;
    const timeProgress = totalDuration > 0 && elapsedDuration > 0 
        ? Math.min(100, Math.round((elapsedDuration / totalDuration) * 100)) 
        : 0;
    
    // Safety check for budget progress
    const actualBudgetProgress = Math.min(100, budgetUtilization);
    const progressColor = actualBudgetProgress > 90 ? 'text-red-500' : 'text-green-500';

    return (
        <Card className="shadow-2xl border-2 border-indigo-200">
            <CardHeader>
                <CardTitle className="flex items-center text-3xl font-bold text-indigo-700">
                    <TrendingUp className="w-6 h-6 mr-3" />
                    Overall Progress
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                
                {/* Time Progress */}
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <p className="font-semibold text-lg">Time Elapsed</p>
                        <p className="font-bold text-indigo-600">{timeProgress}%</p>
                    </div>
                    <Progress value={timeProgress} className="h-3 bg-indigo-100" />
                    <div className="flex justify-between text-sm text-muted-foreground mt-1">
                        <span>Start: {formatDate(data.startDate)}</span>
                        <span>End: {formatDate(data.endDate)}</span>
                    </div>
                </div>
                
                <Separator />

                {/* Financial Progress */}
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <p className="font-semibold text-lg">Budget Utilization</p>
                        <p className={`font-bold text-lg ${progressColor}`}>{actualBudgetProgress}%</p>
                    </div>
                    <Progress value={actualBudgetProgress} className="h-3" indicatorColor={actualBudgetProgress > 90 ? 'bg-red-500' : 'bg-green-500'} />
                    <div className="grid grid-cols-3 gap-4 text-sm mt-2">
                        <div className="border-r pr-4">
                            <p className="font-medium text-muted-foreground">Total Budget</p>
                            <p className="font-bold text-gray-800">{formatCurrency(data.budget)}</p>
                        </div>
                        <div className="border-r pr-4">
                            <p className="font-medium text-muted-foreground">Amount Spent</p>
                            <p className="font-bold text-gray-800">{formatCurrency(data.spent)}</p>
                        </div>
                        <div>
                            <p className="font-medium text-muted-foreground">Remaining</p>
                            <p className={`font-bold ${budgetRemaining < 0 ? 'text-red-500' : 'text-green-600'}`}>
                                {formatCurrency(budgetRemaining)}
                            </p>
                        </div>
                    </div>
                </div>
                
                {/* NOTE: Removed Donation Summary Section */}
            </CardContent>
        </Card>
    );
};


// --- 4. Component Renders (Tabs Content) ---

const OverviewTab = ({ data }: { data: ProjectData }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        
        {/* Card 1: Manager */}
        <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Project Manager</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-xl font-bold">{data.manager.fullName}</div>
                <p className="text-xs text-muted-foreground mt-1">
                    Role: {data.manager.role.replace('_', ' ')}
                </p>
                <p className="text-xs text-muted-foreground">
                    Email: {data.manager.email}
                </p>
            </CardContent>
        </Card>

        {/* Card 2: Location */}
        <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Location</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-xl font-bold">{data.province.name}, {data.country.countryName}</div>
                <p className="text-xs text-muted-foreground mt-1">
                    Country Code: {data.country.code}
                </p>
                <p className="text-xs text-muted-foreground">
                    Province Code: {data.province.code}
                </p>
            </CardContent>
        </Card>
        
        {/* Card 3: Status & Approval */}
        <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Status & Approval</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="flex space-x-2">
                    <Badge className={`${statusColor(data.status)} capitalize text-white hover:cursor-default text-base`}>
                        {data.status.replace('_', ' ')}
                    </Badge>
                    <Badge variant="secondary" className={`${statusColor(data.approved)} capitalize text-white hover:cursor-default text-base`}>
                        {data.approved}
                    </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                    Started On: {formatDate(data.startDate)}
                </p>
                <p className="text-xs text-muted-foreground">
                    Ends On: {formatDate(data.endDate)}
                </p>
            </CardContent>
        </Card>
        
        {/* Description (Full Width) */}
        <div className="lg:col-span-3 mt-4">
            <h3 className="text-xl font-bold mb-2 border-b pb-1">Project Description</h3>
            <p className="text-gray-700">{data.description}</p>
        </div>
    </div>
);

const TeamTab = ({ workers }: { workers: Worker[] }) => (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workers.map((worker) => (
            <Card key={worker.id} className="p-4 shadow-md hover:shadow-xl transition-shadow border-l-4 border-indigo-400">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-lg font-semibold text-gray-800">{worker.fullName}</p>
                        <p className="text-sm text-indigo-600 capitalize">{worker.role.replace('_', ' ')}</p>
                    </div>
                    <Badge variant="secondary" className="bg-gray-200 text-gray-600 border border-gray-400">{worker.countryId.substring(0, 4)}...</Badge>
                </div>
            </Card>
        ))}
        {workers.length === 0 && <p className="text-muted-foreground p-4">No workers currently assigned to this project.</p>}
    </div>
);

// NOTE: Removed the entire DonationsTab component.


// --- 5. Main Page Component ---

export default function ProjectDetailsPage() {
    const data = projectData;

    return (
        <div className="min-h-screen ml-28 bg-gray-50 p-6 lg:p-10">
            {/* Header Section */}
            <header className="mb-10 border-b pb-4">
                <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">{data.title}</h1>
                <p className="text-lg text-indigo-600 flex items-center mt-2">
                    <MapPin className="w-5 h-5 mr-2" />
                    {data.province.name}, {data.country.countryName}
                </p>
            </header>

            {/* Progress Card (Replaces old stat cards) */}
            <div className="mb-10">
                <ProgressCard data={data} />
            </div>

            {/* Tabs Section */}
            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:w-fit mb-6 shadow-md">
                    <TabsTrigger value="overview">Details & Info</TabsTrigger>
                    <TabsTrigger value="team">Team ({data.workers.length})</TabsTrigger>
                    {/* NOTE: Removed the Donations/Financing tab trigger */}
                </TabsList>

                {/* Tab Content: Details & Info */}
                <TabsContent value="overview">
                    <Card className="shadow-xl">
                        <CardContent className="p-0">
                            <OverviewTab data={data} />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab Content: Team */}
                <TabsContent value="team">
                    <Card className="shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-2xl">Assigned Workers & Staff</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <TeamTab workers={data.workers} />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* NOTE: Removed Tab Content: Donations (Financing) */}
            </Tabs>
        </div>
    );
}
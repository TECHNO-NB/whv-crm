// @ts-nocheck
"use client";

import React, { useEffect, useState } from "react";
// Assuming these components are available via shadcn/ui:
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; 
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    DollarSign,
    Calendar,
    Pencil,
    FileText,
    User,
    Tag,
    Download,
    NotebookText,
    Loader2,
    XCircle,
    FileImage, // Added FileImage icon for clarity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import axios from "axios";

// --- Interfaces ---
type ExpenseStatus = "pending" | "approved" | "rejected";

interface Expense {
    id: string;
    amount: number;
    category: string;
    status: ExpenseStatus;
    // 🔑 UPDATED: Now an array of strings
    invoiceUrls?: string[]; 
    date?: string;
    notes?: string;
    submittedBy?: { name: string };
    project?: { title: string };
    approvedBy?: { name: string };
}

interface ExpenseCardProps {
    expense: Expense;
    onExpenseUpdate: (id: string, newStatus: ExpenseStatus) => void;
}


// --- 1. ExpenseReviewCard Component (Invoice Logic Modified) ---

export function ExpenseReviewCard({ expense, onExpenseUpdate }: ExpenseCardProps) {
    const [editOpen, setEditOpen] = useState(false);
    const [invoiceOpen, setInvoiceOpen] = useState(false);
    const [formData, setFormData] = useState({
        status: expense.status,
        notes: expense.notes || "",
    });

    // Determine if there are any invoices
    const hasInvoices = expense.invoiceUrls && expense.invoiceUrls.length > 0;

    const handleStatusChange = (value: string) => {
        setFormData({ ...formData, status: value as ExpenseStatus });
    };

    const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData({ ...formData, notes: e.target.value });
    };

    const handleSave = async () => {
        try {
            if (formData.status === expense.status && formData.notes === (expense.notes || "")) {
                toast("No changes to save.", { icon: "ℹ️" });
                setEditOpen(false);
                return;
            }
            
            const updateData = { status: formData.status, notes: formData.notes };
            
            // ⚠️ REAL API CALL - Use your actual endpoint here
            const res = await axios.put(`/api/v1/expenses/${expense.id}`, updateData, {
                 withCredentials: true,
            });

            if (res.status !== 200) {
                throw new Error(res.data?.message || "Failed to update expense status");
            }
            
            // Update local state and close modal
            onExpenseUpdate(expense.id, formData.status);
            toast.success(`Expense ${expense.id} successfully moved to ${formData.status.toUpperCase()}!`);
            setEditOpen(false);

        } catch (err: any) {
            console.error("Update Error:", err);
            const message = err.response?.data?.message || "Error updating expense status.";
            toast.error(message);
        }
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case "rejected":
                return "bg-red-600 text-white";
            case "approved":
                return "bg-green-600 text-white";
            case "pending":
            default:
                return "bg-yellow-500 text-gray-800";
        }
    };

    const formattedAmount = `$${expense.amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;

    const formattedDate = expense.date
        ? new Date(expense.date).toLocaleDateString()
        : "N/A";

    return (
        <Card className="w-full mt-6 max-w-sm rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="p-5">
                <div className="flex justify-between items-start">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <DollarSign size={20} className="text-green-600" />
                        {formattedAmount}
                    </h2>
                    <div className="flex items-center gap-2">
                        <Badge
                            variant="secondary"
                            className={`${getStatusBadgeClass(expense.status)} text-xs font-medium uppercase`}
                        >
                            {expense.status}
                        </Badge>

                        <Dialog open={editOpen} onOpenChange={setEditOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="p-1 hover:text-blue-500 text-gray-600"
                                    aria-label="Edit Expense Status"
                                >
                                    <Pencil size={16} />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[450px]">
                                {/* ... Edit Dialog Content (omitted for brevity) ... */}
                                <DialogHeader>
                                    <DialogTitle>Review Expense: {formattedAmount}</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div><Label>Category</Label><Input value={expense.category} disabled className="bg-gray-50" /></div>
                                    <div>
                                        <Label htmlFor="status">New Status</Label>
                                        <Select onValueChange={handleStatusChange} value={formData.status}>
                                            <SelectTrigger id="status"><SelectValue placeholder="Select Status" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="approved">Approved</SelectItem>
                                                <SelectItem value="rejected">Rejected</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="notes">Reviewer Notes (Optional)</Label>
                                        <Textarea
                                            id="notes"
                                            value={formData.notes}
                                            onChange={handleNoteChange}
                                            placeholder="Add notes for the submission user..."
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="secondary" onClick={() => setEditOpen(false)}>Cancel</Button>
                                    <Button onClick={handleSave} className="bg-blue-600 text-white hover:bg-blue-700">
                                        Update Review
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
                
                {/* Details Section */}
                <div className="grid grid-cols-1 gap-3 mt-3 text-sm text-gray-700 border-b pb-3">
                    <div className="flex items-center gap-1"><Tag size={14} className="text-gray-500" />
                        <span className="font-medium">Category:</span><span className="truncate">{expense.category}</span>
                    </div>
                    <div className="flex items-center gap-1"><NotebookText size={14} className="text-gray-500" />
                        <span className="font-medium">Project:</span><span className="truncate">{expense.project?.title || "General"}</span>
                    </div>
                    <div className="flex items-center gap-1"><Calendar size={14} className="text-gray-500" />
                        <span className="font-medium">Date:</span><span className="truncate">{formattedDate}</span>
                    </div>
                </div>

                {/* Invoice Button & Dialog (MODIFIED) */}
                <Dialog open={invoiceOpen} onOpenChange={setInvoiceOpen}>
                    <DialogTrigger asChild>
                        <Button
                            className="mt-4 w-full"
                            variant="outline"
                            disabled={!hasInvoices}
                        >
                            <FileImage size={18} className="mr-2" />
                            {hasInvoices ? `View ${expense.invoiceUrls.length} Invoice${expense.invoiceUrls.length > 1 ? 's' : ''}` : "No Invoice Attached"}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader><DialogTitle>Invoices for: {formattedAmount}</DialogTitle></DialogHeader>
                        <div className="py-4">
                            {hasInvoices ? (
                                <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto p-2">
                                    <p className="text-gray-600 mb-2">Attached Documents ({expense.invoiceUrls.length}):</p>
                                    {/* 🔑 Iterate over the array to show multiple links */}
                                    {expense.invoiceUrls.map((url, index) => (
                                        <a 
                                            key={index}
                                            href={url} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="flex items-center justify-between gap-2 p-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
                                        >
                                            <div className="flex items-center gap-2">
                                                <FileText size={18} />
                                                Document #{index + 1} 
                                            </div>
                                            <Download size={18} />
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-500">No invoice URLs were provided for this expense.</p>
                            )}
                        </div>
                        <DialogFooter><Button variant="secondary" onClick={() => setInvoiceOpen(false)}>Close</Button></DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}


// --- 2. ExpenseReviewDemo (API Integrated) ---

export default function ExpenseReviewDemo() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // 🔑 Data Fetching Logic (using axios)
    useEffect(() => {
        const fetchExpenses = async () => {
            setLoading(true);
            setError(null);
            try {
                const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/expenses`;
                
                const res = await axios.get(url, {
                    withCredentials: true,
                });
                
                // Assuming res.data.data is the array of expenses
                // You must ensure your API now returns 'invoiceUrls' as an array of strings.
                setExpenses(res.data.data || []);
            } catch (err: any) {
                console.error("Error fetching expenses:", err);
                setError(err.response?.data?.message || "Failed to load expenses from API.");
            } finally {
                setLoading(false);
            }
        };
        fetchExpenses();
    }, []);

    // Function to update the expense status in the parent state
    const handleExpenseUpdate = (id: string, newStatus: ExpenseStatus) => {
        setExpenses(prevExpenses =>
            prevExpenses.map(exp =>
                exp.id === id ? { ...exp, status: newStatus } : exp
            )
        );
    };

    const renderExpenses = (status: ExpenseStatus) => {
        const filteredExpenses = expenses.filter(exp => exp.status === status);
        
        if (loading) {
            return (
                <div className="text-center py-10 col-span-full text-blue-500 bg-white rounded-lg mt-4 flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin h-5 w-5" /> Loading Expenses...
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center py-10 col-span-full text-red-600 bg-white rounded-lg mt-4 flex items-center justify-center gap-2 border border-red-300">
                    <XCircle className="h-5 w-5" /> Error: {error}
                </div>
            );
        }

        if (filteredExpenses.length === 0) {
            return (
                <div className="text-center py-10 col-span-full text-gray-500 bg-white rounded-lg border border-dashed mt-4">
                    No expenses currently in the **{status.toUpperCase()}** stage.
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                {filteredExpenses.map(expense => (
                    <ExpenseReviewCard 
                        key={expense.id} 
                        expense={expense} 
                        onExpenseUpdate={handleExpenseUpdate}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen ml-28">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">
                Expense Review Dashboard 💸
            </h1>

            <Tabs defaultValue="pending" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="pending">
                        Pending ({expenses.filter(e => e.status === 'pending').length})
                    </TabsTrigger>
                    <TabsTrigger value="approved">
                        Approved ({expenses.filter(e => e.status === 'approved').length})
                    </TabsTrigger>
                    <TabsTrigger value="rejected">
                        Rejected ({expenses.filter(e => e.status === 'rejected').length})
                    </TabsTrigger>
                </TabsList>

                {/* --- Tab Content Renders --- */}
                <TabsContent value="pending">{renderExpenses("pending")}</TabsContent>
                <TabsContent value="approved">{renderExpenses("approved")}</TabsContent>
                <TabsContent value="rejected">{renderExpenses("rejected")}</TabsContent>
            </Tabs>
        </div>
    );
}
"use client";

import React, { useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { List, Loader2, Paperclip, X } from "lucide-react";
import toast from "react-hot-toast";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void; // optional callback after successful save
}

const EXPENSE_CATEGORIES = [
  "temple_maintenance",
  "festival_event",
  "charity_support",
  "education_support",
  "medical_assistance",
  "food_prasad",
  "travel_transport",
  "office_supplies",
  "staff_salary",
  "utility_bills",
  "construction_renovation",
  "miscellaneous",
  "project",
];

const COUNTRIES = [
  "Nepal",
  "India",
  "USA",
  "UK",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "China",
  "Brazil",
  "South Korea",
  "Italy",
  "Mexico",
  "Singapore",
];

interface FileWithPreview {
  file: File;
  preview: string; // object URL for image preview
  id: string;
}

const AddExpenseDialog: React.FC<DialogProps> = ({ isOpen, onClose, onSave }) => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API = process.env.NEXT_PUBLIC_BACKEND_URL || "";

  // generate unique id for files
  const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36);

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const newFiles: FileWithPreview[] = Array.from(e.target.files).map((file) => ({
      file,
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : "",
      id: uid(),
    }));

    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleSave = async () => {
    setError(null);

    if (!amount || !category || !country) {
      setError("Please fill required fields.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("amount", amount);
      formData.append("category", category);
      formData.append("countryId", "43389dd9-38b6-4338-b3fb-d64fb9eef5cb");
      formData.append("notes", description);
      formData.append("date", new Date().toISOString());
      formData.append("submittedById", "ca9aed80-8cd5-43dd-8ef6-84889fdb71f3"); // replace with actual user ID

      files.forEach((f) => formData.append("invoiceUrl", f.file));

      const res = await axios.post(`${API}/api/v1/expenses`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        setAmount("");
        setCategory("");
        setCountry("");
        setDescription("");
        setFiles([]);
        toast.success("Added Success")
        if (onSave) onSave();
        onClose()
        
      } else {
        setError("Failed to create expense.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <List className="w-5 h-5 text-red-500" /> Add New Expense
          </DialogTitle>
          <DialogDescription>
            Record a new outgoing transaction. Required fields are marked.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="mb-2 p-2 bg-red-100 text-red-700 rounded">{error}</div>
        )}

        <div className="grid gap-4 py-4">
          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="expense-amount">Amount ($) *</Label>
            <Input
              id="expense-amount"
              placeholder="5000"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Category *</Label>
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

          {/* Country */}
          <div className="space-y-2">
            <Label>Country *</Label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="expense-description">Description (Optional)</Label>
            <Textarea
              id="expense-description"
              placeholder="Short memo for this expense"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Attachments */}
          <div className="space-y-2">
            <Label>Attachments (Optional)</Label>
            <input
              type="file"
              multiple
              onChange={handleFilesChange}
              className="w-full"
            />
            {files.length > 0 && (
              <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                {files.map((f) => (
                  <div key={f.id} className="relative border rounded-md p-1 w-full h-24 flex flex-col items-center justify-center overflow-hidden">
                    {f.preview ? (
                      <img src={f.preview} alt={f.file.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-xs text-gray-600 p-2">
                        <Paperclip className="w-4 h-4 mb-1" />
                        <span className="truncate w-full text-[12px]">{f.file.name}</span>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => removeFile(f.id)}
                      className="absolute top-1 right-1 bg-white/90 p-1 rounded-full hover:bg-red-100"
                      title="Remove"
                    >
                      <X className="w-3 h-3 text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-red-500 hover:bg-red-600"
            disabled={loading || !amount || !category || !country}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Expense"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddExpenseDialog;

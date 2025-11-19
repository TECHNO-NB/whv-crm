"use client";

import React, { useState } from "react";
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
import { List } from "lucide-react";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
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

const AddExpenseDialog: React.FC<DialogProps> = ({ isOpen, onClose, onSave }) => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [description, setDescription] = useState("");

  const handleSave = () => {
    onSave({
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <List className="w-5 h-5 mr-2 text-red-500" />
            Add New Expense
          </DialogTitle>
          <DialogDescription>
            Record a new outgoing transaction. Required fields are marked.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Amount */}
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

          {/* Category */}
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

          {/* Country */}
          <div className="space-y-2">
            <Label>Country</Label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {[
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
                ].map((c) => (
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

export default AddExpenseDialog;

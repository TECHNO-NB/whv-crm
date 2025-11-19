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
import { Select,SelectContent,SelectItem ,SelectTrigger,SelectValue} from "./ui/select";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PiggyBank } from "lucide-react";

const AddDonationDialog: React.FC<any> = ({
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

export  default AddDonationDialog;
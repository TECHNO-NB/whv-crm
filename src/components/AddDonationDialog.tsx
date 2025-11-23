"use client";

import React, { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PiggyBank } from "lucide-react";

const AddDonationDialog: React.FC<any> = ({ isOpen, onClose, onSave }) => {
  const [amount, setAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [country, setCountry] = useState<string>("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // --- Countries from server ---
  const [countries, setCountries] = useState<
    { countryId: string; countryName: string }[]
  >([]);
  const [loadingCountries, setLoadingCountries] = useState(false);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoadingCountries(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/country`
        );
        const data = await res.json();
        if (data.success) {
          setCountries(data.data); // Expect data.data = [{ countryId, countryName }]
        } else {
          console.error("Failed to fetch countries:", data.message);
        }
      } catch (err) {
        console.error("Error fetching countries:", err);
      } finally {
        setLoadingCountries(false);
      }
    };
    fetchCountries();
  }, []);

  const handleSave = async () => {
    if (!amount) {
      alert("Amount is required");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("amount", amount);
      if (donorName) formData.append("donorName", donorName);
      if (donorEmail) formData.append("donorEmail", donorEmail);
      if (donorPhone) formData.append("donorPhone", donorPhone);
      if (country) formData.append("countryId", country);
      if (receiptFile) formData.append("receiptUrl", receiptFile);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/donations`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      onSave?.(res.data.data);

      // Reset form
      setAmount("");
      setDonorName("");
      setDonorEmail("");
      setDonorPhone("");
      setCountry("");
      setReceiptFile(null);
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to create donation");
    }

    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
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
            <Label htmlFor="donation-amount">Amount ($) *</Label>
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
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="donor-email">Donor Email</Label>
            <Input
              id="donor-email"
              placeholder="email@example.com"
              type="email"
              value={donorEmail}
              onChange={(e) => setDonorEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="donor-phone">Donor Phone</Label>
            <Input
              id="donor-phone"
              placeholder="+1234567890"
              type="tel"
              value={donorPhone}
              onChange={(e) => setDonorPhone(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Country</Label>
            <Select
              value={country}
              onValueChange={setCountry}
              disabled={loadingCountries}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    loadingCountries ? "Loading..." : "Select country"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {countries.map((c:any) => (
                  <SelectItem key={c?.id} value={c?.id}>
                    {c.countryName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="receipt-file">Receipt Image</Label>
            <Input
              id="receipt-file"
              type="file"
              accept="image/*"
              onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading || !amount}
            className="bg-green-500 hover:bg-green-600"
          >
            {loading ? "Saving..." : "Record Donation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddDonationDialog;

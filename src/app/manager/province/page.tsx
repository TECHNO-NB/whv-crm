"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "@/components/ui/select";

interface Province {
  id: string;
  name: string;
  code?: string | null;
  countryId: string;
}

export default function ProvincePage() {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [countryId, setCountryId] = useState("");

  const [editId, setEditId] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);

  // Fetch Provinces
  const fetchProvinces = async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/province`
    );
    setProvinces(res.data.data);
  };

  // Fetch Countries
  const fetchCountries = async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/country`
    );
    setCountries(res.data.data);
  };

  useEffect(() => {
    fetchProvinces();
    fetchCountries();
  }, []);

  // Open Add Modal
  const openAddModal = () => {
    setEditId(null);
    setName("");
    setCode("");
    setCountryId("");
    setOpenModal(true);
  };

  // Create / Update
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const payload = { name, code, countryId };

    if (!editId) {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/province`,
        payload
      );
    } else {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/province/${editId}`,
        payload
      );
    }

    setName("");
    setCode("");
    setCountryId("");
    setEditId(null);
    setOpenModal(false);

    fetchProvinces();
  };

  // Edit
  const handleEdit = (province: Province) => {
    setEditId(province.id);
    setName(province.name);
    setCode(province.code || "");
    setCountryId(province.countryId);
    setOpenModal(true);
  };

  // Delete
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure?")) {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/province/${id}`
      );
      fetchProvinces();
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="flex-row justify-between items-center">
          <CardTitle className="text-2xl font-bold">
            🏛 Province Management
          </CardTitle>

          <Button className="bg-blue-600" onClick={openAddModal}>
            + Add Province
          </Button>
        </CardHeader>

        <CardContent>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Code</th>
                <th className="p-3 border">Country</th>
                <th className="p-3 border text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {provinces.map((p) => (
                <tr
                  key={p.id}
                  className="border hover:bg-gray-50 transition-all"
                >
                  <td className="p-3 border font-medium">{p.name}</td>
                  <td className="p-3 border">{p.code || "-"}</td>
                  <td className="p-3 border">
                    {countries.find((c) => c.id === p.countryId)?.countryName ||
                      p.countryId}
                  </td>
                  <td className="p-3 border text-center space-x-2">
                    <Button
                      variant="secondary"
                      className="bg-yellow-500 text-white hover:bg-yellow-600"
                      onClick={() => handleEdit(p)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(p.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {provinces.length === 0 && (
            <p className="text-center text-gray-500 py-4">
              No provinces found
            </p>
          )}
        </CardContent>
      </Card>

      {/* ===========================
          MODAL (ADD / EDIT FORM)
      ============================ */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editId ? "Update Province" : "Add New Province"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <Input
              type="text"
              placeholder="Province Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              type="text"
              placeholder="Code (Optional)"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />

            {/* COUNTRY SELECT */}
            <Select
              value={countryId}
              onValueChange={(v) => setCountryId(v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>

              <SelectContent>
                {countries.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.countryName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button className="w-full bg-blue-600" type="submit">
              {editId ? "Update Province" : "Add Province"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

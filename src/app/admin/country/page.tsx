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

interface Country {
  id: string;
  countryName: string;
  code?: string | null;
}

export default function CountryPage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [countryName, setCountryName] = useState("");
  const [code, setCode] = useState("");

  const [editId, setEditId] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);

  // Fetch all countries
  const fetchCountries = async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/country`
    );
    setCountries(res.data.data);
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  // Open Add modal
  const openAddModal = () => {
    setEditId(null);
    setCountryName("");
    setCode("");
    setOpenModal(true);
  };

  // Create or Update
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const payload = { countryName, code };

    if (!editId) {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/country`,
        payload
      );
    } else {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/country/${editId}`,
        payload
      );
    }

    setCountryName("");
    setCode("");
    setEditId(null);
    setOpenModal(false);

    fetchCountries();
  };

  // Edit action
  const handleEdit = (c: Country) => {
    setEditId(c.id);
    setCountryName(c.countryName);
    setCode(c.code || "");
    setOpenModal(true);
  };

  // Delete action
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure?")) {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/country/${id}`
      );
      fetchCountries();
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="flex-row justify-between items-center">
          <CardTitle className="text-2xl font-bold">
            🌍 Country Management
          </CardTitle>

          <Button className="bg-blue-600" onClick={openAddModal}>
            + Add New Country
          </Button>
        </CardHeader>

        <CardContent>
          <table className="w-full border-collapse rounded-lg overflow-hidden text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border">Country Name</th>
                <th className="p-3 border">Code</th>
                <th className="p-3 border text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {countries.map((c: any) => (
                <tr
                  key={c.id}
                  className="border hover:bg-gray-50 transition-all"
                >
                  <td className="p-3 border font-medium">{c.countryName}</td>
                  <td className="p-3 border">{c.code || "-"}</td>
                  <td className="p-3 border text-center space-x-2">
                    <Button
                      variant="secondary"
                      className="bg-yellow-500 text-white hover:bg-yellow-600"
                      onClick={() => handleEdit(c)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(c.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {countries.length === 0 && (
            <p className="text-center text-gray-500 py-4">
              No countries found
            </p>
          )}
        </CardContent>
      </Card>

      {/* ===========================
          MODAL (ADD + UPDATE)
      ============================ */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editId ? "Update Country" : "Add New Country"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <Input
              type="text"
              placeholder="Country Name"
              value={countryName}
              onChange={(e) => setCountryName(e.target.value)}
              required
            />

            <Input
              type="text"
              placeholder="Country Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />

            <Button className="w-full bg-blue-600" type="submit">
              {editId ? "Update Country" : "Add Country"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

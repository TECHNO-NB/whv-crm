// app/legal-cases/page.tsx
// @ts-nocheck
"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Plus, Search, Calendar, FileText, User, Tag, X } from "lucide-react";

const API_BASE_URL = "/api/legal-cases";
const USER_API_URL = "/api/users";

// ---------------- SMALL UI COMPONENTS ----------------
const Badge = ({ children, className = "" }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${className}`}>{children}</span>
);

const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-6 bg-black/40">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl overflow-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-lg font-semibold flex items-center gap-2">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-100">
            <X />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// ---------------- PAGE START ----------------
export default function LegalCasesPage() {
  const [cases, setCases] = useState([]);
  const [users, setUsers] = useState([]);

  const [query, setQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Create Modal
  const [openCreate, setOpenCreate] = useState(false);

  // Form fields
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("other");
  const [formPriority, setFormPriority] = useState("medium");
  const [formAssignedTo, setFormAssignedTo] = useState("");
  const [formApplicant, setFormApplicant] = useState("");
  const [formRespondent, setFormRespondent] = useState("");
  const [formFilingDate, setFormFilingDate] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [formFiles, setFormFiles] = useState<FileList | null>(null);

  // ---------------- FETCH USERS ----------------
  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users`);
      setUsers(res.data.data || []);
    } catch (err) {
      console.error("User fetch failed");
    }
  }, []);

  // ---------------- FETCH CASES ----------------
  const fetchCases = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
        axios.defaults.withCredentials=true;
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/legal`);

      setCases(res.data.data.cases || []);
      console.log("+++++++++++++cases",res.data.data)
    } catch (err) {
      setError("Failed to fetch cases");
    } finally {
      setLoading(false);
    }
  }, [query, filterStatus, filterCategory]);

  useEffect(() => {
    fetchUsers();
    fetchCases();
  }, [fetchUsers, fetchCases]);

  // ---------------- CREATE CASE ----------------
  const submitCreate = async () => {
    const fd = new FormData();
    fd.append("title", formTitle);
    fd.append("category", formCategory);
    fd.append("priority", formPriority);
    fd.append("applicantId", formApplicant);
    fd.append("respondentId", formRespondent);
    fd.append("assignedToId", formAssignedTo);
    fd.append("filingDate", formFilingDate);
    fd.append("notes", formNotes);

    if (formFiles) {
      Array.from(formFiles).forEach((f) => fd.append("documents", f));
    }

    try {
      await axios.post(API_BASE_URL, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setOpenCreate(false);
      fetchCases();
    } catch (err) {
      alert("Failed to create case");
    }
  };

  // ---------------- FILTER RENDER ----------------
  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      if (query && !(`${c.title} ${c.caseNumber}`.toLowerCase().includes(query.toLowerCase())))
        return false;

      return true;
    });
  }, [cases, query]);

  return (
    <div className="min-h-screen p-8 bg-gray-50 ml-28">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Legal Cases</h1>
            <p className="text-sm text-gray-600">Manage all legal cases here.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                className="pl-10 pr-3 py-2 rounded-lg border w-64 bg-white"
                placeholder="Search cases"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            </div>

            <button
              onClick={() => setOpenCreate(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"
            >
              <Plus /> New Case
            </button>
          </div>
        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap gap-3 mb-6">
          <select className="p-2 border rounded-md" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="on_hold">On Hold</option>
            <option value="closed">Closed</option>
          </select>

          <select className="p-2 border rounded-md" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="all">All Categories</option>
            <option value="land">Land</option>
            <option value="financial">Financial</option>
            <option value="employment">Employment</option>
            <option value="fraud">Fraud</option>
            <option value="harassment">Harassment</option>
            <option value="property">Property</option>
            <option value="other">Other</option>
          </select>

          <div className="ml-auto text-sm text-gray-700">
            Showing {filteredCases.length} of {cases.length}
          </div>
        </div>

        {/* CASE LIST */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCases.map((c) => (
              <article key={c.id} className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition">
                <header className="flex justify-between">
                  <div>
                    <p className="text-xs text-gray-500">{c.caseNumber}</p>
                    <h3 className="font-semibold">{c.title}</h3>
                  </div>
                  <Badge className="bg-blue-600 text-white">{c.priority}</Badge>
                </header>

                <p className="text-sm text-gray-600 mt-3 line-clamp-2">{c.description || "No description"}</p>

                <div className="mt-4 border-t pt-3 flex justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {c.applicant?.fullName || "Applicant"}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {c.filingDate ? new Date(c.filingDate).toLocaleDateString() : "N/A"}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {filteredCases.length === 0 && <div>No cases found.</div>}
      </div>

      {/* CREATE MODAL */}
      <Modal open={openCreate} onClose={() => setOpenCreate(false)} title={<><Tag /> Create New Case</>}>
        <div className="space-y-4">
          <input className="border p-2 w-full" placeholder="Case Title" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} />

          <textarea className="border p-2 w-full" rows={3} placeholder="Notes" value={formNotes} onChange={(e) => setFormNotes(e.target.value)} />

          <input type="date" value={formFilingDate} onChange={(e) => setFormFilingDate(e.target.value)} className="border p-2 w-full" />

          <input type="file" multiple onChange={(e) => setFormFiles(e.target.files)} className="border p-2 w-full" />

          <button onClick={submitCreate} className="bg-blue-600 text-white px-4 py-2 rounded-md w-full">
            Submit
          </button>
        </div>
      </Modal>
    </div>
  );
}

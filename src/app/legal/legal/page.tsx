// app/legal-cases/page.tsx
// @ts-nocheck
"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Plus, Search, Calendar, FileText, User, Tag, X, File, Image, ClipboardList, Globe } from "lucide-react"; 
import toast from "react-hot-toast";

// --- CONFIGURATION ---
const API_BASE_URL = "/api/legal-cases"; 

// --- UTILITY DATA ---
const STATUS_COLORS = {
  open: "bg-green-100 text-green-800",
  in_progress: "bg-blue-100 text-blue-800",
  on_hold: "bg-yellow-100 text-yellow-800",
  closed: "bg-red-100 text-red-800",
};

const PRIORITY_COLORS = {
  low: "bg-green-500 text-white",
  medium: "bg-yellow-500 text-white",
  high: "bg-red-600 text-white",
};

const CATEGORIES = [
  "land",
  "financial",
  "employment",
  "fraud",
  "harassment",
  "property",
  "other",
];

const PRIORITIES = ["low", "medium", "high"];

// --- UTILITY FUNCTIONS ---
const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, ' ') : 'N/A');

const isImage = (filename) => {
  if (!filename) return false;
  const extension = filename.split('.').pop().toLowerCase();
  return ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'tiff'].includes(extension);
};

// ---------------- SMALL UI COMPONENTS ----------------

const Badge = ({ children, className = "" }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${className}`}>{children}</span>
);

const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-6 bg-black/40">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl overflow-auto max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white z-10">
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
  
  // LOCATION STATES
  const [countries, setCountries] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false); 

  const [query, setQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); 
  const [filterCategory, setFilterCategory] = useState("all");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Modals
  const [openCreate, setOpenCreate] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);

  // Form fields
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState(CATEGORIES[0] || "other"); 
  const [formPriority, setFormPriority] = useState(PRIORITIES[1] || "medium"); 
  const [formAssignedTo, setFormAssignedTo] = useState("");
  const [formApplicant, setFormApplicant] = useState("");
  const [formRespondent, setFormRespondent] = useState("");
  const [formCountryId, setFormCountryId] = useState(""); 
  const [formProvinceId, setFormProvinceId] = useState(""); 
  const [formFilingDate, setFormFilingDate] = useState("");
  const [formHearingDates, setFormHearingDates] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [formFiles, setFormFiles] = useState(null);
  const [loader,setIsLoader]=useState(false)


  // ---------------- FETCHERS ----------------
  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users`);
      setUsers(res.data.data || []);
    } catch (err) {
      console.error("User fetch failed", err);
    }
  }, []);

  const fetchCases = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
        axios.defaults.withCredentials=true;
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/legal`);
      setCases(res.data.data?.cases || []);
    } catch (err) {
      setError("Failed to fetch cases");
    } finally {
      setLoading(false);
    }
  }, []); 

  const fetchCountries = useCallback(async () => {
    try {
        setLoadingCountries(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/country`);
        const data = await res.json();
        if (data.success) {
            setCountries(data.data);
        } else {
            console.error("Failed to fetch countries:", data.message);
        }
    } catch (err) {
        console.error("Error fetching countries:", err);
    } finally {
        setLoadingCountries(false);
    }
  }, []);

  const fetchProvinces = useCallback(async () => {
      try {
          const res = await axios.get(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/province`
          );
          setProvinces(res.data.data);
      } catch (err) {
          console.log("Error fetching provinces:", err);
      }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchCases();
    fetchCountries();
    fetchProvinces();
  }, [fetchUsers, fetchCases, fetchCountries, fetchProvinces]);

  // ---------------- VIEW LOGIC ----------------
  const handleView = (caseData) => {
    setSelectedCase(caseData);
    setOpenView(true);
  };
  
  // ---------------- CREATE CASE ----------------
  const submitCreate = async (e) => {
    e.preventDefault(); 
    setIsLoader(true)

    if (!formTitle || !formCategory || !formCountryId) {
      alert("Please fill in the Case Title, Category, and Country.");
       setIsLoader(false)
      return;
    }


    const fd = new FormData();
    fd.append("title", formTitle);
    fd.append("category", formCategory);
    fd.append("priority", formPriority);
    
    if (formDescription) fd.append("description", formDescription);
    
    // Location data
    if (formCountryId) fd.append("countryId", formCountryId);
    if (formProvinceId) fd.append("provinceId", formProvinceId);
    
    // User Relations
    if (formApplicant) fd.append("applicantId", formApplicant);
    if (formRespondent) fd.append("respondentId", formRespondent);
    if (formAssignedTo) fd.append("assignedToId", formAssignedTo);
    
    // Dates & Arrays
    fd.append("filingDate", formFilingDate); 
    if (formHearingDates) fd.append("hearingDates", formHearingDates);
    fd.append("notes", formNotes); 

    // Documents
    if (formFiles) {
      Array.from(formFiles).forEach((f) => fd.append("documents", f));
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/legal`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setOpenCreate(false);
         setIsLoader(false)
      toast.success("Legal case creating...")
      fetchCases(); 
    } catch (err) {
         setIsLoader(false)
      toast.error("Failed to create case");
    }
  };


  // ---------------- FILTER RENDER ----------------
  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      // 1. Search Query Filter
      if (query) {
        const fullSearchString = `${c.title || ""} ${c.caseNumber || ""}`.toLowerCase();
        if (!fullSearchString.includes(query.toLowerCase())) {
          return false;
        }
      }

      // 2. Status Filter
      if (filterStatus !== "all" && c.status !== filterStatus) {
        return false;
      }

      // 3. Category Filter
      if (filterCategory !== "all" && c.category !== filterCategory) {
        return false;
      }

      return true;
    });
  }, [cases, query, filterStatus, filterCategory]);


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
              <Plus size={18} /> New Case
            </button>
          </div>
        </div>
        
        <hr className="my-4" />

        {/* FILTERS */}
        <div className="flex flex-wrap gap-3 mb-6">
          <select 
            className="p-2 border rounded-md" 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="on_hold">On Hold</option>
            <option value="closed">Closed</option>
          </select>

          <select 
            className="p-2 border rounded-md" 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{capitalize(cat)}</option>
            ))}
          </select>

          <div className="ml-auto text-sm text-gray-700 flex items-center">
            Showing **{filteredCases.length}** of **{cases.length}** cases
          </div>
        </div>
        
        <hr className="my-4" />

        {/* CASE LIST */}
        {error && <div className="text-red-600 p-3 bg-red-50 rounded-md">Error: {error}</div>}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCases.map((c) => {
              const documents = c.documents || [];
              const imageDocuments = documents.filter(isImage);
              const otherDocumentsCount = documents.length - imageDocuments.length;
              
              return (
                <article 
                  key={c.id} 
                  className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition flex flex-col justify-between cursor-pointer"
                  onClick={() => handleView(c)}
                >
                  <header>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs text-gray-500 font-mono">{c.caseNumber}</p>
                        <h3 className="font-semibold text-lg line-clamp-1">{c.title}</h3>
                      </div>
                      <Badge className={PRIORITY_COLORS[c.priority] || PRIORITY_COLORS.medium}>{capitalize(c.priority)}</Badge>
                    </div>
                    <div className="mt-1">
                        <Badge className={STATUS_COLORS[c.status] || STATUS_COLORS.open}>{capitalize(c.status || 'open')}</Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-3 line-clamp-2">{c.description || "No description provided."}</p>
                  </header>

                  <div className="mt-4 border-t pt-3 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Tag className="w-4 h-4 text-purple-500" />
                      <span className="font-medium">{capitalize(c.category || 'other')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="w-4 h-4 text-blue-500" />
                      Applicant: {c.applicant?.fullName || "N/A"}
                    </div>
                    
                    {/* Image Count */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Image className="w-4 h-4 text-indigo-600" /> 
                      Images: <span className="font-bold">{imageDocuments.length}</span>
                    </div>
                    
                    {/* Other Documents Count */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <File className="w-4 h-4 text-yellow-600" /> 
                      Other Docs: <span className="font-bold">{otherDocumentsCount}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-green-500" />
                      Filed: {c.filingDate ? new Date(c.filingDate).toLocaleDateString() : "N/A"}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}

        {filteredCases.length === 0 && !loading && (
          <div className="text-center p-10 text-gray-500 border-2 border-dashed rounded-lg mt-6">
            No cases found matching your criteria.
          </div>
        )}
      </div>

      {/* -------------------- CREATE MODAL -------------------- */}
      <Modal 
        open={openCreate} 
        onClose={() => setOpenCreate(false)} 
        title={<><Plus size={20} /> Create New Case</>}
      >
        <form onSubmit={submitCreate} className="space-y-4">
          
          <label className="block text-sm font-medium text-gray-700">Case Title*</label>
          <input className="border p-2 w-full rounded-md" placeholder="Case Title" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} required/>

          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea className="border p-2 w-full rounded-md" rows={2} placeholder="Brief description of the case" value={formDescription} onChange={(e) => setFormDescription(e.target.value)}/>
          
          <label className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea className="border p-2 w-full rounded-md" rows={2} placeholder="Detailed notes/log entries" value={formNotes} onChange={(e) => setFormNotes(e.target.value)}/>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Category*</label>
                <select className="border p-2 w-full rounded-md" value={formCategory} onChange={(e) => setFormCategory(e.target.value)} required>
                    {CATEGORIES.map(cat => (<option key={cat} value={cat}>{capitalize(cat)}</option>))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Priority</label>
                <select className="border p-2 w-full rounded-md" value={formPriority} onChange={(e) => setFormPriority(e.target.value)}>
                    {PRIORITIES.map(p => (<option key={p} value={p}>{capitalize(p)}</option>))}
                </select>
            </div>
          </div>

          {/* LOCATION FIELDS */}
          <div className="grid grid-cols-2 gap-4">
              <div>
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                    <Globe size={14} className="text-blue-500"/> Country*
                  </label>
                  <select 
                      className="border p-2 w-full rounded-md" 
                      value={formCountryId} 
                      onChange={(e) => setFormCountryId(e.target.value)}
                      required
                  >
                      <option value="">{loadingCountries ? 'Loading Countries...' : 'Select Country'}</option>
                      {countries.map(c => (
                          <option key={c.id} value={c.id}>{c.countryName}</option> 
                      ))}
                  </select>
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700">Province ID</label>
                  <select 
                      className="border p-2 w-full rounded-md" 
                      value={formProvinceId} 
                      onChange={(e) => setFormProvinceId(e.target.value)}
                  >
                      <option value="">Select Province (Optional)</option>
                      {provinces.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option> 
                      ))}
                  </select>
              </div>
          </div>

          {/* USER RELATIONS */}
          <div className="grid grid-cols-3 gap-4">
              <div>
                  <label className="block text-sm font-medium text-gray-700">Applicant</label>
                  <select className="border p-2 w-full rounded-md" value={formApplicant} onChange={(e) => setFormApplicant(e.target.value)}>
                      <option value="">Select Applicant</option>
                      {users.map(user => (<option key={user.id} value={user.id}>{user.fullName}</option>))}
                  </select>
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700">Respondent</label>
                  <select className="border p-2 w-full rounded-md" value={formRespondent} onChange={(e) => setFormRespondent(e.target.value)}>
                      <option value="">Select Respondent</option>
                      {users.map(user => (<option key={user.id} value={user.id}>{user.fullName}</option>))}
                  </select>
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700">Assigned To</label>
                  <select className="border p-2 w-full rounded-md" value={formAssignedTo} onChange={(e) => setFormAssignedTo(e.target.value)}>
                      <option value="">Select Assignee</option>
                      {users.map(user => (<option key={user.id} value={user.id}>{user.fullName}</option>))}
                  </select>
              </div>
          </div>
          
          {/* DATES */}
          <div className="grid grid-cols-2 gap-4">
              <div>
                  <label className="block text-sm font-medium text-gray-700">Filing Date</label>
                  <input type="date" value={formFilingDate} onChange={(e) => setFormFilingDate(e.target.value)} className="border p-2 w-full rounded-md" />
              </div>
              <div>
                   <label className="block text-sm font-medium text-gray-700">Hearing Dates (e.g., YYYY-MM-DD, YYYY-MM-DD)</label>
                   <input type="text" value={formHearingDates} onChange={(e) => setFormHearingDates(e.target.value)} className="border p-2 w-full rounded-md" placeholder="2025-10-01, 2025-11-15"/>
              </div>
          </div>
          
          {/* DOCUMENTS */}
          <label className="block text-sm font-medium text-gray-700">Documents (Multiple files, max 5)</label>
          <input type="file" multiple onChange={(e) => setFormFiles(e.target.files)} className="border p-2 w-full rounded-md bg-gray-50 file:border-0 file:bg-gray-200 file:text-gray-700 file:px-3 file:py-1 file:rounded-md file:mr-4" />

          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md w-full font-semibold transition">
           {loader ? "Saving..." : "Create Case"}  
          </button>
        </form>
      </Modal>

      {/* -------------------- VIEW DETAIL MODAL -------------------- */}
      <Modal
        open={openView}
        onClose={() => setOpenView(false)}
        title={<><ClipboardList size={20} /> Case #{selectedCase?.caseNumber}</>}
      >
        {selectedCase && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">{selectedCase.title}</h2>
            <p className="text-sm text-gray-600 flex items-center gap-3">
              **Category:** <Badge className="bg-gray-200 text-gray-800">{capitalize(selectedCase.category)}</Badge> | **Priority:** <Badge className={PRIORITY_COLORS[selectedCase.priority]}>{capitalize(selectedCase.priority)}</Badge> | **Status:** <Badge className={STATUS_COLORS[selectedCase.status]}>{capitalize(selectedCase.status)}</Badge>
            </p>

            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{selectedCase.description || "No detailed description."}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 border-t pt-4 text-sm">
              <div>
                  <strong className="block text-gray-500">Applicant</strong>
                  {selectedCase.applicant?.fullName || "N/A"}
              </div>
              <div>
                  <strong className="block text-gray-500">Respondent</strong>
                  {selectedCase.respondent?.fullName || "N/A"}
              </div>
              <div>
                  <strong className="block text-gray-500">Assigned To</strong>
                  {selectedCase.assignedTo?.fullName || "N/A"}
              </div>
              <div>
                  <strong className="block text-gray-500">Filing Date</strong>
                  {selectedCase.filingDate ? new Date(selectedCase.filingDate).toLocaleDateString() : "N/A"}
              </div>
              <div>
                  <strong className="block text-gray-500">Location</strong>
                  {selectedCase.country?.countryName || "N/A"} {selectedCase.provinceId && `(Province: ${selectedCase.provinceId})`}
              </div>
            </div>

            {selectedCase.notes?.length > 0 && (
                <div className="border-t pt-4">
                    <h3 className="text-lg font-semibold mb-2">Notes</h3>
                    <ul className="list-disc list-inside text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                        {selectedCase.notes.map((note, index) => (
                        <li key={index}>{note}</li> 
                        ))}
                    </ul>
                </div>
            )}
            
            {selectedCase.hearingDates?.length > 0 && (
                <div className="border-t pt-4">
                    <h3 className="text-lg font-semibold mb-2">Hearing Dates</h3>
                    <div className="flex flex-wrap gap-2">
                        {selectedCase.hearingDates.map((date, index) => (
                            <Badge key={index} className="bg-red-50 text-red-700">
                                {new Date(date).toLocaleDateString()}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><File size={18} /> Attached Documents ({selectedCase.documents?.length || 0})</h3>
              {selectedCase.documents?.length > 0 ? (
                <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                  {selectedCase.documents.map((url, index) => (
                    <li key={index} className="truncate">
                        <a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            {url.split('/').pop()}
                        </a>
                    </li> 
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No documents attached.</p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
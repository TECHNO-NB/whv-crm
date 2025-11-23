// app/tickets/page.tsx
// @ts-nocheck
"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Ticket as TicketIcon,
  Plus,
  X,
  Loader2,
  CheckCircle,
  Users,
  User,
  List,
  Tag,
  Calendar,
  Paperclip,
  Image as ImgIcon,
  Upload,
  AlertCircle,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_BACKEND_URL || "";

/** Utilities */
const nowISO = () => new Date().toISOString();

const uid = (prefix = "") =>
  `${prefix}${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36)}`;

/* --------------------------- Components --------------------------- */

const Badge: React.FC<{ className?: string; children?: React.ReactNode }> = ({ className = "", children }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${className}`}>{children}</span>
);

/* --------------------------- Page --------------------------- */

export default function Page() {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);

  const [showCreate, setShowCreate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filters
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  // Create form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requesterId, setRequesterId] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("open");

  const [attachmentsBeforeUpload, setAttachmentsBeforeUpload] = useState([]);
  const [error, setError] = useState(null);

  /* ------------------ Helpers ------------------ */

  const getUserName = (id?: string | null) =>
    !id ? "Unassigned" : users.find((u) => u.id === id)?.fullName || "Unknown";

  const priorityBadge = (p: any) =>
    p === "high" ? "bg-red-500 text-white" : p === "medium" ? "bg-yellow-400 text-gray-800" : "bg-green-500 text-white";

  const statusStyles = (s: any) =>
    s === "open"
      ? "text-blue-600 bg-blue-50 border-blue-200"
      : s === "in_progress"
      ? "text-purple-600 bg-purple-50 border-purple-200"
      : "text-gray-600 bg-gray-50 border-gray-200";

  /* ------------------ Load Tickets & Users From API ------------------ */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ticketRes, userRes] = await Promise.all([
          axios.get(`${API}/api/v1/tickets`),
          axios.get(`${API}/api/v1/users`),
        ]);

        const ticketData = (ticketRes?.data?.data || []).map((t) => ({
          ...t,
          attachments: Array.isArray(t.attachments) ? t.attachments : [],
        }));

        const userData = (userRes?.data?.data || []).map((u) => u);

        setTickets(ticketData);
        setUsers(userData);
      } catch (err) {
        console.error(err);
        setError("Failed to load data from server.");
      }
    };

    fetchData();
  }, []);

  const filteredTickets = useMemo(() => {
    const base = (tickets || []).filter((t) => (filterStatus === "all" ? true : t.status === filterStatus))
      .filter((t) => (filterPriority === "all" ? true : t.priority === filterPriority));

    return base.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [tickets, filterStatus, filterPriority]);

  /* ------------------ File Handling ------------------ */

  const handleFilesSelected = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    const newItems = arr.map((file) => ({
      id: uid("file-"),
      file,
      previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : "",
      name: file.name,
    }));

    setAttachmentsBeforeUpload((prev) => [...prev, ...newItems]);
  };

  const removePendingAttachment = (id: string) => {
    // Revoke object URL for memory cleanup if present
    const item = attachmentsBeforeUpload.find((p) => p.id === id);
    if (item?.previewUrl) {
      try {
        URL.revokeObjectURL(item.previewUrl);
      } catch (e) {}
    }

    setAttachmentsBeforeUpload((prev) => prev.filter((p) => p.id !== id));
  };

  /* ------------------ Submit Ticket To Backend ------------------ */

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !requesterId) {
      setError("Title and Requester are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("requesterId", requesterId);
      formData.append("assigneeId", assigneeId);
      formData.append("priority", priority);
      formData.append("status", status);

      attachmentsBeforeUpload.forEach((a) => {
        // 'attachments' is the field name expected by backend; adjust if different
        formData.append("attachments", a.file);
      });

      const res = await axios.post(`${API}/api/v1/tickets`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const created = res?.data?.data;
      // Normalize attachments in created ticket
      const normalized = {
        ...created,
        attachments: Array.isArray(created?.attachments) ? created.attachments : [],
      };

      setTickets((prev) => [normalized, ...(prev || [])]);

      // cleanup object urls
      attachmentsBeforeUpload.forEach((a) => {
        if (a.previewUrl) {
          try {
            URL.revokeObjectURL(a.previewUrl);
          } catch (err) {}
        }
      });

      // Reset form
      setTitle("");
      setDescription("");
      setRequesterId("");
      setAssigneeId("");
      setPriority("medium");
      setStatus("open");
      setAttachmentsBeforeUpload([]);
      setShowCreate(false);
    } catch (err) {
      console.error(err);
      setError("Error creating ticket.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ------------------ Remove Attachment From Ticket (UI only) ------------------ */

  const removeAttachmentFromTicket = (ticketId: string, attId: string) => {
    // This updates UI only. If backend supports deletion, add API call here.
    setTickets((prev) =>
      (prev || []).map((t) =>
        t.id === ticketId ? { ...t, attachments: (t.attachments || []).filter((a) => a.id !== attId) } : t
      )
    );
  };

  /* ------------------- UI ------------------- */
  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10 font-sans ml-28">
      <header className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <TicketIcon className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-extrabold text-gray-900">IT Service Desk Tickets</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"
          >
            <Plus className="w-4 h-4" /> New Ticket
          </button>
        </div>
      </header>

      <p className="text-sm text-gray-500 mb-6">Tickets are loaded from the server API.</p>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8 p-4 bg-white rounded-xl shadow-lg border border-gray-100">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Filter Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Filter Priority</label>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className="ml-auto flex items-end">
          <div className="text-sm p-2 rounded-lg bg-blue-100 text-blue-800 font-semibold shadow-inner">
            Total Tickets: {(tickets || []).length} (Showing: {filteredTickets.length})
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Empty / Loading states */}
      {!(tickets || []).length && (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-xl bg-white p-6">
          <List className="w-10 h-10 text-gray-400 mb-3" />
          <p className="text-xl font-semibold text-gray-600">No Tickets Found</p>
          <p className="text-gray-500 mt-1">Click "New Ticket" to create the first one.</p>
        </div>
      )}

      {/* Tickets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTickets.map((ticket) => (
          <div key={ticket.id} className="bg-white p-5 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-mono text-gray-500 mb-1">ID: {ticket.id}</p>
                <h3 className="text-xl font-bold text-gray-800 leading-tight">{ticket.title}</h3>
              </div>
              <div className={`text-xs font-semibold uppercase px-3 py-1 rounded-full border ${statusStyles(ticket.status)} flex-shrink-0`}>
                {(ticket.status || "unknown").replace("_", " ")}
              </div>
            </div>

            <p className="text-sm text-gray-600 line-clamp-3">{ticket.description || "No description provided."}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-3 gap-x-4 border-t pt-3 mt-3">
              <div>
                <div className="font-semibold text-gray-700 flex items-center gap-1">
                  <Tag className="w-4 h-4 text-gray-700" /> Priority
                </div>
                <Badge className={`mt-1 ${priorityBadge(ticket.priority)}`}>{ticket.priority}</Badge>
              </div>

              <div>
                <div className="font-semibold text-gray-700 flex items-center gap-1">
                  <User className="w-4 h-4 text-orange-500" /> Requester
                </div>
                <p className="text-sm text-gray-600 mt-1 truncate">{getUserName(ticket.requesterId)}</p>
              </div>

              <div>
                <div className="font-semibold text-gray-700 flex items-center gap-1">
                  <Users className="w-4 h-4 text-green-500" /> Assignee
                </div>
                <p className="text-sm text-gray-600 mt-1 truncate">{getUserName(ticket.assigneeId)}</p>
              </div>

              <div>
                <div className="font-semibold text-gray-700 flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-blue-500" /> Created
                </div>
                <p className="text-sm text-gray-600 mt-1">{new Date(ticket.createdAt).toLocaleString()}</p>
              </div>

              {/* Attachments */}
              <div className="col-span-2 md:col-span-4">
                <div className="font-semibold text-gray-700 flex items-center gap-1">
                  <Paperclip className="w-4 h-4 text-gray-500" /> Attachments ({(ticket.attachments || []).length})
                </div>
                {(ticket.attachments || []).length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {(ticket.attachments || []).map((att) => (
                      <div key={att.id} className="relative bg-gray-50 border rounded-md p-1 w-32 h-20 flex flex-col items-center justify-center overflow-hidden">
                        {att ? (
                          <img src={att} alt={att} className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex flex-col items-center justify-center p-2 text-xs text-gray-600">
                            <Paperclip className="w-4 h-4 mb-1" />
                            <span className="truncate text-[11px]">{att.name}</span>
                          </div>
                        )}

                        <div className="absolute top-1 right-1 flex gap-1">
                          <button
                            title="Remove"
                            onClick={() => removeAttachmentFromTicket(ticket.id, att.id)}
                            className="bg-white/80 p-1 rounded-full hover:bg-red-100"
                          >
                            <X className="w-3 h-3 text-red-600" />
                          </button>
                          <a href={att.url} target="_blank" rel="noreferrer" className="bg-white/80 p-1 rounded-full hover:bg-gray-100">
                            <ImgIcon className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mt-1">None</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mt-10">
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <TicketIcon className="w-5 h-5 text-blue-600" /> Create New Ticket
              </h3>
              <button className="p-2 rounded-md" onClick={() => setShowCreate(false)}>
                <X />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Title <span className="text-red-500">*</span></label>
                  <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded-md" placeholder="Short summary" />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Requester <span className="text-red-500">*</span></label>
                  <select value={requesterId} onChange={(e) => setRequesterId(e.target.value)} className="w-full p-2 border rounded-md">
                    <option value="">Select requester...</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>{u.fullName}/{u.countryName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full p-2 border rounded-md" placeholder="Detailed description (optional)"></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Assignee (optional)</label>
                  <select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)} className="w-full p-2 border rounded-md">
                    <option value="">Unassigned</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>{u.fullName}/{u.countryName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Priority</label>
                  <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full p-2 border rounded-md">
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full p-2 border rounded-md">
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              {/* Attachments input */}
              <div className="p-4 border border-dashed rounded-md bg-gray-50">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                  <Upload className="w-4 h-4 text-blue-600" /> Attachments (images or files)
                </label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleFilesSelected(e.target.files)}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-2">You can add multiple files. Image previews will be shown. Remove any before submitting if not needed.</p>

                {/* Pending previews */}
                {attachmentsBeforeUpload.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-48 overflow-y-auto">
                    {attachmentsBeforeUpload.map((a) => (
                      <div key={a.id} className="relative bg-white border rounded-md p-1 w-full h-24 flex flex-col items-center justify-center overflow-hidden">
                        {a.previewUrl ? (
                          <img src={a.previewUrl} alt={a.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-xs text-gray-600 p-2">
                            <Paperclip className="w-4 h-4 mb-1" />
                            <span className="truncate w-full text-[12px]">{a.name}</span>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => removePendingAttachment(a.id)}
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

              <div className="flex items-center gap-3 mt-2">
                <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />} Save Ticket
                </button>
                <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-lg border">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

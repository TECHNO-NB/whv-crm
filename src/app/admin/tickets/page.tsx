// app/tickets/page.tsx
// @ts-nocheck
"use client";

import React, { useEffect, useMemo, useState } from "react";
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
import Image from "next/image";

/**
 * Full Ticket Page (single-file)
 *
 * - Demo data for tickets & users
 * - Create ticket modal with multi-file input + previews
 * - Remove files from pending uploads
 * - Simulated upload (adds to local tickets array)
 *
 * Tailwind required.
 */

/* ----------------------------- Types ------------------------------ */
type UserType = { id: string; name: string };
type Priority = "low" | "medium" | "high";
type Status = "open" | "in_progress" | "closed";

type TicketType = {
  id: string;
  title: string;
  description?: string | null;
  requesterId: string;
  assigneeId?: string | null;
  priority: Priority;
  status: Status;
  attachments: { id: string; name: string; url?: string; file?: File }[]; // file present only before "upload"
  createdAt: string; // ISO
  updatedAt: string; // ISO
};

/* --------------------------- Demo / Helpers ------------------------ */

const DUMMY_USERS: UserType[] = [
  { id: "u1", name: "Alice Johnson (Dev)" },
  { id: "u2", name: "Bob Smith (Manager)" },
  { id: "u3", name: "Charlie Brown (QA)" },
];

const nowISO = () => new Date().toISOString();

const uid = (prefix = "") =>
  `${prefix}${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36)}`;

const getUserName = (id?: string | null) =>
  !id ? "Unassigned" : DUMMY_USERS.find((u) => u.id === id)?.name || "Unknown User";

const priorityBadge = (p: Priority) =>
  p === "high" ? "bg-red-500 text-white" : p === "medium" ? "bg-yellow-400 text-gray-800" : "bg-green-500 text-white";

const statusStyles = (s: Status) =>
  s === "open"
    ? "text-blue-600 bg-blue-50 border-blue-200"
    : s === "in_progress"
    ? "text-purple-600 bg-purple-50 border-purple-200"
    : "text-gray-600 bg-gray-50 border-gray-200";

/* ------------------------- Initial Demo Tickets ------------------- */

const DEMO_TICKETS: TicketType[] = [
  {
    id: "t1",
    title: "Email not syncing",
    description: "User reports that emails are not syncing on mobile app.",
    requesterId: "u1",
    assigneeId: "u2",
    priority: "high",
    status: "open",
    attachments: [
      {
        id: uid("att-"),
        name: "screenshot1.png",
        url: "https://i.imgur.com/6rkZ0vZ.png",
      },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: "t2",
    title: "Request: New Laptop",
    description: "Employee needs a new laptop for development work.",
    requesterId: "u3",
    assigneeId: null,
    priority: "medium",
    status: "in_progress",
    attachments: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: "t3",
    title: "VPN connectivity issue",
    description: "Intermittent VPN drops for remote users.",
    requesterId: "u2",
    assigneeId: "u1",
    priority: "low",
    status: "closed",
    attachments: [
      {
        id: uid("att-"),
        name: "vpn_log.txt",
        url: "https://example.com/vpn_log.txt",
      },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
  },
];

/* --------------------------- Components --------------------------- */

const Badge: React.FC<{ className?: string; children?: React.ReactNode }> = ({ className = "", children }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${className}`}>{children}</span>
);

/* --------------------------- Main Page ---------------------------- */

export default function Page() {
  const [tickets, setTickets] = useState<TicketType[]>(DEMO_TICKETS);
  const [showCreate, setShowCreate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filters
  const [filterStatus, setFilterStatus] = useState<Status | "all">("all");
  const [filterPriority, setFilterPriority] = useState<Priority | "all">("all");

  /* ---------- Create form state ---------- */
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requesterId, setRequesterId] = useState<string>("");
  const [assigneeId, setAssigneeId] = useState<string>("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [status, setStatus] = useState<Status>("open");

  // attachmentsBeforeUpload: stores File objects the user picked (with preview urls)
  const [attachmentsBeforeUpload, setAttachmentsBeforeUpload] = useState<
    { id: string; file: File; previewUrl: string; name: string }[]
  >([]);

  const [error, setError] = useState<string | null>(null);

  /* ------------- Derived filtered tickets -------------- */
  const filteredTickets = useMemo(() => {
    return tickets
      .filter((t) => (filterStatus === "all" ? true : t.status === filterStatus))
      .filter((t) => (filterPriority === "all" ? true : t.priority === filterPriority))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [tickets, filterStatus, filterPriority]);

  /* ------------------ File input handling ------------------ */

  const handleFilesSelected = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    const newItems = arr.map((file) => ({
      id: uid("file-"),
      file,
      previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : "",
      name: file.name,
    }));
    // Append, avoid duplicates by name+size heuristic
    setAttachmentsBeforeUpload((prev) => {
      const combined = [...prev];
      newItems.forEach((ni) => {
        const exists = combined.some((c) => c.file.name === ni.file.name && c.file.size === ni.file.size);
        if (!exists) combined.push(ni);
      });
      return combined;
    });
  };

  const removePendingAttachment = (id: string) => {
    setAttachmentsBeforeUpload((prev) => {
      const toRevoke = prev.find((p) => p.id === id);
      if (toRevoke?.previewUrl) URL.revokeObjectURL(toRevoke.previewUrl);
      return prev.filter((p) => p.id !== id);
    });
  };

  useEffect(() => {
    // cleanup previews on unmount
    return () => {
      attachmentsBeforeUpload.forEach((p) => {
        if (p.previewUrl) URL.revokeObjectURL(p.previewUrl);
      });
    };
  }, []); // run once

  /* ------------------- Submit (simulate upload) ------------------- */

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);

    if (!title.trim() || !requesterId) {
      setError("Title and Requester are required.");
      return;
    }

    setIsSubmitting(true);

    // Simulate upload delay for files and create URL references.
    // In real app: upload attachments to storage and get URLs.
    const simulateUpload = (item: { file: File; id: string; name: string }) =>
      new Promise<{ id: string; name: string; url?: string }>((resolve) => {
        setTimeout(() => {
          // we will just use object URL as "uploaded" url for image types, and fake URL for others
          const url = item.file.type.startsWith("image/") ? URL.createObjectURL(item.file) : `https://example.com/files/${encodeURIComponent(item.name)}`;
          resolve({ id: uid("att-"), name: item.name, url });
        }, 500 + Math.random() * 800);
      });

    try {
      const uploaded = await Promise.all(
        attachmentsBeforeUpload.map((a) => simulateUpload({ file: a.file, id: a.id, name: a.name }))
      );

      const newTicket: TicketType = {
        id: uid("t-"),
        title: title.trim(),
        description: description.trim() || null,
        requesterId,
        assigneeId: assigneeId || null,
        priority,
        status,
        attachments: uploaded.map((u) => ({ id: u.id, name: u.name, url: u.url })),
        createdAt: nowISO(),
        updatedAt: nowISO(),
      };

      setTickets((prev) => [newTicket, ...prev]);
      // clear form
      setTitle("");
      setDescription("");
      setRequesterId("");
      setAssigneeId("");
      setPriority("medium");
      setStatus("open");
      // revoke previews and clear
      attachmentsBeforeUpload.forEach((p) => p.previewUrl && URL.revokeObjectURL(p.previewUrl));
      setAttachmentsBeforeUpload([]);
      setShowCreate(false);
    } catch (err) {
      console.error(err);
      setError("Failed to create ticket (simulated).");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ------------------- Remove attachment from existing ticket ------------------- */
  const removeAttachmentFromTicket = (ticketId: string, attId: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, attachments: t.attachments.filter((a) => a.id !== attId) } : t))
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

      {/* Info */}
      <p className="text-sm text-gray-500 mb-6">This demo stores data locally (no server). Attachments are simulated as uploaded by using object URLs for preview.</p>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8 p-4 bg-white rounded-xl shadow-lg border border-gray-100">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Filter Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
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
            onChange={(e) => setFilterPriority(e.target.value as any)}
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
            Total Tickets: {tickets.length} (Showing: {filteredTickets.length})
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
      {!tickets.length && (
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
                {ticket.status.replace("_", " ")}
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
                <p className="text-sm text-gray-600 mt-1 truncate">{getUserName(ticket.assigneeId || undefined)}</p>
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
                  <Paperclip className="w-4 h-4 text-gray-500" /> Attachments ({ticket.attachments.length})
                </div>
                {ticket.attachments.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {ticket.attachments.map((att) => (
                      <div key={att.id} className="relative bg-gray-50 border rounded-md p-1 w-32 h-20 flex flex-col items-center justify-center overflow-hidden">
                        {att.url && att.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                          // Use next/image for external images might require next.config images.domains; fallback to img tag
                          <img src={att.url} alt={att.name} className="w-full h-full object-cover" />
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
                    {DUMMY_USERS.map((u) => (
                      <option key={u.id} value={u.id}>{u.name}</option>
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
                    {DUMMY_USERS.map((u) => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Priority</label>
                  <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className="w-full p-2 border rounded-md">
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value as Status)} className="w-full p-2 border rounded-md">
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

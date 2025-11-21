// app/legal-cases/page.tsx
"use client";

import React, { useMemo, useState } from "react";
import { Plus, Search, Calendar, FileText, User, Tag, X } from "lucide-react";

/**
 * Legal Cases Page (Next.js + TypeScript + Tailwind)
 * - Single-file demo page for your LegalCase schema
 * - Includes: cards list, filters, search, create modal, demo data
 * - Drop into `app/legal-cases/page.tsx` in a Next 13 app (client component)
 * - Styling uses Tailwind utility classes (v3+)
 * - shadcn-like UI patterns (Dialog / Button) implemented locally so it runs
 */

type CaseStatus = "open" | "in_progress" | "on_hold" | "escalated" | "won" | "lost" | "settled" | "closed";
type CaseCategory =
  | "land"
  | "financial"
  | "employment"
  | "fraud"
  | "harassment"
  | "property"
  | "organizational"
  | "dispute"
  | "compliance"
  | "other";

type LegalCase = {
  id: string;
  caseNumber?: string;
  title: string;
  description?: string;
  category: CaseCategory;
  priority: "low" | "medium" | "high" | "urgent";
  status: CaseStatus;
  applicantId?: string;
  respondentId?: string;
  assignedToId?: string;
  countryId: string;
  provinceId?: string;
  filingDate?: string | null;
  hearingDates: string[];
  closedDate?: string | null;
  documents: string[];
  notes: string[];
  logs?: any;
  createdAt: string;
  updatedAt: string;
};

// Demo users (simple)
const DEMO_USERS = [
  { id: "u1", name: "Sita Shrestha" },
  { id: "u2", name: "Ramesh Khatri" },
  { id: "u3", name: "Anita Sharma" },
];

const nowISO = () => new Date().toISOString();

const DEMO_CASES: LegalCase[] = [
  {
    id: "c1",
    caseNumber: "WVN/2025/0001",
    title: "Temple Land Dispute — Bhaktapur",
    description: "Dispute over boundary and access to temple-owned land in Bhaktapur district.",
    category: "land",
    priority: "high",
    status: "in_progress",
    applicantId: "u1",
    respondentId: "u2",
    assignedToId: "u3",
    countryId: "NP",
    provinceId: "3",
    filingDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 40).toISOString(),
    hearingDates: [new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString()],
    closedDate: null,
    documents: ["https://example.com/documents/title-deed.pdf"],
    notes: ["Initial filing completed.", "Met with local council on 2025-10-01"],
    logs: null,
    createdAt: nowISO(),
    updatedAt: nowISO(),
  },
  {
    id: "c2",
    caseNumber: "WVN/2025/0002",
    title: "Staff Contract Dispute — Education Program",
    description: "Alleged wrongful termination of teacher under project X.",
    category: "employment",
    priority: "medium",
    status: "open",
    applicantId: "u3",
    respondentId: "u2",
    assignedToId: "u1",
    countryId: "NP",
    provinceId: "4",
    filingDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    hearingDates: [],
    closedDate: null,
    documents: [],
    notes: ["HR review ongoing"],
    logs: null,
    createdAt: nowISO(),
    updatedAt: nowISO(),
  },
];

/* -------------------- Small UI primitives (local shadcn-like) -------------------- */
const Badge: React.FC<{ children?: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${className}`}>{children}</span>
);

const Modal: React.FC<{ open: boolean; onClose: () => void; title?: React.ReactNode }> = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-6 bg-black/40 ">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl overflow-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-100">
            <X />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

/* -------------------- Page Component -------------------- */
export default function LegalCasesPage() {
  const [cases, setCases] = useState<LegalCase[]>(DEMO_CASES);
  const [query, setQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  // Modal state
  const [openCreate, setOpenCreate] = useState(false);

  // Form state for create
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState<CaseCategory>("other");
  const [formPriority, setFormPriority] = useState("medium");
  const [formAssignedTo, setFormAssignedTo] = useState<string | undefined>(undefined);
  const [formApplicant, setFormApplicant] = useState<string | undefined>(undefined);
  const [formRespondent, setFormRespondent] = useState<string | undefined>(undefined);
  const [formFilingDate, setFormFilingDate] = useState<string | undefined>(undefined);
  const [formNotes, setFormNotes] = useState<string>("");

  const filtered = useMemo(() => {
    return cases.filter((c) => {
      if (filterStatus !== "all" && c.status !== filterStatus) return false;
      if (filterCategory !== "all" && c.category !== filterCategory) return false;
      if (query && !(`${c.title} ${c.description} ${c.caseNumber}`.toLowerCase().includes(query.toLowerCase()))) return false;
      return true;
    });
  }, [cases, query, filterStatus, filterCategory]);

  const addCase = () => {
    const newCase: LegalCase = {
      id: Math.random().toString(36).slice(2, 9),
      caseNumber: `WVN/${new Date().getFullYear()}/${Math.floor(Math.random() * 9000 + 1000)}`,
      title: formTitle || "Untitled Case",
      description: undefined,
      category: formCategory,
      priority: formPriority as any,
      status: "open",
      applicantId: formApplicant,
      respondentId: formRespondent,
      assignedToId: formAssignedTo,
      countryId: "NP",
      provinceId: undefined,
      filingDate: formFilingDate || null,
      hearingDates: [],
      closedDate: null,
      documents: [],
      notes: formNotes ? [formNotes] : [],
      logs: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCases((s) => [newCase, ...s]);
    // reset and close
    setFormTitle("");
    setFormNotes("");
    setOpenCreate(false);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50 ml-28">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Legal Cases</h1>
            <p className="text-sm text-gray-600 mt-1">Manage legal cases, hearings, documents and assignment for World Hindu Vision.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                className="pl-10 pr-3 py-2 rounded-lg border w-64 bg-white"
                placeholder="Search by title, case number"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <Search size={16} />
              </div>
            </div>

            <button onClick={() => setOpenCreate(true)} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
              <Plus /> New Case
            </button>
          </div>
        </div>

        {/* Filters row */}
        <div className="flex flex-wrap gap-3 items-center mb-6">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700">Status</label>
            <select className="p-2 border rounded-md" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="on_hold">On Hold</option>
              <option value="escalated">Escalated</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
              <option value="settled">Settled</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700">Category</label>
            <select className="p-2 border rounded-md" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="all">All</option>
              <option value="land">Land</option>
              <option value="financial">Financial</option>
              <option value="employment">Employment</option>
              <option value="fraud">Fraud</option>
              <option value="harassment">Harassment</option>
              <option value="property">Property</option>
              <option value="organizational">Organizational</option>
              <option value="dispute">Dispute</option>
              <option value="compliance">Compliance</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="ml-auto text-sm text-gray-700">Showing {filtered.length} of {cases.length} cases</div>
        </div>

        {/* Cases grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((c) => (
            <article key={c.id} className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition">
              <header className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs text-gray-500">{c.caseNumber}</p>
                  <h3 className="text-lg font-semibold mt-1">{c.title}</h3>
                </div>
                <div className="text-right">
                  <Badge className={`mt-1 ${c.priority === 'high' ? 'bg-red-500 text-white' : c.priority === 'urgent' ? 'bg-red-700 text-white' : c.priority === 'medium' ? 'bg-yellow-400 text-black' : 'bg-green-500 text-white'}`}>{c.priority}</Badge>
                  <div className="mt-2 text-xs text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</div>
                </div>
              </header>

              <p className="text-sm text-gray-600 mt-3 line-clamp-3">{c.description ?? '—'}</p>

              <div className="mt-4 border-t pt-3 flex items-center justify-between gap-2 text-sm text-gray-600">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1"><User className="w-4 h-4"/> {DEMO_USERS.find(u => u.id === c.applicantId)?.name ?? 'Applicant'}</div>
                  <div className="flex items-center gap-1"><User className="w-4 h-4"/> {DEMO_USERS.find(u => u.id === c.respondentId)?.name ?? 'Respondent'}</div>
                </div>

                <div className="flex items-center gap-2">
                  <a className="inline-flex items-center gap-2 px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs" href="#">
                    <Calendar className="w-4 h-4"/> {c.hearingDates.length ? new Date(c.hearingDates[0]).toLocaleDateString() : 'No hearing'}
                  </a>
                  <a className="inline-flex items-center gap-2 px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs" href="#">
                    <FileText className="w-4 h-4"/> {c.documents.length}
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="mt-8 bg-white rounded-xl p-8 text-center border border-dashed text-gray-500">No cases match your filters.</div>
        )}
      </div>

      {/* Create Modal */}
      <Modal open={openCreate} onClose={() => setOpenCreate(false)} title={<><Tag className="w-4 h-4"/> Create New Case</>}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} className="mt-1 block w-full rounded-md border p-2" placeholder="Case title" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select value={formCategory} onChange={(e) => setFormCategory(e.target.value as CaseCategory)} className="mt-1 block w-full rounded-md border p-2">
                <option value="land">Land</option>
                <option value="financial">Financial</option>
                <option value="employment">Employment</option>
                <option value="fraud">Fraud</option>
                <option value="harassment">Harassment</option>
                <option value="property">Property</option>
                <option value="organizational">Organizational</option>
                <option value="dispute">Dispute</option>
                <option value="compliance">Compliance</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Priority</label>
              <select value={formPriority} onChange={(e) => setFormPriority(e.target.value)} className="mt-1 block w-full rounded-md border p-2">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Applicant</label>
              <select value={formApplicant} onChange={(e) => setFormApplicant(e.target.value)} className="mt-1 block w-full rounded-md border p-2">
                <option value={""}>Select applicant</option>
                {DEMO_USERS.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Respondent</label>
              <select value={formRespondent} onChange={(e) => setFormRespondent(e.target.value)} className="mt-1 block w-full rounded-md border p-2">
                <option value={""}>Select respondent</option>
                {DEMO_USERS.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Assign To (Lawyer)</label>
              <select value={formAssignedTo} onChange={(e) => setFormAssignedTo(e.target.value)} className="mt-1 block w-full rounded-md border p-2">
                <option value={""}>Unassigned</option>
                {DEMO_USERS.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Filing Date</label>
            <input type="date" value={formFilingDate ?? ""} onChange={(e) => setFormFilingDate(e.target.value)} className="mt-1 block w-full rounded-md border p-2" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea value={formNotes} onChange={(e) => setFormNotes(e.target.value)} className="mt-1 block w-full rounded-md border p-2" rows={3} />
          </div>

          <div className="flex items-center justify-end gap-3">
            <button onClick={() => setOpenCreate(false)} className="px-4 py-2 rounded-md border">Cancel</button>
            <button onClick={addCase} className="px-4 py-2 rounded-md bg-blue-600 text-white">Create Case</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

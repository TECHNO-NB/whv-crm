// @ts-nocheck
"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Calendar,
  Eye,
  List,
  Pencil,
  FileText,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    status: string; // Existing project status
    approved: "pending" | "approved" | "rejected"; // Approval status
    budget?: number;
    progress?: number;
    workers?: { name: string }[];
    country?: { countryName: string };
    startDate?: string;
    endDate?: string;
    documents?: { name: string; url: string }[]; // Added documents array
  };
}

export default function ProjectReviewCard({ project }: ProjectCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [documentsOpen, setDocumentsOpen] = useState(false);
  const [formData, setFormData] = useState({
    // 🐛 FIX 1: Initialize form data with required fields from project
    approved: project.approved,
    // Note: title, budget, etc. are not editable in this review modal,
    // so we only need 'approved' for state management/PUT request.
  });

  // 🐛 FIX 2: Removed unused handleChange since only the Select field is mutable

  const handleApprovedChange = (value: string) => {
    setFormData({ ...formData, approved: value });
  };

  const handleSave = async () => {
    try {
      // Basic validation to prevent saving the same status
      if (formData.approved === project.approved) {
        setEditOpen(false);
        return;
      }

      const res = await fetch(`/api/v1/projects/${project.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved: formData.approved }), // Only send the updated field
      });

      if (!res.ok) throw new Error("Failed to update project approval status");

      toast.success("Project approval status updated successfully!");
      setEditOpen(false);
      // OPTIONAL: A full page reload or prop update is needed here
      // to reflect the change in the main view.
    } catch (err) {
      console.error(err);
      toast.error("Error updating project approval status");
    }
  };

  const getBadgeClass = (approvedStatus: string) => {
    switch (approvedStatus) {
      case "rejected":
        return "bg-red-600 text-white";
      case "approved":
        return "bg-green-600 text-white";
      case "pending":
      default:
        return "bg-yellow-500 text-gray-800"; // Changed to yellow for pending
    }
  };

  // Helper for budget display
  const displayBudget = project.budget ? `$${project.budget.toLocaleString()}` : "N/A";

  return (
    <Card className="w-full mt-6 max-w-sm rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex justify-between items-start">
          <h2 className="text-lg font-semibold text-gray-800">
            {project.title}
          </h2>
          <div className="flex items-center gap-2">
            {/* Approval Badge */}
            <Badge
              variant="secondary"
              className={`${getBadgeClass(
                project.approved
              )} text-xs font-medium uppercase`}
            >
              {project.approved}
            </Badge>

            {/* ✏️ Edit Approval Status Modal Trigger */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="p-1 hover:text-orange-500 text-gray-600"
                >
                  <Pencil size={16} />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                  <DialogTitle>Review Project Approval</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  {/* Title - Disabled and pre-filled */}
                  <div>
                    <Label htmlFor="title">Project Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={project.title}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>

                  {/* Status Select */}
                  <div>
                    <Label>Approval Status</Label>
                    <Select
                      onValueChange={handleApprovedChange}
                      value={formData.approved}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Approval Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* 🐛 FIX 3: Updated SelectItem values/labels to match 'approved' enum */}
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="secondary" onClick={() => setEditOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="bg-orange-500 text-white hover:bg-orange-600"
                  >
                    Save Changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Location and Dates */}
        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
          {project.country?.countryName && (
            <div className="flex items-center gap-1">
              <MapPin size={14} />
              <span>{project.country.countryName}</span>
            </div>
          )}
          {project.startDate && project.endDate && (
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>
                {new Date(project.startDate).toLocaleDateString()} –{" "}
                {new Date(project.endDate).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {/* Budget & Team */}
        <div className="grid grid-cols-2 gap-2 mt-4 text-sm text-gray-700 border-b pb-3">
          <div>
            <p className="font-medium">Budget</p>
            {/* 🐛 FIX 4: Use project.budget directly, or the display helper */}
            <p className="text-gray-900 font-semibold">
              {displayBudget}
            </p>
          </div>
          <div>
            <p className="font-medium">Team Size</p>
            <p className="text-gray-900 font-semibold">
              {project.workers?.length || 0} members
            </p>
          </div>
        </div>

        {/* Team & Actions */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex -space-x-2">
            {/* Worker Avatars */}
            {project.workers?.slice(0, 3).map((w, i) => (
              <div
                key={i}
                className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-semibold border-2 border-white"
              >
                {w?.name?.trim()?.charAt(0)?.toUpperCase() ?? "?"}
              </div>
            ))}

            {/* Overflow Count */}
            {project.workers && project.workers.length > 3 && (
              <div className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-xs font-semibold border-2 border-white">
                +{project.workers.length - 3}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-orange-500 hover:bg-orange-50"
            >
              <Eye size={16} className="mr-1" /> View
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-orange-500 hover:bg-orange-50"
            >
              <List size={16} className="mr-1" /> Activities
            </Button>
          </div>
        </div>

        {/* 📄 View Documents Modal Trigger */}
        <Dialog open={documentsOpen} onOpenChange={setDocumentsOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4 w-full bg-blue-600 hover:bg-blue-700">
              <FileText size={18} className="mr-2" /> View Documents
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>Project Documents</DialogTitle>
            </DialogHeader>
            <div className="py-4 max-h-[40vh] overflow-y-auto">
              {project.documents && project.documents.length > 0 ? (
                <ul className="space-y-3">
                  {project.documents.map((doc, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-sm font-medium truncate">
                        {doc.name}
                      </span>
                      <a href={doc.url} target="_blank" rel="noopener noreferrer">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-500 hover:text-green-600"
                          aria-label={`Download ${doc.name}`}
                        >
                          <Download size={18} />
                        </Button>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-500 py-4">
                  No supporting documents available.
                </p>
              )}
            </div>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setDocumentsOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
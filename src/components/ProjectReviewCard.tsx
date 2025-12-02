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
import axios from "axios";

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    status: string;
    approved: "pending" | "approved" | "rejected";
    budget?: number;
    progress?: number;
    workers?: { name: string }[];
    country?: { countryName: string };
    startDate?: string;
    endDate?: string;
    documents?: { name: string; url: string }[];
  };
}

export default function ProjectReviewCard({ project }: ProjectCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [documentsOpen, setDocumentsOpen] = useState(false);

  const [formData, setFormData] = useState({
    approved: project.approved,
  });

  const handleApprovedChange = (value: string) => {
    setFormData({ ...formData, approved: value });
  };

  const handleSave = async () => {
    try {
      if (formData.approved === project.approved) {
        setEditOpen(false);
        return;
      }
      axios.defaults.withCredentials = true;
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/projects/update/${project.id}`,
        { approved: formData.approved }
      );

      if (!res.status)
        throw new Error("Failed to update project approval status");

      toast.success("Project approval status updated successfully!");
      setEditOpen(false);
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast.error("Error updating project approval status");
    }
  };

  // ⭐ NEW: DELETE PROJECT
  const handleDelete = async () => {
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/projects/${project.id}`
      );

      if (!res.status) throw new Error("Failed to delete");

      toast.success("Project deleted successfully!");
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast.error("Error deleting project");
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
        return "bg-yellow-500 text-gray-800";
    }
  };

  const displayBudget = project.budget
    ? `$${project.budget.toLocaleString()}`
    : "N/A";

  return (
    <Card className="w-full mt-6 max-w-sm rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex justify-between items-start">
          <h2 className="text-lg font-semibold text-gray-800">
            {project.title}
          </h2>
          <div className="flex items-center gap-2">
            {/* Badge */}
            <Badge
              variant="secondary"
              className={`${getBadgeClass(
                project.approved
              )} text-xs font-medium uppercase`}
            >
              {project.approved}
            </Badge>

            {/* Edit Status */}
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
                  <div>
                    <Label htmlFor="title">Project Title</Label>
                    <Input
                      id="title"
                      value={project.title}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>

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

            {/* ⭐ DELETE PROJECT BUTTON */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="p-1 hover:text-red-600 text-gray-600"
                >
                  {/* Trash Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0H7m5-3v3"
                    />
                  </svg>
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[350px]">
                <DialogHeader>
                  <DialogTitle>Delete Project</DialogTitle>
                </DialogHeader>

                <p className="text-sm text-gray-600">
                  Are you sure you want to delete{" "}
                  <b>{project.title}</b>? This action cannot be undone.
                </p>

                <DialogFooter className="mt-4">
                  <Button variant="secondary">Cancel</Button>
                  <Button
                    onClick={handleDelete}
                    className="bg-red-600 text-white hover:bg-red-700"
                  >
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Location & Dates */}
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
            <p className="text-gray-900 font-semibold">{displayBudget}</p>
          </div>
          <div>
            <p className="font-medium">Team Size</p>
            <p className="text-gray-900 font-semibold">
              {project.workers?.length || 0} members
            </p>
          </div>
        </div>

        {/* Team & Buttons */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex -space-x-2">
            {project.workers?.slice(0, 3).map((w, i) => (
              <div
                key={i}
                className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-semibold border-2 border-white"
              >
                {w?.name?.trim()?.charAt(0)?.toUpperCase() ?? "?"}
              </div>
            ))}

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

        {/* Documents Modal */}
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
                        {doc}
                      </span>
                      <a
                        href={doc}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-500 hover:text-green-600"
                          aria-label={`Download ${doc}`}
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

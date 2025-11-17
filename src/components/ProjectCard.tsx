
// @ts-nocheck
"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MapPin, Calendar, Eye, List, Pencil, Plus } from "lucide-react";
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
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import toast from "react-hot-toast";


interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    status: string;
    budget?: number;
    progress?: number;
    workers?: { name: string }[];
    country?: { countryName: string };
    startDate?: string;
    endDate?: string;
  };
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: project.title,
    status: project.status,
    budget: project.budget || 0,
    progress: project.progress || 0,
    newWorker: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStatusChange = (value: string) => {
    setFormData({ ...formData, status: value });
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/v1/projects/${project.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to update project");

      toast.success("Project updated successfully!");
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Error updating project");
    }
  };

  return (
    <Card className="w-full mt-6 max-w-sm rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex justify-between items-start">
          <h2 className="text-lg font-semibold text-gray-800">{project.title}</h2>
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className={`${
                project.status === "active"
                  ? "bg-green-100 text-green-700"
                  : project.status === "completed"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-600"
              } text-xs font-medium`}
            >
              {project.status}
            </Badge>

            {/* ✏️ Edit Modal Trigger */}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="p-1 hover:text-orange-500 text-gray-600"
                >
                  <Pencil size={16} />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Edit Project</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  {/* Title */}
                  <div>
                    <Label htmlFor="title">Project Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Budget */}
                  <div>
                    <Label htmlFor="budget">Budget ($)</Label>
                    <Input
                      id="budget"
                      name="budget"
                      type="number"
                      value={formData.budget}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Progress */}
                  <div>
                    <Label htmlFor="progress">Progress (%)</Label>
                    <Input
                      id="progress"
                      name="progress"
                      type="number"
                      min={0}
                      max={100}
                      value={formData.progress}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <Label>Status</Label>
                    <Select
                      onValueChange={handleStatusChange}
                      value={formData.status}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planned">Planned</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="on_hold">On Hold</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Add New Worker */}
                  <div>
                    <Label htmlFor="newWorker">Add Worker</Label>
                    <div className="flex gap-2">
                      <Input
                        id="newWorker"
                        name="newWorker"
                        placeholder="Enter worker name or ID"
                        value={formData.newWorker}
                        onChange={handleChange}
                      />
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (!formData.newWorker.trim()) return;
                          toast.success(`${formData.newWorker} added to project`);
                          setFormData({ ...formData, newWorker: "" });
                        }}
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="secondary" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} className="bg-orange-500 text-white">
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

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-700">
            <span>Progress</span>
            <span>{formData.progress}%</span>
          </div>
          <Progress value={formData.progress} className="mt-1 h-2 bg-gray-200" />
        </div>

        {/* Budget & Team */}
        <div className="grid grid-cols-2 gap-2 mt-4 text-sm text-gray-700 border-b pb-3">
          <div>
            <p className="font-medium">Budget</p>
            <p className="text-gray-900 font-semibold">
              ${formData.budget.toLocaleString()}
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
            {project.workers?.slice(0, 3).map((w, i) => (
              <div
                key={i}
                className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-semibold border-2 border-white"
              >
                {w.name.charAt(0).toUpperCase()}
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
      </CardContent>
    </Card>
  );
}

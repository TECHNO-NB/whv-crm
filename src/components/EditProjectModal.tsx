// @ts-nocheck
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, FileIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface EditProjectModalProps {
  open: boolean;
  onClose: () => void;
  project: any;
  refresh?: () => void;
}

export default function EditProjectModal({
  open,
  onClose,
  project,
  refresh,
}: EditProjectModalProps) {
  const [title, setTitle] = useState(project.title);
  const [status, setStatus] = useState(project.status);
  const [countryId, setCountryId] = useState(project.countryId);
  const [managerId, setManagerId] = useState(project.managerId);
  const [workers, setWorkers] = useState(
    project.workers?.map((w) => w.id) || []
  );

  const [budget, setBudget] = useState(project.budget);
  const [spent, setSpent] = useState(project.spent || 0);
  const [description, setDescription] = useState(project.description);
  const [startDate, setStartDate] = useState(project.startDate?.slice(0, 10));
  const [endDate, setEndDate] = useState(project.endDate?.slice(0, 10));

  const [users, setUsers] = useState([]);
  const [countries, setCountries] = useState([]);

  const [documents, setDocuments] = useState<File[]>([]);
  const [previews, setPreviews] = useState([]);

  const [existingDocs, setExistingDocs] = useState(
    (project.documents || []).map((url, index) => ({
      id: index,
      url,
      type: url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? "image" : "file",
      name: url.split("/").pop(),
    }))
  );

  useEffect(() => {
    fetchUsers();
    fetchCountries();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users`,
        { withCredentials: true }
      );
      setUsers(res.data.data);
    } catch {
      toast.error("Failed to fetch users");
    }
  };

  const fetchCountries = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/country`
      );
      if (res.data.success) setCountries(res.data.data);
    } catch {
      toast.error("Failed to fetch countries");
    }
  };

  const handleDocuments = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setDocuments((prev) => [...prev, ...selectedFiles]);

    const previewsGenerated = selectedFiles.map((file) =>
      file.type.startsWith("image/")
        ? { type: "image", url: URL.createObjectURL(file) }
        : { type: "file", name: file.name }
    );

    setPreviews((prev) => [...prev, ...previewsGenerated]);
  };

  const removeNewDoc = (index) => {
    const updatedDocs = [...documents];
    updatedDocs.splice(index, 1);
    setDocuments(updatedDocs);

    const prev = [...previews];
    prev.splice(index, 1);
    setPreviews(prev);
  };

  const removeExistingDoc = (docId) => {
    setExistingDocs(existingDocs.filter((d) => d.id !== docId));
  };

  const saveChanges = async () => {
    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("status", status);
      formData.append("countryId", countryId);
      formData.append("managerId", managerId);

      formData.append("budget", budget);
      formData.append("spent", spent);
      formData.append("description", description);
      formData.append("startDate", startDate);
      formData.append("endDate", endDate);
      formData.append("workers", JSON.stringify(workers));

      formData.append(
        "documents",
        JSON.stringify(existingDocs.map((d) => d.url))
      );

      documents.forEach((file) => formData.append("documents", file));

      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/projects/${project.id}`,
        formData,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Project updated!");
        onClose(); // use onClose
        refresh && refresh();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update project");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Title + Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Project Title</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div>
              <label className="text-sm font-medium">Status</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
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
          </div>

          {/* Country + Manager */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Country</label>
              <Select value={countryId} onValueChange={setCountryId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.countryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Team Lead</label>
              <Select value={managerId} onValueChange={setManagerId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Workers */}
          <div>
            <label className="text-sm font-medium">Workers</label>
            <Select
              onValueChange={(value) => {
                if (!workers.includes(value)) setWorkers([...workers, value]);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select workers" />
              </SelectTrigger>
              <SelectContent>
                {users.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex flex-wrap gap-2 mt-3">
              {workers.map((id) => {
                const user = users.find((u) => u.id === id);
                return (
                  <div
                    key={id}
                    className="px-3 py-1 bg-gray-200 rounded-full flex items-center gap-2"
                  >
                    {user?.fullName}
                    <X
                      className="w-4 h-4 cursor-pointer"
                      onClick={() =>
                        setWorkers(workers.filter((w) => w !== id))
                      }
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Start Date</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">End Date</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* Budget + Spent */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Budget</label>
              <Input
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Spent</label>
              <Input
                value={spent}
                onChange={(e) => setSpent(e.target.value)}
                placeholder="Spent amount"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Existing Docs */}
          <div>
            <label className="text-sm font-medium">Existing Documents</label>
            <div className="flex flex-wrap gap-4 mt-3">
              {existingDocs.map((doc) => (
                <div key={doc.id} className="relative">
                  {doc.type === "image" ? (
                    <Image
                      src={doc.url}
                      width={90}
                      height={90}
                      className="rounded-md object-cover border"
                      alt="preview"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-100 border rounded-md flex flex-col items-center justify-center text-xs p-2">
                      <FileIcon className="w-6 h-6 mb-1" />
                      <span>{doc.name}</span>
                    </div>
                  )}
                  <button
                    className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full"
                    onClick={() => removeExistingDoc(doc.id)}
                    type="button"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Upload New Docs */}
          <div>
            <label className="text-sm font-medium">Upload New Documents</label>
            <Input type="file" multiple onChange={handleDocuments} />
            <div className="flex flex-wrap gap-4 mt-3">
              {previews.map((item, i) => (
                <div key={i} className="relative">
                  {item.type === "image" ? (
                    <Image
                      src={item.url}
                      width={90}
                      height={90}
                      className="rounded-md object-cover border"
                      alt="preview"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-100 border rounded-md flex flex-col items-center justify-center text-xs p-2">
                      <FileIcon className="w-6 h-6 mb-1" />
                      <span>{item.name}</span>
                    </div>
                  )}
                  <button
                    className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full"
                    type="button"
                    onClick={() => removeNewDoc(i)}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button className="bg-orange-500 text-white" onClick={saveChanges}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

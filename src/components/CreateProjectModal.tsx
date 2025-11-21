// @ts-nocheck

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X, FileIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

export default function CreateProjectModal() {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("");
  const [countryId, setCountryId] = useState("");
  const [managerId, setManagerId] = useState("");
  const [workers, setWorkers] = useState([]);

  const [budget, setBudget] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Fetch
  const [users, setUsers] = useState([]);
  const [countries, setCountries] = useState([]);

  // Documents
  const [documents, setDocuments] = useState<File[]>([]);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchCountries();
  }, []);

  const fetchUsers = async () => {
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users`
      );
      setUsers(res.data.data);
    } catch {
      toast.error("Failed to fetch users");
    }
  };

  const fetchCountries = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/country`
      );
      const data = await res.json();
      if (data.success) setCountries(data.data);
    } catch {
      toast.error("Failed to fetch countries");
    }
  };

  // =============================
  // Document Upload + Preview FIXED
  // =============================
  const handleDocuments = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setDocuments((prev) => [...prev, ...selectedFiles]);

    // Generate previews for each file
    const newPreviews = selectedFiles.map((file) => {
      if (file.type.startsWith("image/")) {
        return { type: "image", url: URL.createObjectURL(file) };
      } else {
        return { type: "file", name: file.name };
      }
    });

    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeDocument = (index) => {
    const updatedFiles = [...documents];
    updatedFiles.splice(index, 1);
    setDocuments(updatedFiles);

    const updatedPreview = [...previews];
    updatedPreview.splice(index, 1);
    setPreviews(updatedPreview);
  };

  // =============================
  // Create Project
  // =============================
  const handleCreateProject = async (e) => {
    e.preventDefault();

    if (!title || !priority || !countryId || !managerId) {
      toast.error("Please fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("status", priority);
    formData.append("countryId", countryId);
    formData.append("managerId", managerId);

    if (description) formData.append("description", description);
    if (budget) formData.append("budget", budget);
    if (startDate) formData.append("startDate", startDate);
    if (endDate) formData.append("endDate", endDate);

    formData.append("workers", JSON.stringify(workers));

    documents.forEach((file) => {
      formData.append("documents", file);
    });

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/project`,
        formData,
        { withCredentials: true }
      );

      if (res.data.success) toast.success("Project created successfully");
      else toast.error(res.data.message);
    } catch {
      toast.error("Failed to create project");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white font-medium flex items-center gap-2">
          <Plus size={16} /> Create Project
        </Button>
      </DialogTrigger>

      {/* =======================================================
          INCREASED WIDTH (max-w-5xl)
      ======================================================= */}
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Create New Project
          </DialogTitle>
        </DialogHeader>

        <form
          className="space-y-5 max-h-[80vh] overflow-y-auto"
          onSubmit={handleCreateProject}
        >
          {/* Project Name + Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">
                Project Name <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Enter project name"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Priority <span className="text-red-500">*</span>
              </label>
              <Select onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">Low</SelectItem>
                  <SelectItem value="active">Medium</SelectItem>
                  <SelectItem value="on_hold">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Country + Manager */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">
                Country <span className="text-red-500">*</span>
              </label>
              <Select onValueChange={setCountryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
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
              <label className="text-sm font-medium">
                Team Lead <span className="text-red-500">*</span>
              </label>
              <Select onValueChange={setManagerId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select manager" />
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

          {/* Workers Multi Select */}
          <div>
            <label className="text-sm font-medium">Assign Workers</label>
            <Select
              onValueChange={(value) => {
                if (!workers.includes(value)) {
                  setWorkers([...workers, value]);
                }
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
                const worker = users.find((u) => u.id === id);
                return (
                  <div
                    key={id}
                    className="px-3 py-1 bg-gray-200 rounded-full flex items-center gap-2"
                  >
                    {worker?.fullName}
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

          {/* ========================
              MULTIPLE DOCUMENTS PREVIEW
              FIXED + IMPROVED
          ======================== */}
          <div>
            <label className="text-sm font-medium">Upload Documents</label>
            <Input type="file" multiple onChange={handleDocuments} />

            <div className="flex flex-wrap gap-4 mt-4">
              {previews.map((item, i) => (
                <div key={i} className="relative">
                  {/* Image Preview */}
                  {item.type === "image" ? (
                    <Image
                      src={item.url}
                      width={90}
                      height={90}
                      className="rounded-md object-cover border"
                      alt="preview"
                    />
                  ) : (
                    // File Preview (non-image)
                    <div className="w-24 h-24 bg-gray-100 border rounded-md flex flex-col items-center justify-center text-xs text-center p-2">
                      <FileIcon className="w-6 h-6 mb-1" />
                      <span>{item.name}</span>
                    </div>
                  )}

                  {/* Remove Button */}
                  <button
                    type="button"
                    className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full"
                    onClick={() => removeDocument(i)}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Start Date</label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">End Date</label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className="text-sm font-medium">Budget</label>
            <Input
              placeholder="Enter budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              rows={4}
              placeholder="Explain project details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              + Create Project
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

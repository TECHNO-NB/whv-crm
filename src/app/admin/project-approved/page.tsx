// @ts-nocheck

"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FolderOpen,
  Play,
  DollarSign,
  Globe2,
  CheckCircle,
  Users,
} from "lucide-react";


import ProjectReviewCard from "@/components/ProjectReviewCard";

interface Project {
  id: string;
  title: string;
  approved: string;
  status: string;
  budget?: number;
  country?: { name: string };
  manager?: { name: string };
}

const page = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedTab, setSelectedTab] = useState("pending"); // default tab

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/projects`,
          { withCredentials: true }
        );
        setProjects(res.data.data || []);
      } catch (err: any) {
        console.error("Error fetching projects:", err);
        setError(err.response?.data?.message || "Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Filter according to active tab
  const filteredProjects = projects.filter(
    (p) => p.approved?.toLowerCase() === selectedTab
  );

  if (loading)
    return (
      <div className="text-center mt-10 text-gray-500">
        Loading projects...
      </div>
    );
  if (error)
    return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen px-4 py-10 ml-28">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-800">Project Management</h1>
      <p className="text-gray-500 text-sm">
        Manage and track NGO projects across multiple countries and initiatives.
      </p>

      {/* Tabs */}
      <div className="mt-6 flex gap-4 border-b pb-2">
        {["pending", "approved", "rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium capitalize
              ${
                selectedTab === tab
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Project Cards */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <ProjectReviewCard key={project.id} project={project} />
          ))
        ) : (
          <p className="text-gray-500">No projects found.</p>
        )}
      </div>
    </div>
  );
};

export default page;

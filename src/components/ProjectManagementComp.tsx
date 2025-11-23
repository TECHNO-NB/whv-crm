// @ts-nocheck
"use client";

import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  FolderOpen,
  Play,
  DollarSign,
  Globe2,
  CheckCircle,
  Users,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import CreateProjectModal from "@/components/CreateProjectModal";
import ProjectCard from "./ProjectCard";

interface Project {
  id: string;
  title: string;
  status: string;
  approved?: string;
  budget?: number;
  category?: string;
  country?: { countryName: string };
  manager?: { name: string };
  startDate?: string;
}

const ProjectManagementComp = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [search, setSearch] = useState<string>("");
  const [country, setCountry] = useState<string>("All");
  const [status, setStatus] = useState<string>("All");
  const [category, setCategory] = useState<string>("All");
  const [startDateFrom, setStartDateFrom] = useState<string>("");
  const [startDateTo, setStartDateTo] = useState<string>("");

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

  // Derived statistics
  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === "active").length;
  const completedProjects = projects.filter((p) => p.status === "completed").length;
  const totalBudget = projects.reduce((acc, p) => acc + (p.budget || 0), 0);
  const totalCountries = new Set(projects.map((p) => p.country?.countryName)).size;
  const teamMembers = projects.filter((p) => p.manager).length;

  const projectDetailsBox = [
    { title: "Total Projects", totalNumber: totalProjects, icon: <FolderOpen className="w-6 h-6" />, color: "text-orange-500" },
    { title: "Active Projects", totalNumber: activeProjects, icon: <Play className="w-6 h-6" />, color: "text-green-500" },
    { title: "Total Budget", totalNumber: `$${totalBudget.toLocaleString()}`, icon: <DollarSign className="w-6 h-6" />, color: "text-yellow-500" },
    { title: "Countries", totalNumber: totalCountries, icon: <Globe2 className="w-6 h-6" />, color: "text-blue-500" },
    { title: "Completed", totalNumber: completedProjects, icon: <CheckCircle className="w-6 h-6" />, color: "text-green-600" },
    { title: "Team Members", totalNumber: teamMembers, icon: <Users className="w-6 h-6" />, color: "text-purple-500" },
  ];

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
      const matchCountry = country === "All" || p.country?.countryName === country;
      const matchStatus = status === "All" || p.status.toLowerCase() === status.toLowerCase();
      const matchCategory = category === "All" || (p.category && p.category === category);
      const matchStartDateFrom = !startDateFrom || (p.startDate && new Date(p.startDate) >= new Date(startDateFrom));
      const matchStartDateTo = !startDateTo || (p.startDate && new Date(p.startDate) <= new Date(startDateTo));

      return matchSearch && matchCountry && matchStatus && matchCategory && matchStartDateFrom && matchStartDateTo;
    });
  }, [projects, search, country, status, category, startDateFrom, startDateTo]);

  if (loading)
    return <div className="text-center mt-10 text-gray-500">Loading projects...</div>;
  if (error)
    return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen px-4 py-10 ml-28">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Project Management</h1>
        <p className="text-gray-500 text-sm">
          Manage and track NGO projects across multiple countries and initiatives.
        </p>
      </div>

      {/* Project Summary Boxes */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mt-8">
        {projectDetailsBox.map((val, index) => (
          <div
            key={index}
            className="flex justify-between items-center px-4 py-4 min-w-44 border rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div>
              <h4 className="text-sm text-gray-500">{val.title}</h4>
              <h1 className="font-bold text-xl">{val.totalNumber}</h1>
            </div>
            <div className={`${val.color}`}>{val.icon}</div>
          </div>
        ))}
      </div>

      {/* Filter Section */}
      <div className="w-full border bg-white rounded-lg px-5 py-6 mt-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h1 className="text-xl font-bold text-gray-800">Project Filters</h1>
          <CreateProjectModal />
        </div>

        <div className="mt-6 flex flex-col lg:flex-row flex-wrap gap-4 lg:items-center">
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64"
          />

          {/* Country Filter */}
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
          >
            <option value="All">All Countries</option>
            {[...new Set(projects.map((p) => p.country?.countryName))].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
          >
            <option value="All">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="on hold">On Hold</option>
          </select>

          {/* Category Filter */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
          >
            <option value="All">All Categories</option>
            <option value="Health">Health</option>
            <option value="Education">Education</option>
            <option value="Environment">Environment</option>
          </select>

          {/* Clear Filters */}
          <button
            className="text-sm text-gray-500 hover:text-red-500 font-medium transition-colors"
            onClick={() => {
              setSearch("");
              setCountry("All");
              setStatus("All");
              setCategory("All");
              setStartDateFrom("");
              setStartDateTo("");
            }}
          >
            Clear
          </button>
        </div>

        {/* Date Range */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">Start Date From</label>
            <Input type="date" value={startDateFrom} onChange={(e) => setStartDateFrom(e.target.value)} className="max-w-44 border-gray-300" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">Start Date To</label>
            <Input type="date" value={startDateTo} onChange={(e) => setStartDateTo(e.target.value)} className="max-w-44 border-gray-300" />
          </div>
        </div>
      </div>

      {/* Project Cards */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default ProjectManagementComp;

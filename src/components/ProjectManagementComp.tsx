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
import ProjectsAddFilterComp from "./ProjectsAddFilterComp";
import ProjectCard from "./ProjectCard";

interface Project {
  id: string;
  title: string;
  status: string;
  budget?: number;
  country?: { name: string };
  manager?: { name: string };
}

const ProjectManagementComp = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/projects`, {
          withCredentials: true, // if you use cookies for auth
        });
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
  const totalCountries = new Set(projects.map((p) => p.country?.name)).size;
  const teamMembers = projects.filter((p) => p.manager).length;

  const projectDetailsBox = [
    {
      title: "Total Projects",
      totalNumber: totalProjects,
      icon: <FolderOpen className="w-6 h-6" />,
      color: "text-orange-500",
    },
    {
      title: "Active Projects",
      totalNumber: activeProjects,
      icon: <Play className="w-6 h-6" />,
      color: "text-green-500",
    },
    {
      title: "Total Budget",
      totalNumber: `$${totalBudget.toLocaleString()}`,
      icon: <DollarSign className="w-6 h-6" />,
      color: "text-yellow-500",
    },
    {
      title: "Countries",
      totalNumber: totalCountries,
      icon: <Globe2 className="w-6 h-6" />,
      color: "text-blue-500",
    },
    {
      title: "Completed",
      totalNumber: completedProjects,
      icon: <CheckCircle className="w-6 h-6" />,
      color: "text-green-600",
    },
    {
      title: "Team Members",
      totalNumber: teamMembers,
      icon: <Users className="w-6 h-6" />,
      color: "text-purple-500",
    },
  ];

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

      <ProjectsAddFilterComp />

      {/* Project Cards */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default ProjectManagementComp;

// @ts-nocheck

"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import CreateProjectModal from "@/components/CreateProjectModal";
import ProjectCard from "./ProjectCard";

const ProjectsAddFilterComp = () => {
  return (
    <div className="w-full border bg-white rounded-lg px-5 py-6 mt-8 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-gray-800">Project Filters</h1>
        {/* 🔸 Using the Modal Component */}
        <CreateProjectModal />
      </div>

      {/* Filter Controls */}
      <div className="mt-6 flex flex-col lg:flex-row flex-wrap gap-4 lg:items-center">
        {/* Search Section */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Input placeholder="Search projects..." className="w-full sm:w-64" />
          <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500">
            <option>All Countries</option>
            <option>Nepal</option>
            <option>India</option>
          </select>
        </div>

        {/* Status Filter */}
        <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500">
          <option>Status</option>
          <option>Active</option>
          <option>Completed</option>
          <option>On Hold</option>
        </select>

        {/* Category Filter */}
        <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500">
          <option>All Categories</option>
          <option>Health</option>
          <option>Education</option>
          <option>Environment</option>
        </select>

        {/* Clear Filters */}
        <button className="text-sm text-gray-500 hover:text-red-500 font-medium transition-colors">
          Clear
        </button>
      </div>

      {/* Date Range Filter */}
      <div className="mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">
              Start Date From
            </label>
            <Input type="date" className="max-w-44 border-gray-300" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">
              Start Date To
            </label>
            <Input type="date" className="max-w-44 border-gray-300" />
          </div>
        </div>
      </div>
     
    </div>
  );
};

export default ProjectsAddFilterComp;

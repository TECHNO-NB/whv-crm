// @ts-nocheck
"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  MapPin,
  Calendar,
  Eye,
  List,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import EditProjectModal from "@/components/EditProjectModal";

export default function ProjectCard({ project }) {
  const [openEdit, setOpenEdit] = useState(false);

  // --------------------------
  // 🔥 Dynamic Progress Formula
  // --------------------------
  const progress = useMemo(() => {
    const budget = Number(project.budget) || 0;
    const spent = Number(project.spent) || 0;

    if (budget <= 0) return 0;

    const calc = (spent / budget) * 100;
    return Math.min(100, Math.max(0, Math.round(calc)));
  }, [project.budget, project.spent]);

  return (
    <>
      {/* -------------------- CARD -------------------- */}
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

              {/* OPEN EDIT MODAL */}
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-orange-500 hover:bg-orange-50"
                onClick={() => setOpenEdit(true)}
              >
                <Pencil size={16} />
              </Button>
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

          {/* 🔥 Dynamic Progress */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-700">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>

            <Progress value={progress} className="mt-1 h-2 bg-gray-200" />
          </div>

          {/* Budget & Team */}
          <div className="grid grid-cols-2 gap-2 mt-4 text-sm text-gray-700 border-b pb-3">
            <div>
              <p className="font-medium">Budget</p>
              <p className="text-gray-900 font-semibold">
                ${project.budget?.toLocaleString()}
              </p>
            </div>

            <div>
              <p className="font-medium">Spent</p>
              <p className="text-gray-900 font-semibold">
                ${project.spent?.toLocaleString() || 0}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-3">
            {/* Worker avatars */}
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
        </CardContent>
      </Card>

      {/* ---------------- EDIT MODAL ---------------- */}
      <EditProjectModal
        open={openEdit}
        onClose={setOpenEdit}
        project={project}
      />
    </>
  );
}

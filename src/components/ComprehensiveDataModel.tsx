// @ts-nocheck

"use client";

import React from "react";
import {
  Building,
  User,
  Shield,
  FolderKanban,
  CalendarDays,
  CheckSquare,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface DataModelItem {
  title: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
  fields: string[];
}

const ComprehensiveDataModel = () => {
  const items: DataModelItem[] = [
    {
      title: "Organization",
      desc: "Core organizational structure and hierarchy management",
      icon: <Building className="w-6 h-6 text-white" />,
      color: "bg-blue-600",
      fields: ["id", "name", "country", "region", "created_at", "updated_at"],
    },
    {
      title: "User",
      desc: "User accounts, profiles, and authentication management",
      icon: <User className="w-6 h-6 text-white" />,
      color: "bg-green-600",
      fields: ["id", "name", "email", "role_id", "is_active", "last_login"],
    },
    {
      title: "Role",
      desc: "Role-based access control and permission management",
      icon: <Shield className="w-6 h-6 text-white" />,
      color: "bg-purple-600",
      fields: ["id", "name", "permissions", "organization_id", "created_at", "updated_at"],
    },
    {
      title: "Project",
      desc: "Project lifecycle management and tracking",
      icon: <FolderKanban className="w-6 h-6 text-white" />,
      color: "bg-orange-600",
      fields: ["id", "name", "start_date", "end_date", "status", "manager_id", "budget"],
    },
    {
      title: "Activity",
      desc: "Activity planning, scheduling, and execution tracking",
      icon: <CalendarDays className="w-6 h-6 text-white" />,
      color: "bg-indigo-600",
      fields: ["id", "activity_name", "project_id", "status", "assigned_to", "created_at"],
    },
    {
      title: "Task",
      desc: "Individual task management and assignment",
      icon: <CheckSquare className="w-6 h-6 text-white" />,
      color: "bg-teal-600",
      fields: ["id", "title", "description", "due_date", "assigned_to", "progress"],
    },
  ];

  return (
    <section className="py-16 px-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Comprehensive Data Model
        </h2>
        <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
          Explore the robust data architecture that powers our NGO management system,
          designed for scalability, security, and comprehensive organizational oversight.
        </p>
      </div>

      {/* Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {items.map((item, index) => (
          <Accordion type="single" collapsible key={index}>
            <AccordionItem
              value={`item-${index}`}
              className="bg-white shadow-sm border rounded-xl overflow-hidden hover:shadow-md transition"
            >
              <AccordionTrigger className="flex items-center gap-4 px-6 py-4">
                <div
                  className={`${item.color} w-10 h-10 flex items-center justify-center rounded-md`}
                >
                  {item.icon}
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-6 pb-6">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Database Fields:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                  {item.fields.map((field, i) => (
                    <div
                      key={i}
                      className="bg-gray-50 border border-gray-100 text-gray-700 rounded-md px-3 py-2 text-center"
                    >
                      {field}
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </section>
  );
};

export default ComprehensiveDataModel;

"use client";

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
import { CalendarIcon, Plus } from "lucide-react";

export default function CreateProjectModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white font-medium flex items-center gap-2">
          <Plus size={16} /> Create Project
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Create New Project
          </DialogTitle>
        </DialogHeader>

        <form className="space-y-5 max-h-[80vh] overflow-y-auto ">
          {/* Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">
                Project Name <span className="text-red-500">*</span>
              </label>
              <Input placeholder="Enter project name" />
            </div>
            <div>
              <label className="text-sm font-medium">
                Priority Level <span className="text-red-500">*</span>
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Medium Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">
                Country <span className="text-red-500">*</span>
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nepal">Nepal</SelectItem>
                  <SelectItem value="india">India</SelectItem>
                  <SelectItem value="usa">USA</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">
                Team Lead <span className="text-red-500">*</span>
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select team lead" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="john">John Doe</SelectItem>
                  <SelectItem value="emma">Emma Rai</SelectItem>
                  <SelectItem value="sita">Sita Sharma</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">
                Start Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input type="date" className="pr-10" />
                <CalendarIcon className="absolute right-3 top-3 h-4 w-4 text-gray-500" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">
                End Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input type="date" className="pr-10" />
                <CalendarIcon className="absolute right-3 top-3 h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">
                Budget (USD) <span className="text-red-500">*</span>
              </label>
              <Input placeholder="Enter budget amount" />
            </div>
          </div>

          {/* Project Description */}
          <div>
            <label className="text-sm font-medium">
              Project Description <span className="text-red-500">*</span>
            </label>
            <Textarea
              placeholder="Describe the project objectives, scope, and expected outcomes..."
              rows={4}
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 pt-3">
            <Button variant="outline">Cancel</Button>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              + Create Project
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

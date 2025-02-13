"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Edit2,
  FileText,
  Loader2,
  Plus,
  Trash2,
  Upload,
  AlertCircle,
  X,
} from "lucide-react";
import PopupAlert from "@/components/ui/popup-alert";
import { Select, SelectContent, SelectItem, SelectValue } from "../ui/select";
import { SelectTrigger } from "@radix-ui/react-select";
import { Button } from "../ui/button";
import { CalendarTrigger } from "../ui/calendar";

interface Alert {
  type?: "info" | "success" | "warning" | "error";
  message: string;
}

interface Assignment {
  id: number;
  name: string;
  description: string;
  due_date: string;
  color: string;
  start_time: string;
  end_time: string;
  reminder: number;
}

interface CourseData {
  course_name: string;
  assignments: Assignment[];
}

interface AssignmentFormProps {
  assignment?: Partial<Assignment>;
  onSave: (data: any) => void;
  onCancel: () => void;
  isNew?: boolean;
}

interface DocumentUploadProps {
  isSidebarOpen?: boolean;
}

const COLORS = [
  { value: "#7986cb", label: "Soft Indigo Blue" },
  { value: "#33b679", label: "Medium Sea Green" },
  { value: "#8e24aa", label: "Deep Purple" },
  { value: "#e67c73", label: "Salmon Pink" },
  { value: "#f6c026", label: "Warm Gold" },
  { value: "#f5511d", label: "Bright Orange Red" },
  { value: "#039be5", label: "Bright Sky Blue" },
  { value: "#616161", label: "Medium Gray" },
  { value: "#3f51b5", label: "Deep Indigo Blue" },
  { value: "#0b8043", label: "Forest Green" },
  { value: "#d60000", label: "Bright Red" },
];

const REMINDER_OPTIONS = [
  { value: 0, label: "No reminder" },
  { value: 15, label: "15 minutes before" },
  { value: 30, label: "30 minutes before" },
  { value: 60, label: "1 hour before" },
];

function AssignmentForm({
  assignment,
  onSave,
  onCancel,
  isNew = false,
}: AssignmentFormProps) {
  const [formData, setFormData] = useState({
    name: assignment?.name || "",
    description: assignment?.description || "",
    due_date: assignment?.due_date || "",
    color: assignment?.color || COLORS[0].value,
    start_time: assignment?.start_time || "",
    end_time: assignment?.end_time || "",
    reminder: assignment?.reminder || REMINDER_OPTIONS[0].value,
  });

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Assignment Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Enter assignment name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
          rows={3}
          placeholder="Enter description"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Due Date</label>
          <CalendarTrigger
            value={formData.due_date}
            onChange={(date) => setFormData({ ...formData, due_date: date })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Color
          </label>
          <Select
            value={formData.color}
            onValueChange={(value) =>
              setFormData({ ...formData, color: value })
            }
          >
            <SelectTrigger className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500">
              <SelectValue placeholder="Select a color" />
            </SelectTrigger>
            <SelectContent>
              {COLORS.map((color) => (
                <SelectItem key={color.value} value={color.value}>
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: color.value }}
                    />
                    {color.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Time
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="time"
              value={formData.start_time}
              onChange={(e) =>
                setFormData({ ...formData, start_time: e.target.value })
              }
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Time
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="time"
              value={formData.end_time}
              onChange={(e) =>
                setFormData({ ...formData, end_time: e.target.value })
              }
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Reminder
        </label>
        <Select
          value={formData.reminder.toString()}
          onValueChange={(value) =>
            setFormData({ ...formData, reminder: Number(value) })
          }
        >
          <SelectTrigger className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500">
            <SelectValue placeholder="Select a reminder" />
          </SelectTrigger>
          <SelectContent>
            {REMINDER_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value.toString()}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => onSave(formData)}
          className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-md hover:from-indigo-700 hover:to-purple-700"
        >
          {isNew ? "Add Assignment" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

export default function DocumentUpload({
  isSidebarOpen = true,
}: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<Alert | null>(null);
  const [assignments, setAssignments] = useState<Assignment[] | null>(null);
  const [courseName, setCourseName] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [uploadingToCalendar, setUploadingToCalendar] = useState(false);

  const handleExtraction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/extraction/extract-syllabus", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.message) {
        setAlert({
          type: "success",
          message: "Assignments Extracted Successfully!",
        });
      }

      setCourseName(data.data.course_name);
      setAssignments(data.data.assignments);
    } catch (error: any) {
      console.error(error);
      setAlert({
        type: "error",
        message: error.message || "Failed to extract data from document",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (assignment: Assignment) => {
    setEditingId(assignment.id);
  };

  const handleSave = (id: number, updatedData: Partial<Assignment>) => {
    if (!assignments) return;

    setAssignments(
      assignments.map((a) => (a.id === id ? { ...a, ...updatedData } : a))
    );
    setEditingId(null);
  };

  const handleDelete = (id: number) => {
    if (!assignments) return;

    setAssignments(assignments.filter((a) => a.id !== id));
  };

  const handleAddNew = (newAssignment: Omit<Assignment, "id">) => {

    /**
     * This will call a API endpoint to insert a assignment manually
     */

    if (!assignments) {
      setAssignments([{ ...newAssignment, id: 1 }]);
    } else {
      const newId = Math.max(...assignments.map((a) => a.id)) + 1;
      setAssignments([...assignments, { ...newAssignment, id: newId }]);
    }
    setShowNewForm(false);
  };

  const handleUploadToCalendar = async () => {
    setUploadingToCalendar(true);
    try {
      // Add your calendar upload logic here
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulated delay
      setAlert({
        type: "success",
        message: "Successfully uploaded to calendar!",
      });
    } catch (error) {
      setAlert({
        type: "error",
        message: "Failed to upload to calendar",
      });
    } finally {
      setUploadingToCalendar(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":");
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatReminder = (minutes: number) => {
    if (minutes >= 1440) {
      const days = Math.floor(minutes / 1440);
      return `${days} day${days > 1 ? "s" : ""} before`;
    } else if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      return `${hours} hour${hours > 1 ? "s" : ""} before`;
    }
    return `${minutes} minute${minutes > 1 ? "s" : ""} before`;
  };

  return (
    <div
      className={`w-full transition-all duration-300 ${
        isSidebarOpen ? "md:pl-64" : "md:pl-0"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {alert && (
          <PopupAlert
            message={alert.message}
            type={alert.type}
            duration={5000}
            onClose={() => setAlert(null)}
          />
        )}

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Course Schedule
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your assignments and deadlines
            </p>
          </div>
          <button
            onClick={handleUploadToCalendar}
            disabled={
              !assignments || assignments.length === 0 || uploadingToCalendar
            }
            className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploadingToCalendar ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Uploading...
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4 mr-2" />
                Add to Google Calendar
              </>
            )}
          </button>
        </div>

        {/* Upload Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex flex-col items-center justify-center">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-4">
                <Upload className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Upload Syllabus
              </h2>
              <p className="text-sm text-gray-500 mb-4 text-center">
                Upload your syllabus to automatically extract assignments
              </p>
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100
                cursor-pointer"
              />
              {file && (
                <div className="mt-4 flex items-center text-sm text-gray-600">
                  <FileText className="w-4 h-4 mr-2" />
                  {file.name}
                </div>
              )}
              <button
                onClick={handleExtraction}
                disabled={!file || loading}
                className="mt-4 w-full flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Processing...
                  </>
                ) : (
                  "Process Document"
                )}
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {courseName || "Course Name"}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500">Total Assignments</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {assignments?.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Assignments Section */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900">Assignments</h2>
          <button
            onClick={() => setShowNewForm(true)}
            disabled={!courseName}
            className={`w-full sm:w-auto flex items-center justify-center px-3 py-1.5 text-sm border rounded-lg transition-colors ${
              courseName 
                ? "text-indigo-600 border-indigo-200 hover:bg-indigo-50" 
                : "text-gray-400 border-gray-200 cursor-not-allowed"
            }`}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add New
          </button>
        </div>

        {!assignments ? (
          <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-sm border border-gray-100">
            <FileText className="h-12 w-12 text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No Assignments Loaded
            </h3>
            <p className="text-sm text-gray-500 text-center mb-4">
              Upload a syllabus to extract assignments
            </p>
            <button
              onClick={() => setShowNewForm(true)}
              disabled={!courseName}
              className={`flex items-center px-4 py-2 text-sm border rounded-lg transition-colors ${
                courseName
                  ? "text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                  : "text-gray-400 border-gray-200 cursor-not-allowed"
              }`}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add First Assignment
            </button>
          </div>
        ) : assignments.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-sm border border-gray-100">
            <FileText className="h-12 w-12 text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No Assignments Yet
            </h3>
            <p className="text-sm text-gray-500 text-center mb-4">
              Upload a syllabus
            </p>
            <button
              onClick={() => setShowNewForm(true)}
              disabled={!courseName}
              className={`flex items-center px-4 py-2 text-sm border rounded-lg transition-colors ${
                courseName
                  ? "text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                  : "text-gray-400 border-gray-200 cursor-not-allowed"
              }`}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add First Assignment
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {assignments.map((assignment) => (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
              >
                {editingId === assignment.id ? (
                  <AssignmentForm
                    assignment={assignment}
                    onSave={(data) => handleSave(assignment.id, data)}
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
                  <>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: assignment.color }}
                        />
                        <h3 className="font-medium text-gray-900">
                          {assignment.name}
                        </h3>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleEdit(assignment)}
                          className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(assignment.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {assignment.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {assignment.description}
                      </p>
                    )}

                    <div className="space-y-1.5 text-sm">
                      <div className="flex items-center text-gray-700">
                        <Calendar className="w-3.5 h-3.5 mr-1.5" />
                        {formatDate(assignment.due_date)}
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Clock className="w-3.5 h-3.5 mr-1.5" />
                        {formatTime(assignment.start_time)} -{" "}
                        {formatTime(assignment.end_time)}
                      </div>
                      <div className="flex items-center text-gray-700">
                        <AlertCircle className="w-3.5 h-3.5 mr-1.5" />
                        {formatReminder(assignment.reminder)}
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Add New Assignment Modal */}
        <AnimatePresence>
          {showNewForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            >
              <div className="bg-white rounded-xl p-6 w-full max-w-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Add New Assignment</h3>
                  <button
                    onClick={() => setShowNewForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <AssignmentForm
                  onSave={handleAddNew}
                  onCancel={() => setShowNewForm(false)}
                  isNew
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
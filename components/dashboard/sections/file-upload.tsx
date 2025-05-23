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
import { PopupAlert } from "@/components/ui/popup-alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { SelectTrigger } from "@radix-ui/react-select";
import { CalendarTrigger } from "@/components/ui/calendar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { Alert, AlertType, Assignment, CourseData } from "@/utils/types";

interface AssignmentFormProps {
  assignment?: Partial<Assignment>;
  onSave: (data: any) => void;
  onCancel: () => void;
  isNew?: boolean;
  isLoading?: boolean;
}

interface DocumentUploadProps {
  isSidebarOpen?: boolean;
  userAuthGoogle?: boolean;
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
  isLoading = false,
}: AssignmentFormProps) {
  const [formData, setFormData] = useState({
    name: assignment?.name || "",
    description: assignment?.description || "",
    due_date: assignment?.due_date || "",
    color: assignment?.color || COLORS[0].value,
    start_time: assignment?.start_time || "",
    end_time: assignment?.end_time || "",
    reminder: assignment?.reminder ?? REMINDER_OPTIONS[0].value,
  });
  const [timeError, setTimeError] = useState<string | null>(null);

  const validateTimes = (startTime: string, endTime: string) => {
    if (!startTime || !endTime) return true;

    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    const startDate = new Date();
    startDate.setHours(startHour, startMinute, 0);

    const endDate = new Date();
    endDate.setHours(endHour, endMinute, 0);

    return endDate > startDate;
  };

  const handleTimeChange = (
    field: "start_time" | "end_time",
    value: string
  ) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);

    if (newFormData.start_time && newFormData.end_time) {
      const isValid = validateTimes(
        newFormData.start_time,
        newFormData.end_time
      );
      setTimeError(isValid ? null : "End time must be after start time");
    } else {
      setTimeError(null);
    }
  };

  const handleSubmit = () => {
    if (timeError) return;
    onSave(formData);
  };

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
          onChange={(e) => {
            const textLength = e.target.value.slice(0, 500);
            setFormData({ ...formData, description: textLength });
          }
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
          rows={4}
          maxLength={500}
          placeholder="Enter description"
        />
        <div className="text-xs text-gray-500 mt-1 text-right">
          {formData.description.length}/500 characters
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Due Date
          </label>
          <CalendarTrigger
            value={formData.due_date}
            onChange={(date) => setFormData({ ...formData, due_date: date })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
              onChange={(e) => handleTimeChange("start_time", e.target.value)}
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
              onChange={(e) => handleTimeChange("end_time", e.target.value)}
              className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                timeError ? "border-red-500" : "border-gray-300"
              }`}
            />
          </div>
          {timeError && (
            <p className="mt-1 text-sm text-red-600">{timeError}</p>
          )}
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
                <div className="flex items-center">{option.label}</div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading || !!timeError}
          className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-md hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 flex items-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
              {isNew ? "Adding..." : "Saving..."}
            </>
          ) : isNew ? (
            "Add Assignment"
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </div>
  );
}

export default function DocumentUpload({
  isSidebarOpen = true,
  userAuthGoogle,
}: DocumentUploadProps) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<Alert | null>(null);
  const [assignments, setAssignments] = useState<Assignment[] | null>(null);
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(
    null
  );
  const [deletingAssignment, setDeleteAssignment] = useState<Assignment | null>(
    null
  );
  const [showNewForm, setShowNewForm] = useState(false);
  const [uploadingToCalendar, setUploadingToCalendar] = useState(false);

  const validateSyllabusFile = (file: File): boolean => {
    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      setAlert({
        type: AlertType.ERROR,
        message: "File size must be less than 10MB",
      });
      return false;
    }

    // Check file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      setAlert({
        type: AlertType.ERROR,
        message: "Invalid file type. Only PDF and Word documents are allowed.",
      });
      return false;
    }

    // Basic content validation by checking filename
    const syllabusKeywords = [
      "syllabus",
      "course",
      "outline",
      "schedule",
      "spring",
      "fall",
      "winter",
      "summer",
    ];
    const fileName = file.name.toLowerCase();
    const hasSyllabusKeyword = syllabusKeywords.some((keyword) =>
      fileName.includes(keyword)
    );

    if (!hasSyllabusKeyword) {
      setAlert({
        type: AlertType.WARNING,
        message: "Only Syllabus files are accepted.",
      });
      return false;
    }

    return true;
  };

  const handleExtraction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);

    // check if user is authenticated with google
    if (!userAuthGoogle) {
      router.push("/sign-in?reauth=true");
      return;
    }

    // validate file
    if (!validateSyllabusFile(file)) {
      setLoading(false);
      return;
    }

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
          type: AlertType.SUCCESS,
          message: "Assignments Extracted Successfully!",
        });
      }

      setCourseData(data.data);
      setAssignments(data.data.assignments);
    } catch (error: any) {
      console.error(error);
      setAlert({
        type: AlertType.ERROR,
        message: error.message || "Failed to extract data from document",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (assignment: Assignment) => {
    setEditingAssignment(assignment);
  };

  const handleSave = async (id: number, updatedData: Partial<Assignment>) => {
    if (!assignments) return;
    setLoading(true);

    try {
      const response = await fetch("/update-assignment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assignment: {
            id: id,
            ...updatedData,
          },
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const updatedAssignment = {
        ...assignments.find((a) => a.id === id),
        ...updatedData,
        id,
      } as Assignment;

      setAssignments(
        assignments.map((a) => (a.id === id ? updatedAssignment : a))
      );

      if (data.message) {
        setAlert({
          type: AlertType.SUCCESS,
          message: data.message,
        });
      }
    } catch (error: any) {
      console.error("Error updating assignment: ", error);
      setAlert({
        type: AlertType.ERROR,
        message: error.message || "Failed to update assignment",
      });
    } finally {
      setLoading(false);
      setEditingAssignment(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!assignments) return;

    const assignmentToDelete = assignments.find((a) => a.id === id);
    if (assignmentToDelete) {
      setDeleteAssignment(assignmentToDelete);
    }
  };

  const confirmDelete = async () => {
    if (!assignments || !deletingAssignment) return;
    setLoading(true);

    try {
      const response = await fetch("/delete-assignment", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assignmentId: deletingAssignment.id,
          courseId: courseData?.id,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setAssignments(assignments.filter((a) => a.id !== deletingAssignment.id));

      if (data.message) {
        setAlert({
          type: AlertType.SUCCESS,
          message: data.message,
        });
      }
    } catch (error: any) {
      console.error("Error deleting assignment: ", error);
      setAlert({
        type: AlertType.ERROR,
        message: error.message || "Failed to delete assignment",
      });
    } finally {
      setLoading(false);
      setDeleteAssignment(null);
    }
  };

  const handleAddNew = async (newAssignment: Omit<Assignment, "id">) => {
    setLoading(true);

    if (!newAssignment) return;

    try {
      const response = await fetch("/insert-manual-assignment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: courseData?.id,
          assignment: newAssignment,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setAssignments(
        assignments
          ? [...assignments, data.insertedAssignment]
          : [data.insertedAssignment]
      );

      if (data.message) {
        setAlert({
          type: AlertType.SUCCESS,
          message: data.message,
        });
      }

      setShowNewForm(false);
    } catch (error: any) {
      console.error(error);
      setAlert({
        type: AlertType.ERROR,
        message: error.message || "Failed to add new assignment",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUploadToCalendar = async () => {
    setUploadingToCalendar(true);
    try {
      const response = await fetch("/add-to-calendar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ assignments: assignments }),
      });

      const contentType = response.headers.get("Content-Type");

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }

        setAlert({
          type: AlertType.SUCCESS,
          message: "Assignments added to Google Calendar successfully!",
        });
      } else {
        router.push("/sign-in?reauth=true");
      }
    } catch (error: any) {
      setAlert({
        type: AlertType.ERROR,
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
              {courseData?.course_name || "Course Name"}
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
            disabled={!courseData?.course_name}
            className={`w-full sm:w-auto flex items-center justify-center px-3 py-1.5 text-sm border rounded-lg transition-colors ${
              courseData?.course_name
                ? "text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                : "text-gray-400 border-gray-200 cursor-not-allowed"
            }`}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add New
          </button>
        </div>

        {(() => {
          if (!assignments) {
            return (
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
                  disabled={!courseData?.course_name}
                  className={`flex items-center px-4 py-2 text-sm border rounded-lg transition-colors ${
                    courseData?.course_name
                      ? "text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                      : "text-gray-400 border-gray-200 cursor-not-allowed"
                  }`}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add First Assignment
                </button>
              </div>
            );
          }

          if (assignments.length === 0) {
            return (
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
                  disabled={!courseData?.course_name}
                  className={`flex items-center px-4 py-2 text-sm border rounded-lg transition-colors ${
                    courseData?.course_name
                      ? "text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                      : "text-gray-400 border-gray-200 cursor-not-allowed"
                  }`}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add First Assignment
                </button>
              </div>
            );
          }

          return (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {assignments.map((assignment) => (
                <motion.div
                  key={assignment.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
                >
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
                </motion.div>
              ))}
            </div>
          );
        })()}

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
                  isLoading={loading}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Assignment Modal */}
        <AnimatePresence>
          {editingAssignment && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            >
              <div className="bg-white rounded-xl p-6 w-full max-w-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Edit Assignment</h3>
                  <button
                    onClick={() => setEditingAssignment(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <AssignmentForm
                  assignment={editingAssignment}
                  onSave={(data) => handleSave(editingAssignment.id, data)}
                  onCancel={() => setEditingAssignment(null)}
                  isLoading={loading}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AlertDialog
          open={!!deletingAssignment}
          onOpenChange={() => setDeleteAssignment(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to delete this assignment?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This will remove our record of this assignment.
              </AlertDialogDescription>
              <div className="mt-2 font-medium text-amber-600">
                You will have to re-upload the syllabus this assignment belongs
                to if you choose to delete this assignment.
              </div>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                disabled={loading}
                onClick={() => setDeleteAssignment(null)}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                disabled={loading}
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white font-medium"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Deleting...
                  </>
                ) : (
                  "Delete Assignment"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
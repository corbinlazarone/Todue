"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  FileText,
  AlertCircle,
} from "lucide-react";

interface Assignment {
  id: number;
  name: string;
  description: string | null;
  due_date: string;
  color: string;
  start_time: string;
  end_time: string;
  reminder: number;
}

interface CourseData {
  id: string;
  course_name: string;
  created_at: string;
  assignments: Assignment[];
}

interface HistoryContentProps {
  isSidebarOpen?: boolean;
}

interface Alert {
  type?: "info" | "success" | "warning" | "error";
  message: string;
}

export default function HistoryContent({
  isSidebarOpen = true,
}: HistoryContentProps) {
  const [alert, setAlert] = useState<Alert | null>(null);
  const [courseHistory, setCourseHistory] = useState<CourseData[]>([]);
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourseHistory = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/extraction/user-extraction-history");
        const data = await response.json();

        if (data.error) {
          setAlert({
            type: "error",
            message: data.error,
          });
        }

        setCourseHistory(data.data);
      } catch (error: any) {
        console.error("Error occurred while fetching course history: ", error);
        setAlert({
          type: "error",
          message: "Unexpected error occurred. Please try again later.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseHistory();
  }, []);

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

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-5 w-5 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div
      className={`w-full transition-all duration-300 ${
        isSidebarOpen ? "pl-4" : "pl-0"
      }`}
    >
      <div className="max-w-7xl mx-auto pr-4">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Upload History</h1>
            <p className="text-sm text-gray-500 mt-1">
              View your previously uploaded course syllabuses and assignments
            </p>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : courseHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-sm border border-gray-100">
            <FileText className="h-12 w-12 text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No Upload History
            </h3>
            <p className="text-sm text-gray-500 text-center">
              Your uploaded syllabus course history will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {courseHistory.map((course) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() =>
                    setExpandedCourse(
                      expandedCourse === course.id ? null : course.id
                    )
                  }
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {course.course_name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Uploaded on {formatDate(course.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-500">
                        {course.assignments.length} assignments
                      </div>
                      {expandedCourse === course.id ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {expandedCourse === course.id && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="border-t border-gray-100"
                  >
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {course.assignments.map((assignment) => (
                        <div
                          key={assignment.id}
                          className="bg-gray-50 rounded-lg p-4"
                        >
                          <div className="flex items-center space-x-2 mb-3">
                            <div
                              className="h-2.5 w-2.5 rounded-full"
                              style={{ backgroundColor: assignment.color }}
                            />
                            <h4 className="font-medium text-gray-900">
                              {assignment.name}
                            </h4>
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
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
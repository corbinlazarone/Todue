"use client";

import { useState } from "react";
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

export default function HistoryContent({
  isSidebarOpen = true,
}: HistoryContentProps) {
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

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

  // Mock data - replace with actual data fetching
  const courseHistory: CourseData[] = [
    {
      id: "91fe7ead-916e-4c30-8289-44c095094ed2",
      course_name: "General Biology",
      created_at: "2025-02-13T05:08:58.018+00:00",
      assignments: [
        {
          id: 524775,
          name: "Test update class assignemnt 1",
          color: "#616161",
          due_date: "2023-09-08",
          end_time: "23:59:00",
          reminder: 1440,
          start_time: "23:59:00",
          description: "This is an updated class assignment!!!!!!1",
        },
        {
          id: 929137,
          name: "Class Assignment #2",
          color: "#e67c73",
          due_date: "2023-09-08",
          end_time: "23:59:00",
          reminder: 1440,
          start_time: "23:59:00",
          description: null,
        },
        {
          id: 657805,
          name: "Class Assignment #3",
          color: "#039be5",
          due_date: "2023-09-15",
          end_time: "23:59:00",
          reminder: 1440,
          start_time: "23:59:00",
          description: null,
        },
        {
          id: 186632,
          name: "Class Assignment #4",
          color: "#7986cb",
          due_date: "2023-09-22",
          end_time: "23:59:00",
          reminder: 1440,
          start_time: "23:59:00",
          description: null,
        },
        {
          id: 460936,
          name: "Class Assignment #5",
          color: "#616161",
          due_date: "2023-10-06",
          end_time: "23:59:00",
          reminder: 1440,
          start_time: "23:59:00",
          description: null,
        },
        {
          id: 510736,
          name: "Class Assignment #6",
          color: "#33b679",
          due_date: "2023-10-20",
          end_time: "23:59:00",
          reminder: 1440,
          start_time: "23:59:00",
          description: null,
        },
        {
          id: 443042,
          name: "Class Assignment #7",
          color: "#616161",
          due_date: "2023-10-27",
          end_time: "23:59:00",
          reminder: 1440,
          start_time: "23:59:00",
          description: null,
        },
        {
          id: 903218,
          name: "Class Assignment #8",
          color: "#e67c73",
          due_date: "2023-11-10",
          end_time: "23:59:00",
          reminder: 1440,
          start_time: "23:59:00",
          description: null,
        },
        {
          id: 350092,
          name: "Class Assignment #9",
          color: "#d60000",
          due_date: "2023-11-17",
          end_time: "23:59:00",
          reminder: 1440,
          start_time: "23:59:00",
          description: null,
        },
        {
          id: 88507,
          name: "Class Assignment #10",
          color: "#039be5",
          due_date: "2023-12-01",
          end_time: "23:59:00",
          reminder: 1440,
          start_time: "23:59:00",
          description: null,
        },
      ],
    },
    {
      id: "7b01ba79-e5c4-4f86-a785-83712522bb0f",
      course_name: "CALCULUS I I MATH 155 2 SECTION 07",
      created_at: "2025-02-12T22:39:31.993+00:00",
      assignments: [
        {
          id: 697636,
          name: "Final Exam",
          color: "#3f51b5",
          due_date: "2023-05-07",
          end_time: "14:30:00",
          reminder: 1440,
          start_time: "12:30:00",
          description: "Comprehensive",
        },
        {
          id: 255679,
          name: "Exam 1",
          color: "#7986cb",
          due_date: "2023-02-07",
          end_time: "23:59:00",
          reminder: 1440,
          start_time: "00:00:00",
          description: "",
        },
        {
          id: 884877,
          name: "Exam 2",
          color: "#33b679",
          due_date: "2023-03-12",
          end_time: "23:59:00",
          reminder: 1440,
          start_time: "00:00:00",
          description: "",
        },
        {
          id: 841277,
          name: "Exam 3",
          color: "#33b679",
          due_date: "2023-04-17",
          end_time: "23:59:00",
          reminder: 1440,
          start_time: "00:00:00",
          description: "",
        },
      ],
    },
    {
      id: "d81b40aa-3c4f-4592-9f50-fb797343edff",
      course_name: "BIOL 100 2: General Biology",
      created_at: "2025-02-10T21:45:37.46+00:00",
      assignments: [
        {
          id: 505528,
          name: "Class Assignment #1",
          color: "#e67c73",
          due_date: "2023-09-08",
          end_time: "23:59:00",
          reminder: 1440,
          start_time: "23:59:00",
          description: null,
        },
        {
          id: 729669,
          name: "Class Assignment #2",
          color: "#0b8043",
          due_date: "2023-09-08",
          end_time: "23:59:00",
          reminder: 1440,
          start_time: "23:59:00",
          description: null,
        },
        {
          id: 674423,
          name: "Class Assignment #3",
          color: "#0b8043",
          due_date: "2023-09-15",
          end_time: "23:59:00",
          reminder: 1440,
          start_time: "23:59:00",
          description: null,
        },
        {
          id: 454237,
          name: "Class Assignment #4",
          color: "#0b8043",
          due_date: "2023-09-22",
          end_time: "23:59:00",
          reminder: 1440,
          start_time: "23:59:00",
          description: null,
        },
        {
          id: 645627,
          name: "Class Assignment #5",
          color: "#7986cb",
          due_date: "2023-10-06",
          end_time: "23:59:00",
          reminder: 1440,
          start_time: "23:59:00",
          description: null,
        },
        {
          id: 156617,
          name: "Class Assignment #6",
          color: "#f6c026",
          due_date: "2023-10-20",
          end_time: "23:59:00",
          reminder: 1440,
          start_time: "23:59:00",
          description: null,
        },
        {
          id: 624422,
          name: "Class Assignment #7",
          color: "#f5511d",
          due_date: "2023-10-27",
          end_time: "23:59:00",
          reminder: 1440,
          start_time: "23:59:00",
          description: null,
        },
        {
          id: 713256,
          name: "Class Assignment #8",
          color: "#f5511d",
          due_date: "2023-11-10",
          end_time: "23:59:00",
          reminder: 1440,
          start_time: "23:59:00",
          description: null,
        },
        {
          id: 299577,
          name: "Class Assignment #9",
          color: "#039be5",
          due_date: "2023-11-17",
          end_time: "23:59:00",
          reminder: 1440,
          start_time: "23:59:00",
          description: null,
        },
        {
          id: 430413,
          name: "Class Assignment #10",
          color: "#3f51b5",
          due_date: "2023-12-01",
          end_time: "23:59:00",
          reminder: 1440,
          start_time: "23:59:00",
          description: null,
        },
      ],
    },
  ];

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
              View your previously uploaded course schedules
            </p>
          </div>
        </div>

        {/* Course History List */}
        {courseHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-sm border border-gray-100">
            <FileText className="h-12 w-12 text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No Upload History
            </h3>
            <p className="text-sm text-gray-500 text-center">
              Your uploaded course schedules will appear here
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
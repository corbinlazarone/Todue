"use client";

import React, { useEffect, useState } from "react";
import { List, Check, FileText, Clock, Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PopupAlert } from "../../ui/popup-alert";
import confetti from "canvas-confetti";
import { Alert, AlertType, Assignment, CourseData } from "@/utils/types";

interface ProductivityToolsProps {
  isSidebarOpen: boolean;
}

export default function ProductivityTools({
  isSidebarOpen = true,
}: ProductivityToolsProps) {
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const [completedAssignments, setCompletedAssignments] = useState<number[]>(
    []
  );
  const [courseData, setCourseData] = useState<CourseData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [alert, setAlert] = useState<Alert | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<
    (Assignment & { courseName: string }) | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState<number | null>(null);

  const formatTime = (timeString: string) => {
    if (!timeString) return "";

    const [hours, minutes] = timeString.split(":");
    const hoursNum = parseInt(hours);
    const period = hoursNum >= 12 ? "PM" : "AM";
    const formattedHours = hoursNum % 12 || 12;

    return `${formattedHours}:${minutes} ${period}`;
  };

  useEffect(() => {
    const fetchCourseHistory = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/extraction/user-extraction-history");
        const data = await response.json();

        if (data.error) {
          setAlert({
            type: AlertType.ERROR,
            message: data.error,
          });
        }

        setCourseData(data.data);

        const completedAssignmentIds = data.data
          .flatMap((course: CourseData) => course.assignments)
          .filter((assignment: Assignment) => assignment.completed)
          .map((assignment: Assignment) => assignment.id);

        setCompletedAssignments(completedAssignmentIds);
      } catch (error: any) {
        console.error("Error occurred while fetching course history: ", error);
        setAlert({
          type: AlertType.ERROR,
          message: "Unexpected error occurred. Please try again later.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseHistory();
  }, []);

  const toggleAssignment = async (
    assignment: Assignment,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    setIsUpdating(assignment.id);

    try {
      // If the assignment is in completedAssignments, we're unmarking it (false)
      // If it's not in completedAssignments, we're marking it (true)
      const markAssignment = !completedAssignments.includes(assignment.id);

      const response = await fetch("/mark-assignment", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assignment: assignment,
          MarkAssignment: markAssignment,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setCompletedAssignments((prev) =>
        prev.includes(assignment.id)
          ? prev.filter((aId) => aId !== assignment.id)
          : [...prev, assignment.id]
      );

      if (markAssignment) {
        hanldeConfettiFireworks();
      }

      if (data.message) {
        setAlert({
          type: data.message.type,
          message: data.message.message,
        });
      }
    } catch (error) {
      console.error("Error updating assignment status:", error);
      setAlert({
        type: AlertType.ERROR,
        message: "Failed to update assignment status. Please try again.",
      });
    } finally {
      setIsUpdating(null);
    }
  };

  const handleAssignmentClick = (
    assignment: Assignment & { courseName: string }
  ) => {
    setSelectedAssignment(assignment);
    setIsModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getFilteredAssignments = () => {
    const allAssignments = courseData.flatMap((course) =>
      course.assignments.map((assignment) => ({
        ...assignment,
        courseName: course.course_name,
      }))
    );

    if (selectedCourse === "all") return allAssignments;

    return allAssignments.filter((assignment) => {
      const course = courseData.find((course) =>
        course.assignments.some((a) => a.id === assignment.id)
      );
      return course?.id === selectedCourse;
    });
  };

  const hanldeConfettiFireworks = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
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
        {alert && (
          <PopupAlert
            message={alert.message}
            type={alert.type}
            duration={3000}
            onClose={() => setAlert(null)}
          />
        )}

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Productivity Tools
          </h1>
          <p className="text-sm text-gray-500 mt-1">Assignment management</p>
        </div>

        {isLoading ? (
          <LoadingSkeleton />
        ) : courseData.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-sm border border-gray-100">
            <FileText className="h-12 w-12 text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No Course History
            </h3>
            <p className="text-sm text-gray-500 text-center">
              Your uploaded syllabus course history will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold">
                  Assignments
                </CardTitle>
                <List className="h-5 w-5 text-indigo-600" />
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Select
                    value={selectedCourse}
                    onValueChange={(value) => setSelectedCourse(value)}
                  >
                    <SelectTrigger className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500">
                      <SelectValue placeholder="Filter by course" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Courses</SelectItem>
                      {courseData.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.course_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
                  {getFilteredAssignments().map((assignment) => (
                    <motion.div
                      key={assignment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      onClick={() => handleAssignmentClick(assignment)}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={(e) => toggleAssignment(assignment, e)}
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center relative
                            ${
                              completedAssignments.includes(assignment.id)
                                ? "border-indigo-600 bg-indigo-600"
                                : "border-gray-300"
                            }
                            ${isUpdating === assignment.id ? "cursor-wait" : "cursor-pointer"}
                            disabled:opacity-50
                          `}
                          disabled={isUpdating !== null}
                        >
                          {completedAssignments.includes(assignment.id) && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                          {isUpdating === assignment.id && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="absolute inset-0 bg-indigo-100 rounded-full opacity-50"></div>
                              <div className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                            </div>
                          )}
                        </button>
                        <div>
                          <span
                            className={`text-sm ${
                              completedAssignments.includes(assignment.id)
                                ? "line-through text-gray-400"
                                : "text-gray-700"
                            }`}
                          >
                            {assignment.name}
                          </span>
                          {assignment.description && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              {assignment.description}
                            </p>
                          )}
                          <div className="text-xs text-gray-500 mt-0.5">
                            {assignment.courseName} • Due:{" "}
                            {new Date(assignment.due_date).toLocaleDateString()}
                            {assignment.start_time &&
                              ` • ${formatTime(assignment.start_time)}`}
                            {assignment.end_time &&
                              ` - ${formatTime(assignment.end_time)}`}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: assignment.color }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <AlertDialogContent className="sm:max-w-[500px]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-semibold">
                {selectedAssignment?.name}
              </AlertDialogTitle>
              <div className="space-y-4 mt-2">
                <AlertDialogDescription asChild>
                  <div className="flex items-start space-x-2">
                    <Calendar className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="block text-sm font-medium text-gray-700">
                        Due Date
                      </span>
                      <span className="block text-sm text-gray-500">
                        {selectedAssignment &&
                          formatDate(selectedAssignment.due_date)}
                      </span>
                    </div>
                  </div>
                </AlertDialogDescription>

                {(selectedAssignment?.start_time ||
                  selectedAssignment?.end_time) && (
                  <AlertDialogDescription asChild>
                    <div className="flex items-start space-x-2">
                      <Clock className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="block text-sm font-medium text-gray-700">
                          Time
                        </span>
                        <span className="block text-sm text-gray-500">
                          {selectedAssignment?.start_time &&
                            `From ${formatTime(selectedAssignment.start_time)}`}
                          {selectedAssignment?.end_time &&
                            ` to ${formatTime(selectedAssignment.end_time)}`}
                        </span>
                      </div>
                    </div>
                  </AlertDialogDescription>
                )}

                <AlertDialogDescription asChild>
                  <div className="flex items-start space-x-2">
                    <FileText className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="block text-sm font-medium text-gray-700">
                        Description
                      </span>
                      <span className="block text-sm text-gray-500">
                        {selectedAssignment?.description ||
                          "No description provided"}
                      </span>
                    </div>
                  </div>
                </AlertDialogDescription>

                <AlertDialogDescription asChild>
                  <div className="flex items-start space-x-2">
                    <List className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="block text-sm font-medium text-gray-700">
                        Course
                      </span>
                      <span className="block text-sm text-gray-500">
                        {selectedAssignment?.courseName}
                      </span>
                    </div>
                  </div>
                </AlertDialogDescription>
              </div>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="text-sm font-medium bg-gray-100 hover:bg-gray-200">
                Close
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
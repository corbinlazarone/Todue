import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  Clock,
  Calendar,
  CheckCircle2,
  FileText,
  TrendingUp,
  Activity,
} from "lucide-react";
import PopupAlert from "@/components/ui/popup-alert";
import { User } from "@supabase/supabase-js";

interface Assignment {
  id: number;
  name: string;
  description: string;
  due_date: string;
  color: string;
  start_time: string;
  end_time: string;
  reminder: number;
  completed?: boolean;
  completed_at?: string;
}

interface CourseData {
  id: string;
  course_name: string;
  created_at: string;
  assignments: Assignment[];
}

interface DashboardCompProps {
  isSidebarOpen?: boolean;
  user: User;
}

interface Alert {
  type?: "info" | "success" | "warning" | "error";
  message: string;
}

export default function DashboardComp({
  isSidebarOpen = true,
  user,
}: DashboardCompProps) {
  const [courseData, setCourseData] = useState<CourseData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState<Alert | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState("week");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/extraction/user-extraction-history");
        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        setCourseData(data.data);
      } catch (error: any) {
        setAlert({
          type: "error",
          message: error.message || "Failed to fetch dashboard data",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const toTitleCase = (str: string) => {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  const getStats = () => {
    const totalCourses = courseData.length;
    const totalAssignments = courseData.reduce(
      (sum, course) => sum + course.assignments.length,
      0
    );
    const completedAssignments = courseData.reduce(
      (sum, course) =>
        sum + course.assignments.filter((a) => a.completed).length,
      0
    );
    const upcomingAssignments = courseData.reduce(
      (sum, course) =>
        sum +
        course.assignments.filter((a) => {
          const dueDate = new Date(a.due_date);
          const now = new Date();
          return dueDate > now && !a.completed;
        }).length,
      0
    );

    const completionRate =
      totalAssignments > 0
        ? ((completedAssignments / totalAssignments) * 100).toFixed(1)
        : 0;

    return {
      totalCourses,
      totalAssignments,
      completedAssignments,
      upcomingAssignments,
      completionRate,
    };
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const getUpcomingDeadlines = () => {
    const now = new Date();
    const allAssignments = courseData.flatMap((course) =>
      course.assignments.map((assignment) => ({
        ...assignment,
        courseName: course.course_name,
      }))
    );

    return allAssignments
      .filter((assignment) => {
        const dueDate = new Date(assignment.due_date);
        return dueDate > now && !assignment.completed;
      })
      .sort(
        (a, b) =>
          new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
      )
      .slice(0, 5);
  };

  const getRecentActivity = () => {
    const allAssignments = courseData.flatMap((course) =>
      course.assignments.map((assignment) => ({
        ...assignment,
        courseName: course.course_name,
      }))
    );

    return allAssignments
      .filter((assignment) => assignment.completed)
      .sort(
        (a, b) =>
          new Date(b.completed_at || "").getTime() -
          new Date(a.completed_at || "").getTime()
      )
      .slice(0, 5);
  };

  const getCompletionTrend = () => {
    const timeframes = {
      week: 7,
      month: 30,
      year: 365,
    };

    const days = timeframes[selectedTimeframe as keyof typeof timeframes];
    const trend = [];
    const now = new Date();

    // Create a map of completion dates and counts
    const completionMap = new Map();
    
    courseData.forEach(course => {
      course.assignments.forEach(assignment => {
        if (assignment.completed && assignment.completed_at) {
          const completedDate = new Date(assignment.completed_at).toISOString().split('T')[0];
          completionMap.set(completedDate, (completionMap.get(completedDate) || 0) + 1);
        }
      });
    });

    // Generate trend data for the selected timeframe
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayStr = date.toISOString().split('T')[0];

      trend.push({
        date: dayStr,
        completed: completionMap.get(dayStr) || 0,
      });
    }

    return trend;
  };
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
          <div className="h-4 w-1/3 bg-gray-200 rounded mb-2"></div>
          <div className="h-8 w-1/2 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <div
        className={`w-full transition-all duration-300 ${
          isSidebarOpen ? "pl-4" : "pl-0"
        }`}
      >
        <div className="max-w-7xl mx-auto pr-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
              Welcome Back {toTitleCase(user.user_metadata.full_name) || user.email}!
              </h1>
              <p className="text-sm text-gray-500 mt-1">View your stats</p>
            </div>
          </div>
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (courseData.length === 0) {
    return (
      <div
        className={`w-full transition-all duration-300 ${
          isSidebarOpen ? "pl-4" : "pl-0"
        }`}
      >
        <div className="max-w-7xl mx-auto pr-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
              Welcome Back {toTitleCase(user.user_metadata.full_name) || user.email}!
              </h1>
              <p className="text-sm text-gray-500 mt-1">View your stats</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-sm border border-gray-100">
            <FileText className="h-12 w-12 text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No Data Available
            </h3>
            <p className="text-sm text-gray-500 text-center">
              Upload a syllabus to start tracking your courses and assignments
            </p>
          </div>
        </div>
      </div>
    );
  }

  const stats = getStats();
  const COLORS = ["#4f46e5", "#e5e7eb"];

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
            duration={5000}
            onClose={() => setAlert(null)}
          />
        )}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome Back {toTitleCase(user.user_metadata.full_name) || user.email}!</h1>
            <p className="text-sm text-gray-500 mt-1">View your stats</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Courses
              </CardTitle>
              <BookOpen className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCourses}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Assignments
              </CardTitle>
              <FileText className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAssignments}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Completion Rate
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completionRate}%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <Clock className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.upcomingAssignments}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Charts Section */}
          <div className="lg:col-span-2 grid grid-cols-1 gap-4">
            {/* Completion Trend */}
            <Card className="p-4">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Completion Trend</CardTitle>
                  <div className="flex space-x-2">
                    {["week", "month", "year"].map((timeframe) => (
                      <button
                        key={timeframe}
                        onClick={() => setSelectedTimeframe(timeframe)}
                        className={`px-3 py-1 text-sm rounded-md ${
                          selectedTimeframe === timeframe
                            ? "bg-indigo-100 text-indigo-700"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={getCompletionTrend()}
                      margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={formatDate}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis />
                      <Tooltip 
                        labelFormatter={formatDate}
                        formatter={(value: number) => [`${value} completed`, 'Assignments']}
                      />
                      <Line
                        type="monotone"
                        dataKey="completed"
                        stroke="#4f46e5"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Assignment Distribution */}
            <Card className="p-4">
              <CardHeader>
                <CardTitle className="text-lg">Assignment Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={courseData}
                      margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="course_name"
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="assignments.length"
                        fill="#4f46e5"
                        name="Assignments"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Section */}
          <div className="space-y-4">
            {/* Upcoming Deadlines */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-indigo-600" />
                  Upcoming Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getUpcomingDeadlines().length > 0 ? (
                    getUpcomingDeadlines().map((assignment) => (
                      <div
                        key={assignment.id}
                        className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div
                          className="w-2 h-2 rounded-full mt-2"
                          style={{ backgroundColor: assignment.color }}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-gray-900 truncate">
                            {assignment.name}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {assignment.courseName}
                          </p>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatTime(assignment.start_time)} -{" "}
                            {formatTime(assignment.end_time)}
                          </div>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(assignment.due_date)}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">All caught up!</p>
                      <p className="text-xs text-gray-500">
                        No upcoming deadlines
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-indigo-600" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getRecentActivity().length > 0 ? (
                    getRecentActivity().map((assignment) => (
                      <div
                        key={assignment.id}
                        className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-gray-900 truncate">
                            {assignment.name}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            Completed in {assignment.courseName}
                          </p>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <Clock className="h-3 w-3 mr-1" />
                            {assignment.completed_at
                              ? formatDate(assignment.completed_at)
                              : "Recently"}
                          </div>
                        </div>
                        <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <Activity className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">No recent activity</p>
                      <p className="text-xs text-gray-500">
                        Complete assignments to see them here
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Progress Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-indigo-600" />
                  Progress Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {courseData.map((course) => {
                    const totalAssignments = course.assignments.length;
                    const completedAssignments = course.assignments.filter(
                      (a) => a.completed
                    ).length;
                    const progressPercent =
                      totalAssignments > 0
                        ? (completedAssignments / totalAssignments) * 100
                        : 0;

                    return (
                      <div key={course.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-medium text-gray-700">
                            {course.course_name}
                          </p>
                          <span className="text-xs text-gray-500">
                            {completedAssignments}/{totalAssignments}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full">
                          <div
                            className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
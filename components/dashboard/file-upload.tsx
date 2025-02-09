'use client';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, Clock, Edit2, FileText, Loader2, Plus, Trash2, Upload, AlertCircle, X } from 'lucide-react';
import PopupAlert from '@/components/ui/popup-alert';

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

const COLORS = [
  { value: '#7986cb', label: 'Blue' },
  { value: '#33b679', label: 'Green' },
  { value: '#8e24aa', label: 'Purple' },
  { value: '#e67c73', label: 'Red' },
];

const REMINDER_OPTIONS = [
  { value: 10, label: '10 minutes' },
  { value: 60, label: '1 hour' },
  { value: 1440, label: '1 day' },
  { value: 2880, label: '2 days' },
  { value: 10080, label: '1 week' },
];

const DEMO_DATA: CourseData = {
  course_name: "CS 101: Introduction to Computer Science",
  assignments: [
    {
      id: 1,
      name: "Midterm Exam",
      description: "Covers chapters 1-5: Programming fundamentals, data structures, and algorithms",
      due_date: "2024-03-15",
      color: "#7986cb",
      start_time: "14:30",
      end_time: "16:30",
      reminder: 1440
    },
    {
      id: 2,
      name: "Programming Assignment #1",
      description: "Build a simple calculator application using Python",
      due_date: "2024-02-28",
      color: "#33b679",
      start_time: "23:59",
      end_time: "23:59",
      reminder: 2880
    },
    {
      id: 3,
      name: "Group Project Presentation",
      description: "Present your final project to the class. Each group will have 15 minutes.",
      due_date: "2024-04-20",
      color: "#8e24aa",
      start_time: "10:00",
      end_time: "11:30",
      reminder: 4320
    },
    {
      id: 4,
      name: "Final Exam",
      description: "Comprehensive final covering all course material",
      due_date: "2024-05-10",
      color: "#e67c73",
      start_time: "13:00",
      end_time: "16:00",
      reminder: 10080
    }
  ]
};

function AssignmentForm({ assignment, onSave, onCancel, isNew = false }: AssignmentFormProps) {
  const [formData, setFormData] = useState({
    name: assignment?.name || '',
    description: assignment?.description || '',
    due_date: assignment?.due_date || '',
    color: assignment?.color || COLORS[0].value,
    start_time: assignment?.start_time || '',
    end_time: assignment?.end_time || '',
    reminder: assignment?.reminder || REMINDER_OPTIONS[0].value,
  });

  return (
    <div className="space-y-4">
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
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
          rows={3}
          placeholder="Enter description"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Due Date
          </label>
          <input
            type="date"
            value={formData.due_date}
            onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Color
          </label>
          <select
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {COLORS.map((color) => (
              <option key={color.value} value={color.value}>
                {color.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Time
          </label>
          <input
            type="time"
            value={formData.start_time}
            onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Time
          </label>
          <input
            type="time"
            value={formData.end_time}
            onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Reminder
        </label>
        <select
          value={formData.reminder}
          onChange={(e) => setFormData({ ...formData, reminder: Number(e.target.value) })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          {REMINDER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={() => onCancel()}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => onSave(formData)}
          className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-md hover:from-indigo-700 hover:to-purple-700"
        >
          {isNew ? 'Add Assignment' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

export default function DocumentUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [assignments, setAssignments] = useState(DEMO_DATA.assignments);
  const [courseName, setCourseName] = useState(DEMO_DATA.course_name);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [uploadingToCalendar, setUploadingToCalendar] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);

    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const handleEdit = (assignment: Assignment) => {
    setEditingId(assignment.id);
  };

  const handleSave = (id: number, updatedData: Partial<Assignment>) => {
    setAssignments(assignments.map(a => 
      a.id === id ? { ...a, ...updatedData } : a
    ));
    setEditingId(null);
  };

  const handleDelete = (id: number) => {
    setAssignments(assignments.filter(a => a.id !== id));
  };

  const handleAddNew = (newAssignment: Omit<Assignment, 'id'>) => {
    const newId = Math.max(...assignments.map(a => a.id)) + 1;
    setAssignments([...assignments, { ...newAssignment, id: newId }]);
    setShowNewForm(false);
  };

  const handleUploadToCalendar = async () => {
    setUploadingToCalendar(true);
    // Simulate API call
    setTimeout(() => {
      setUploadingToCalendar(false);
      setShowSuccessPopup(true);
    }, 2000);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const formatReminder = (minutes: number) => {
    if (minutes >= 1440) {
      const days = Math.floor(minutes / 1440);
      return `${days} day${days > 1 ? 's' : ''} before`;
    } else if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} before`;
    }
    return `${minutes} minute${minutes > 1 ? 's' : ''} before`;
  };

  return (
    <div className="h-full w-full overflow-y-auto px-6 py-6">
      {showSuccessPopup && (
        <PopupAlert
          message="Successfully added assignments to Google Calendar!"
          type="success"
          onClose={() => setShowSuccessPopup(false)}
        />
      )}

      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Course Schedule</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your assignments and deadlines</p>
        </div>
        <button
          onClick={handleUploadToCalendar}
          disabled={uploadingToCalendar}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploadingToCalendar ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
              Uploading...
            </>
          ) : (
            <>
              <Calendar className="w-4 h-4 mr-2" />
              Sync Calendar
            </>
          )}
        </button>
      </div>

      {/* Upload Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex flex-col items-center justify-center">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-4">
              <Upload className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Upload Syllabus</h2>
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
              onClick={handleSubmit}
              disabled={!file || loading}
              className="mt-4 w-full flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Processing...
                </>
              ) : (
                'Process Document'
              )}
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{courseName}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Total Assignments</p>
              <p className="text-2xl font-semibold text-gray-900">{assignments.length}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Upcoming Due</p>
              <p className="text-2xl font-semibold text-gray-900">
                {assignments.filter(a => new Date(a.due_date) > new Date()).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Assignments Section */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Assignments</h2>
        <button
          onClick={() => setShowNewForm(true)}
          className="flex items-center px-3 py-1.5 text-sm text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add New
        </button>
      </div>

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
                    <h3 className="font-medium text-gray-900">{assignment.name}</h3>
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
                    {formatTime(assignment.start_time)} - {formatTime(assignment.end_time)}
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
  );
}
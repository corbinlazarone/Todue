import { useState, useCallback, ChangeEvent, DragEvent } from "react";
import { Upload, X, FileText, AlertCircle } from "lucide-react";

interface FileUploadProps {
  onFileSelect?: (file: File | null) => void;
  maxSizeMB?: number;
}

type AllowedMimeTypes =
  | "application/pdf"
  | "application/msword"
  | "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const allowedTypes: AllowedMimeTypes[] = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export default function FileUpload({
  onFileSelect,
  maxSizeMB = 10,
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const validateFile = (file: File): boolean => {
    if (!allowedTypes.includes(file.type as AllowedMimeTypes)) {
      setError("Please upload a PDF or Word document");
      return false;
    }

    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      return false;
    }
    return true;
  };

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      setError("");

      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile && validateFile(droppedFile)) {
        setFile(droppedFile);
        onFileSelect?.(droppedFile);
      }
    },
    [onFileSelect]
  );

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setError("");
      const selectedFile = e.target.files?.[0];
      if (selectedFile && validateFile(selectedFile)) {
        setFile(selectedFile);
        onFileSelect?.(selectedFile);
      }
    },
    [onFileSelect]
  );

  const removeFile = useCallback(() => {
    setFile(null);
    setError("");
    onFileSelect?.(null);
  }, [onFileSelect]);

  const formatFileSize = (bytes: number): string => {
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 
          ${isDragging ? "border-indigo-500 bg-indigo-50" : "border-gray-300 hover:border-indigo-500"}
          ${error ? "border-red-300 bg-red-50" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx"
        />

        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <Upload className="h-8 w-8 text-white" />
          </div>

          <div className="space-y-2">
            <p className="text-lg font-semibold text-gray-900">
              {file ? "File selected" : "Upload your syllabus"}
            </p>
            <p className="text-sm text-gray-500">
              Drag and drop or click to select a file
            </p>
            <p className="text-xs text-gray-400">
              Supported formats: PDF, DOC, DOCX (Max {maxSizeMB}MB)
            </p>
          </div>
        </div>

        {/* Selected File Display */}
        {file && (
          <div className="mt-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(file.size)}
                </p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              type="button"
              aria-label="Remove file"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
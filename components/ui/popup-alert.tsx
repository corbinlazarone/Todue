"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Info, AlertTriangle, XCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AlertPropsForPopup {
  message: string;
  type?: "info" | "success" | "warning" | "error";
  duration?: number;
  onClose: () => void;
}

export function PopupAlert({
  message,
  type = "info",
  duration = 3000,
  onClose,
}: AlertPropsForPopup) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = {
    info: "bg-blue-100 border-blue-500 text-blue-800",
    success: "bg-green-100 border-green-500 text-green-800",
    warning: "bg-yellow-100 border-yellow-500 text-yellow-800",
    error: "bg-red-100 border-red-500 text-red-800",
  }[type];

  const IconComponent = {
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    error: XCircle,
  }[type];

  const formatMessage = (content: string) => {
    if (content.includes('\n')) {
      const lines = content.split('\n');
      return (
        <div className="space-y-1">
          {lines.map((line, index) => (
            <div 
              key={index} 
              className={line.startsWith('•') ? 'ml-4 flex items-start' : 'font-medium'}
            >
              {line}
            </div>
          ))}
        </div>
      );
    }
    return <p className="text-sm font-medium break-words">{content}</p>;
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="fixed top-4 right-4 z-50"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className={`flex items-start min-w-[320px] max-w-md shadow-lg rounded-lg pointer-events-auto border ${bgColor}`}
          >
            <div className="flex-1 p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  <IconComponent className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  {formatMessage(message)}
                </div>
                <button
                  className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-gray-400 rounded-full transition-colors duration-150"
                  onClick={() => {
                    setIsVisible(false);
                    onClose();
                  }}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
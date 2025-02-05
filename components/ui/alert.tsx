import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

interface AlertProps {
  children: React.ReactNode;
  variant: "info" | "warning" | "error" | "success";
  title?: string;
}

export default function Alert({ children, variant, title }: AlertProps) {
  const baseClasses = "p-4 rounded-md flex items-start space-x-3";
  const variantClasses = {
    info: "bg-blue-50 text-blue-800",
    warning: "bg-yellow-50 text-yellow-800",
    error: "bg-red-50 text-red-800",
    success: "bg-green-50 text-green-800"
  };

  const iconClasses = "flex-shrink-0 h-5 w-5 mt-0.5";

  const IconComponent = {
    info: Info,
    warning: AlertTriangle,
    error: AlertCircle,
    success: CheckCircle
  }[variant];

  const formatMessage = (content: React.ReactNode) => {
    if (typeof content === 'string' && content.includes('\n')) {
      const lines = content.split('\n');
      return (
        <div className="space-y-1">
          {lines.map((line, index) => (
            <div key={index} className={line.startsWith('•') ? 'ml-4' : ''}>
              {line}
            </div>
          ))}
        </div>
      );
    }
    return content;
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} flex w-full md:w-auto max-w-lg`}>
      <IconComponent className={iconClasses} />
      <div className="flex-1 space-y-1">
        {title && (
          <h3 className="font-medium">{title}</h3>
        )}
        <div className="text-sm">
          {formatMessage(children)}
        </div>
      </div>
    </div>
  );
}
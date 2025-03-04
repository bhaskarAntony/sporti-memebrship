import React, { ReactNode } from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

interface AlertProps {
  variant: 'success' | 'info' | 'warning' | 'error';
  title?: string;
  children: ReactNode;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({
  variant,
  title,
  children,
  className = '',
}) => {
  const baseClasses = 'p-4 mb-4 rounded-lg';

  const variantClasses = {
    success: 'bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-300',
    info: 'bg-blue-50 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    warning: 'bg-yellow-50 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    error: 'bg-red-50 text-red-800 dark:bg-red-900 dark:text-red-300',
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 mr-2" />,
    info: <Info className="w-5 h-5 mr-2" />,
    warning: <AlertCircle className="w-5 h-5 mr-2" />,
    error: <XCircle className="w-5 h-5 mr-2" />,
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      <div className="flex items-center">
        {icons[variant]}
        {title && <span className="font-medium">{title}</span>}
      </div>
      <div className={title ? 'mt-2 ml-7' : ''}>{children}</div>
    </div>
  );
};

export default Alert;
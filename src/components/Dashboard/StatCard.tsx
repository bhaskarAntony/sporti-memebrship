import React, { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  className = '',
}) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</h3>
          
          {change && (
            <div className="flex items-center mt-2">
              <span
                className={`text-sm font-medium ${
                  change.isPositive
                    ? 'text-green-600 dark:text-green-500'
                    : 'text-red-600 dark:text-red-500'
                }`}
              >
                {change.isPositive ? '+' : ''}{change.value}%
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">from last month</span>
            </div>
          )}
        </div>
        
        <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-full">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
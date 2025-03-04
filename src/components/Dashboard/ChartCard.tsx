import React, { ReactNode } from 'react';
import Card from '../UI/Card';

interface ChartCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, children, className = '' }) => {
  return (
    <Card className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
      </div>
      <div className="w-full h-full">{children}</div>
    </Card>
  );
};

export default ChartCard;
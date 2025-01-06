import React, { useState } from 'react';
import { TaskDetails } from './TaskDetails';
import { useTaskStore } from '../store/taskStore';

interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  progress: number;
  category: string;
  dueDate?: string;
  time?: string;
  assignees?: string[];
  subtasks?: Array<{
    id: string;
    title: string;
    completed: boolean;
  }>;
  files?: Array<{
    name: string;
    type: string;
  }>;
  createdAt?: Date;
  updatedAt?: Date;
}

export function TaskCard({ 
  id,
  title, 
  description, 
  progress, 
  category, 
  dueDate, 
  time,
  assignees = [],
  subtasks = [],
  files = [],
  createdAt,
  updatedAt
}: TaskCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const setSelectedTask = useTaskStore((state) => state.setSelectedTask);
  const updateTask = useTaskStore((state) => state.updateTask);

  // Calculate circle properties
  const size = 40; // w-10 h-10 = 40px
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const handleShowDetails = () => {
    setSelectedTask({
      id,
      title,
      description,
      progress,
      category,
      dueDate,
      time,
      assignees,
      subtasks,
      files,
      createdAt: createdAt || new Date(),
      updatedAt: updatedAt || new Date(),
    });
    setShowDetails(true);
  };

  const handleCompleteTask = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening details modal
    updateTask(id, { progress: progress === 100 ? 0 : 100 });
  };

  return (
    <>
      <div 
        onClick={handleShowDetails}
        className={`glass-card p-4 hover:shadow-lg transition-all duration-300 cursor-pointer group touch-manipulation ${
          progress === 100 ? 'opacity-60 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        {/* Category Badge and Complete Button */}
        <div className="flex items-center justify-between mb-3">
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-dark-500/50 text-white">
            {category}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCompleteTask}
              className={`p-1.5 rounded-lg transition-all duration-300 ${
                progress === 100 
                  ? 'bg-accent-green/10 text-accent-green hover:bg-accent-green/20' 
                  : 'bg-dark-500/50 text-dark-200 hover:text-white hover:bg-dark-500'
              }`}
              title={progress === 100 ? "Mark as incomplete" : "Mark as complete"}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </button>
            {time && (
              <span className="text-xs text-dark-200">
                {time}
              </span>
            )}
          </div>
        </div>

        {/* Title and Description */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white group-hover:text-primary-400 transition-colors line-clamp-1">
            {title}
          </h3>
          <p className="text-sm text-dark-200 line-clamp-2">
            {description}
          </p>
        </div>

        {/* Progress Circle and Details */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Progress Circle */}
            <div className="relative w-10 h-10">
              <svg className="w-10 h-10 transform -rotate-90">
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke="currentColor"
                  strokeWidth={strokeWidth}
                  fill="none"
                  className="text-dark-500"
                />
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke="currentColor"
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - (circumference * progress) / 100}
                  className={`${
                    progress === 100 ? 'text-accent-green' : 'text-primary-500'
                  } transition-all duration-300`}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-medium text-white">
                {progress}%
              </span>
            </div>

            {/* Due Date */}
            {dueDate && (
              <span className="text-xs text-dark-200">
                Due {new Date(dueDate).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            )}
          </div>

          {/* Assignees */}
          {assignees.length > 0 && (
            <div className="flex -space-x-2">
              {assignees.map((assignee, index) => (
                <div
                  key={index}
                  className="w-6 h-6 rounded-full bg-dark-500/50 border border-dark-600 flex items-center justify-center text-xs text-white font-medium"
                  title={assignee}
                >
                  {assignee.charAt(0).toUpperCase()}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Subtasks indicator */}
        {subtasks.length > 0 && (
          <div className="mt-3 flex items-center gap-2 text-xs text-dark-200">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>{subtasks.filter(st => st.completed).length} / {subtasks.length} subtasks</span>
          </div>
        )}

        {/* Files indicator */}
        {files.length > 0 && (
          <div className="mt-2 flex items-center gap-2 text-xs text-dark-200">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            <span>{files.length} attachment{files.length !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {/* Task Details Modal */}
      {showDetails && (
        <TaskDetails
          onClose={() => {
            setShowDetails(false);
            setSelectedTask(null);
          }}
        />
      )}
    </>
  );
} 
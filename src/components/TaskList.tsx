import React, { useMemo } from 'react';
import { useTaskStore } from '../store/taskStore';
import { TaskCard } from './TaskCard';

interface TaskListProps {
  category?: string;
}

export function TaskList({ category }: TaskListProps) {
  const getTasksByCategory = useTaskStore((state) => state.getTasksByCategory);
  const tasks = useMemo(() => getTasksByCategory(category), [category, getTasksByCategory]);

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 mb-4 text-dark-200">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No tasks found</h3>
        <p className="text-dark-200">
          {category ? `No tasks in the "${category}" category` : "You haven't created any tasks yet"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          {...task}
        />
      ))}
    </div>
  );
} 
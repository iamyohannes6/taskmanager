import React from 'react';
import { useTaskStore } from './store/taskStore';
import { Dashboard } from './components/Dashboard';
import { TaskDetails } from './components/TaskDetails';

export function App() {
  const selectedTask = useTaskStore((state) => state.selectedTask);
  const setSelectedTask = useTaskStore((state) => state.setSelectedTask);

  return (
    <div className="min-h-screen bg-dark-800 text-white p-4 md:p-6">
      <div className="max-w-[1600px] mx-auto">
        <Dashboard />
        {selectedTask && (
          <TaskDetails onClose={() => setSelectedTask(null)} />
        )}
      </div>
    </div>
  );
} 
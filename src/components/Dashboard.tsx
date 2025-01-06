import React, { useState, useMemo } from 'react';
import { useTaskStore } from '../store/taskStore';
import { TaskList } from './TaskList';
import { CreateTaskModal } from './CreateTaskModal';

export function Dashboard() {
  const tasks = useTaskStore((state) => state.tasks);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  
  const categories = useMemo(() => Array.from(new Set(tasks.map(task => task.category))), [tasks]);
  
  const taskStats = useMemo(() => ({
    totalTasks: tasks.length,
    completedTasks: tasks.filter(task => task.progress === 100).length,
    inProgressTasks: tasks.filter(task => task.progress > 0 && task.progress < 100).length,
  }), [tasks]);

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      setShowCreateModal(true);
      setShowAddCategory(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 p-6 max-w-7xl mx-auto w-full">
      {/* Header with Create Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Today's Tasks
          </h1>
          <p className="text-dark-200 text-lg">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center gap-2 text-lg px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Task
        </button>
      </div>

      {/* Statistics */}
      <div className="flex flex-wrap gap-4">
        <div className="glass-card p-4 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-500/10 rounded-lg">
              <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h3 className="text-xs font-medium text-dark-200">
                Total Tasks
              </h3>
              <p className="text-xl font-bold text-white">
                {taskStats.totalTasks}
              </p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent-green/10 rounded-lg">
              <svg className="w-5 h-5 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-xs font-medium text-dark-200">
                Completed
              </h3>
              <p className="text-xl font-bold text-accent-green">
                {taskStats.completedTasks}
              </p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent-blue/10 rounded-lg">
              <svg className="w-5 h-5 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xs font-medium text-dark-200">
                In Progress
              </h3>
              <p className="text-xl font-bold text-accent-blue">
                {taskStats.inProgressTasks}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Categories</h2>
          {categories.length > 0 && !showAddCategory && (
            <button
              onClick={() => setShowAddCategory(true)}
              className="btn-secondary flex items-center gap-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Category
            </button>
          )}
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hidden">
          <button
            onClick={() => setSelectedCategory(undefined)}
            className={`btn ${!selectedCategory 
              ? 'btn-primary shadow-lg' 
              : 'btn-secondary hover:shadow-md'
            } transition-all duration-300 whitespace-nowrap`}
          >
            All Tasks
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`btn ${selectedCategory === category
                ? 'btn-primary shadow-lg'
                : 'btn-secondary hover:shadow-md'
              } transition-all duration-300 whitespace-nowrap`}
            >
              {category}
            </button>
          ))}
          {categories.length === 0 && (
            <button
              onClick={() => setShowAddCategory(true)}
              className="btn btn-secondary flex items-center gap-2 hover:shadow-md transition-all duration-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Category
            </button>
          )}
        </div>
      </div>

      {/* Add Category Input */}
      {showAddCategory && (
        <div className="glass-card p-4 animate-fadeIn">
          <div className="flex gap-3">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter category name"
              className="input flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
            />
            <button
              onClick={handleAddCategory}
              className="btn-primary px-6"
            >
              Add
            </button>
            <button
              onClick={() => {
                setShowAddCategory(false);
                setNewCategory('');
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Task List */}
      <div className="mt-2">
        <TaskList category={selectedCategory} />
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <CreateTaskModal
          onClose={() => setShowCreateModal(false)}
          categories={categories}
          initialCategory={newCategory}
        />
      )}
    </div>
  );
} 
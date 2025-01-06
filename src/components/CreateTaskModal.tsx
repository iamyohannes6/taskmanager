import React, { useState } from 'react';
import { useTaskStore, Task } from '../store/taskStore';

interface CreateTaskModalProps {
  onClose: () => void;
  categories: string[];
  initialCategory?: string;
}

export function CreateTaskModal({ onClose, categories, initialCategory }: CreateTaskModalProps) {
  const addTask = useTaskStore((state) => state.addTask);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: initialCategory || categories[0] || 'General',
    dueDate: '',
    time: '',
    assignees: [] as string[],
  });
  const [newAssignee, setNewAssignee] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showNewCategory, setShowNewCategory] = useState(categories.length === 0);
  const [newCategory, setNewCategory] = useState(initialCategory || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    const finalCategory = showNewCategory ? newCategory.trim() : formData.category;
    if (!finalCategory) {
      setError('Category is required');
      return;
    }

    const taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
      ...formData,
      category: finalCategory,
      progress: 0,
      subtasks: [],
      files: [],
    };

    addTask(taskData);
    onClose();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleAddAssignee = () => {
    if (!newAssignee.trim()) return;
    if (formData.assignees.includes(newAssignee.trim())) {
      setError('Assignee already added');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      assignees: [...prev.assignees, newAssignee.trim()],
    }));
    setNewAssignee('');
  };

  const handleRemoveAssignee = (assignee: string) => {
    setFormData((prev) => ({
      ...prev,
      assignees: prev.assignees.filter((a) => a !== assignee),
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-card w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-dark-500">
          <h2 className="text-xl font-bold text-white">Create New Task</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-dark-500 rounded-xl transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-dark-200 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="input w-full"
              placeholder="Enter task title"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-dark-200 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="input w-full"
              placeholder="Enter task description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-200 mb-1">
              Category
            </label>
            {categories.length > 0 && !showNewCategory ? (
              <div className="flex gap-2">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="input flex-1"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowNewCategory(true)}
                  className="btn-secondary"
                >
                  New
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="input flex-1"
                  placeholder="Enter new category"
                />
                {categories.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowNewCategory(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-dark-200 mb-1">
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                className="input w-full"
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-dark-200 mb-1">
                Time
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className="input w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-200 mb-1">
              Assignees
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newAssignee}
                onChange={(e) => setNewAssignee(e.target.value)}
                className="input flex-1"
                placeholder="Add assignee"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAssignee())}
              />
              <button
                type="button"
                onClick={handleAddAssignee}
                className="btn-primary"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.assignees.map((assignee) => (
                <span
                  key={assignee}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-dark-500 text-white rounded-lg"
                >
                  {assignee}
                  <button
                    type="button"
                    onClick={() => handleRemoveAssignee(assignee)}
                    className="p-1 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
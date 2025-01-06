import React, { useState } from 'react';
import { useTaskStore, Task } from '../store/taskStore';

interface TaskDetailsProps {
  onClose: () => void;
}

export function TaskDetails({ onClose }: TaskDetailsProps) {
  const selectedTask = useTaskStore((state) => state.selectedTask);
  const updateTask = useTaskStore((state) => state.updateTask);
  const addSubtask = useTaskStore((state) => state.addSubtask);
  const updateSubtask = useTaskStore((state) => state.updateSubtask);
  const deleteSubtask = useTaskStore((state) => state.deleteSubtask);
  const addFile = useTaskStore((state) => state.addFile);
  const deleteFile = useTaskStore((state) => state.deleteFile);

  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Task | null>(selectedTask);
  const [newSubtask, setNewSubtask] = useState('');
  const [newAssignee, setNewAssignee] = useState('');

  if (!selectedTask || !editedTask) return null;

  const handleSave = () => {
    if (!editedTask) return;
    updateTask(selectedTask.id, editedTask);
    setIsEditing(false);
  };

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return;
    addSubtask(selectedTask.id, { title: newSubtask });
    setNewSubtask('');
  };

  const handleToggleSubtask = (subtaskId: string, completed: boolean) => {
    updateSubtask(selectedTask.id, subtaskId, { completed });
  };

  const handleDeleteSubtask = (subtaskId: string) => {
    if (window.confirm('Are you sure you want to delete this subtask?')) {
      deleteSubtask(selectedTask.id, subtaskId);
    }
  };

  const handleAddAssignee = () => {
    if (!newAssignee.trim()) return;
    if (editedTask.assignees?.includes(newAssignee.trim())) return;
    setEditedTask({
      ...editedTask,
      assignees: [...(editedTask.assignees || []), newAssignee.trim()],
    });
    setNewAssignee('');
  };

  const handleRemoveAssignee = (assignee: string) => {
    setEditedTask({
      ...editedTask,
      assignees: editedTask.assignees?.filter((a) => a !== assignee),
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // In a real app, you would upload the file to a server here
    // For now, we'll just add it to the task
    addFile(selectedTask.id, {
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-dark-600/50 backdrop-blur-lg rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-task">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-dark-500 rounded-xl transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h2 className="text-xl font-bold text-white">Task Details</h2>
              <p className="text-sm text-dark-200">
                Created {new Date(selectedTask.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="btn-primary"
          >
            {isEditing ? 'Save Changes' : 'Edit Task'}
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Title and Description */}
          <div className="space-y-4">
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={editedTask.title}
                  onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                  className="w-full bg-dark-700/50 rounded-xl px-4 py-2 text-white placeholder:text-dark-300 outline-none focus:ring-2 focus:ring-primary-500"
                />
                <textarea
                  value={editedTask.description}
                  onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                  rows={3}
                  className="w-full bg-dark-700/50 rounded-xl px-4 py-2 text-white placeholder:text-dark-300 outline-none focus:ring-2 focus:ring-primary-500"
                />
              </>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-white">{selectedTask.title}</h3>
                <p className="text-dark-200">{selectedTask.description}</p>
              </>
            )}
          </div>

          {/* Progress */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-dark-200">Progress</span>
              {isEditing ? (
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editedTask.progress}
                  onChange={(e) => setEditedTask({ ...editedTask, progress: Number(e.target.value) })}
                  className="w-16 bg-dark-700/50 rounded-lg px-2 py-1 text-white text-right"
                />
              ) : (
                <span className="text-white">{selectedTask.progress}%</span>
              )}
            </div>
            <div className="h-2 bg-dark-500 rounded-full">
              <div
                className="h-2 bg-primary-500 rounded-full transition-all duration-300"
                style={{ width: `${selectedTask.progress}%` }}
              />
            </div>
          </div>

          {/* Dates */}
          {isEditing ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={editedTask.dueDate}
                  onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
                  className="w-full bg-dark-700/50 rounded-xl px-4 py-2 text-white outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  value={editedTask.time}
                  onChange={(e) => setEditedTask({ ...editedTask, time: e.target.value })}
                  className="w-full bg-dark-700/50 rounded-xl px-4 py-2 text-white outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          ) : (
            selectedTask.dueDate && (
              <div className="flex items-center gap-2 text-dark-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>
                  {new Date(selectedTask.dueDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                  {selectedTask.time && ` at ${selectedTask.time}`}
                </span>
              </div>
            )
          )}

          {/* Subtasks */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">Subtasks</h4>
            <div className="space-y-2 mb-3">
              {selectedTask.subtasks?.map((subtask) => (
                <div
                  key={subtask.id}
                  className="flex items-center gap-3 bg-dark-500/50 rounded-xl p-3"
                >
                  <input
                    type="checkbox"
                    checked={subtask.completed}
                    onChange={(e) => handleToggleSubtask(subtask.id, e.target.checked)}
                    className="w-5 h-5 rounded-lg border-2 border-dark-400 bg-dark-700/50 checked:bg-primary-500 checked:border-primary-500"
                  />
                  <span className={`flex-1 ${subtask.completed ? 'line-through text-dark-200' : 'text-white'}`}>
                    {subtask.title}
                  </span>
                  <button
                    onClick={() => handleDeleteSubtask(subtask.id)}
                    className="p-1 text-dark-200 hover:text-red-500 hover:bg-dark-500 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                placeholder="Add a subtask..."
                className="flex-1 bg-dark-700/50 rounded-xl px-4 py-2 text-white placeholder:text-dark-300 outline-none focus:ring-2 focus:ring-primary-500"
                onKeyPress={(e) => e.key === 'Enter' && handleAddSubtask()}
              />
              <button
                onClick={handleAddSubtask}
                className="px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Files */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">Files</h4>
            <div className="grid grid-cols-2 gap-3 mb-3">
              {selectedTask.files?.map((file) => (
                <div
                  key={file.name}
                  className="flex items-center gap-3 bg-dark-500/50 rounded-xl p-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-dark-400 flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{file.name}</p>
                    <p className="text-xs text-dark-200">{file.type}</p>
                  </div>
                  <button
                    onClick={() => deleteFile(selectedTask.id, file.name)}
                    className="p-1 text-dark-200 hover:text-red-500 hover:bg-dark-500 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <div>
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center gap-2 px-4 py-2 bg-dark-500/50 text-white rounded-xl hover:bg-dark-400/50 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add File
              </label>
            </div>
          </div>

          {/* Assignees */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">Assignees</h4>
            {isEditing ? (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value)}
                    placeholder="Add assignee..."
                    className="flex-1 bg-dark-700/50 rounded-xl px-4 py-2 text-white placeholder:text-dark-300 outline-none focus:ring-2 focus:ring-primary-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddAssignee()}
                  />
                  <button
                    onClick={handleAddAssignee}
                    className="px-4 py-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {editedTask.assignees?.map((assignee) => (
                    <span
                      key={assignee}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-dark-500 text-white rounded-lg"
                    >
                      {assignee}
                      <button
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
            ) : (
              <div className="flex flex-wrap gap-2">
                {selectedTask.assignees?.map((assignee) => (
                  <span
                    key={assignee}
                    className="px-3 py-1 bg-dark-500 text-white rounded-lg"
                  >
                    {assignee}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
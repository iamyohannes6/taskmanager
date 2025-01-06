import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Task {
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
    url?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

interface TaskStore {
  tasks: Task[];
  selectedTask: Task | null;
  // CRUD operations
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  setSelectedTask: (task: Task | null) => void;
  // Subtask operations
  addSubtask: (taskId: string, subtask: { title: string }) => void;
  updateSubtask: (taskId: string, subtaskId: string, updates: { title?: string; completed?: boolean }) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;
  // File operations
  addFile: (taskId: string, file: { name: string; type: string; url?: string }) => void;
  deleteFile: (taskId: string, fileName: string) => void;
  // Filtering
  getTasksByCategory: (category?: string) => Task[];
  getTasksByDate: (date: Date) => Task[];
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      selectedTask: null,

      addTask: (taskData) => set((state) => {
        const newTask: Task = {
          ...taskData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        return { tasks: [newTask, ...state.tasks] };
      }),

      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id
            ? { ...task, ...updates, updatedAt: new Date() }
            : task
        ),
      })),

      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
        selectedTask: state.selectedTask?.id === id ? null : state.selectedTask,
      })),

      setSelectedTask: (task) => set({ selectedTask: task }),

      addSubtask: (taskId, subtask) => set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                subtasks: [
                  ...(task.subtasks || []),
                  {
                    id: crypto.randomUUID(),
                    title: subtask.title,
                    completed: false,
                  },
                ],
                updatedAt: new Date(),
              }
            : task
        ),
      })),

      updateSubtask: (taskId, subtaskId, updates) => set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                subtasks: task.subtasks?.map((subtask) =>
                  subtask.id === subtaskId
                    ? { ...subtask, ...updates }
                    : subtask
                ),
                updatedAt: new Date(),
              }
            : task
        ),
      })),

      deleteSubtask: (taskId, subtaskId) => set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                subtasks: task.subtasks?.filter(
                  (subtask) => subtask.id !== subtaskId
                ),
                updatedAt: new Date(),
              }
            : task
        ),
      })),

      addFile: (taskId, file) => set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                files: [...(task.files || []), file],
                updatedAt: new Date(),
              }
            : task
        ),
      })),

      deleteFile: (taskId, fileName) => set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                files: task.files?.filter((file) => file.name !== fileName),
                updatedAt: new Date(),
              }
            : task
        ),
      })),

      getTasksByCategory: (category) => {
        const tasks = get().tasks;
        return category
          ? tasks.filter((task) => task.category === category)
          : tasks;
      },

      getTasksByDate: (date) => {
        const tasks = get().tasks;
        return tasks.filter((task) => {
          if (!task.dueDate) return false;
          const taskDate = new Date(task.dueDate);
          return (
            taskDate.getFullYear() === date.getFullYear() &&
            taskDate.getMonth() === date.getMonth() &&
            taskDate.getDate() === date.getDate()
          );
        });
      },
    }),
    {
      name: 'task-storage',
      partialize: (state) => ({ tasks: state.tasks }),
    }
  )
); 
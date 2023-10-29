import { create } from "zustand";

export type Task = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate?: string | null;
  createdAt: string;
  category: string;
};

type TaskStore = {
  tasks: Task[];
  loadTasks: () => void;
  addTask: (newTask: Task) => void;
  editTask: (taskId: string, updatedTask: Task) => void;
  deleteTask: (taskId: string) => void;
};

const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  loadTasks: () => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    set({ tasks: storedTasks });
  },
  addTask: (newTask) => {
    set((state) => ({ tasks: [...state.tasks, newTask] }));
  },
  editTask: (taskId: string, updatedTask: Task) => {
    set((state) => {
      const updatedTasks = state.tasks.map((task) => {
        if (task.id === taskId) {
          // Merge the updated properties with the existing task
          return { ...task, ...updatedTask };
        }
        return task;
      });
      return { tasks: updatedTasks };
    });
  },
  deleteTask: (taskId: string) => {
    set((state) => {
      const updatedTasks = state.tasks.filter((task) => task.id !== taskId);
      return { tasks: updatedTasks };
    });
  },
}));

export default useTaskStore;

"use client";
import { useEffect, useState } from "react";
import useTaskStore, { Task } from "@/store/taskStore";
import TaskItem from "./TaskItem";

const TasksList = () => {
  const { tasks, loadTasks } = useTaskStore();
  const [loading, setLoading] = useState(true);

  // Use useEffect to load tasks from localStorage when the component mounts
  useEffect(() => {
    loadTasks();
    setLoading(false);
  }, [loadTasks]);

  // Filter out tasks with missing or incomplete data
  const filteredTasks = tasks.filter(
    (task: Task) => task.title && task.description && task.category
  );

  // Sort tasks by custom logic: uncompleted tasks first, then completed tasks
  const sortedTasks = filteredTasks.sort((taskA: Task, taskB: Task) => {
    // Custom sorting function
    if (taskA.completed && !taskB.completed) {
      return 1; // Move completed tasks to the end
    }
    if (!taskA.completed && taskB.completed) {
      return -1; // Place uncompleted tasks before completed
    }

    // If both tasks are of the same completion status, sort by creation date
    const dateA = new Date(taskA.createdAt).getTime();
    const dateB = new Date(taskB.createdAt).getTime();

    // Compare the dates in descending order (newest to oldest)
    return dateB - dateA;
  });

  return (
    <div className="mt-4 w-full flex flex-col gap-2">
      {loading ? (
        "Loading"
      ) : (
        <>
          {sortedTasks.map((task: Task) => (
            <TaskItem task={task} key={task.id} />
          ))}
        </>
      )}
    </div>
  );
};

export default TasksList;

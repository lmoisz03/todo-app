"use client";
import useTaskStore, { Task } from "@/store/taskStore";
import { Checkbox } from "../ui/checkbox";
import Link from "next/link";
import {
  IconActivity,
  IconShoppingCart,
  IconBriefcase,
  IconHeart,
  IconDots,
  IconDotsVertical,
  IconPencil,
  IconTrash,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import { format } from "date-fns";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useState } from "react";
import EditTask from "./EditTask";
import { Dialog } from "../ui/dialog";

export const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Groceries":
      return <IconShoppingCart className="w-5 h-5" />;
    case "Work":
      return <IconBriefcase className="w-5 h-5" />;
    case "Health":
      return <IconHeart className="w-5 h-5" />;
    case "Finance":
      return <IconActivity className="w-5 h-5" />;
    case "Leisure":
      return <IconActivity className="w-5 h-5" />;
    default:
      return null; // You can return a default icon or nothing for unknown categories
  }
};
const TaskItem = ({ task }: { task: Task }) => {
  const { editTask, deleteTask } = useTaskStore();

  const handleCompletionChange = () => {
    // Toggle the "completed" status of the task
    const updatedTask = { ...task, completed: !task.completed };
    editTask(task.id, updatedTask);

    // Update the local storage with the modified task list
    const updatedTasks = useTaskStore.getState().tasks;
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  const options = [
    {
      label: "Mark as completed",
      icon: IconCheck,
      disabled: task.completed,
      onClick: () => {
        const updatedTask = { ...task, completed: true };
        editTask(task.id, updatedTask);

        // Update the local storage with the modified task list
        const updatedTasks = useTaskStore.getState().tasks;
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      },
    },
    {
      label: "Mark as incomplete",
      icon: IconX,
      disabled: !task.completed,
      onClick: () => {
        const updatedTask = { ...task, completed: false };
        editTask(task.id, updatedTask);

        // Update the local storage with the modified task list
        const updatedTasks = useTaskStore.getState().tasks;
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
        //         toast.success("Task marked as incomplete");
      },
    },
  ];
  return (
    <div
      key={task.id}
      className={`flex gap-2 flex-row rounded px-2 py-4 items-center ${
        !task.completed
          ? "bg-gray-50 dark:bg-gray-900"
          : "bg-gray-100 dark:bg-gray-700"
      }`}
    >
      <div className="flex px-2 w-[2rem] self-start py-1">
        <Checkbox
          className={"border-gray-700"}
          checked={task.completed}
          onCheckedChange={handleCompletionChange}
        />
      </div>
      <div className="flex flex-col w-full gap-1">
        <span
          className={`dark:text-gray-300 text-base ${
            task.completed ? "line-through" : ""
          }`}
        >
          {task.title}
        </span>
        <span className="dark:text-gray-300 text-sm">{task.description}</span>
        {/* Category */}
        <div className="flex flex-row gap-2 items-center">
          <Link
            href={`/tasks/${task.id}`}
            className={`text-sm flex flex-row gap-2 items-center dark:text-gray-300 rounded border  w-fit py-1 px-2 ${
              !task.completed
                ? "bg-gray-200 dark:bg-gray-800 dark:border-gray-800"
                : "dark:bg-gray-600 dark:border-gray-700"
            }`}
          >
            {getCategoryIcon(task.category)}
            <span>{task.category}</span>
          </Link>
          {task.dueDate && (
            <div className="dark:text-red-400 text-sm">
              Due: {format(new Date(task.dueDate), "MMM d, y")}
            </div>
          )}
        </div>
      </div>
      <div className="flex px-2 self-start w-[2rem] py-1 mr-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="px-2 py-1"
              onClick={() => editTask(task.id, task)}
            >
              <IconDotsVertical className="h-5 w-5 dark:text-gray-300" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-[160px]">
            <DropdownMenuLabel>Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <EditTask task={task} />
            {options.map((option) => (
              <DropdownMenuItem
                key={option.label}
                onClick={option.onClick}
                disabled={option.disabled}
              >
                {option.icon && (
                  <option.icon className="dark:text-gray-300 mr-2 h-4 w-4" />
                )}
                <span className="dark:text-gray-300"> {option.label}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-200 dark:text-red-500"
              onClick={() => {
                // Delete the task from the store
                // Update the local storage with the modified task list
                deleteTask(task.id);
                const updatedTasks = useTaskStore.getState().tasks;
                localStorage.setItem("tasks", JSON.stringify(updatedTasks));
              }}
            >
              <IconTrash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TaskItem;

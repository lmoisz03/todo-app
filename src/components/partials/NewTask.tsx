"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  IconBook,
  IconFriends,
  IconPlus,
  IconPuzzle,
  IconWorldQuestion,
} from "@tabler/icons-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";

import { useToast } from "../ui/use-toast";
import useTaskStore from "@/store/taskStore";

import {
  Select,
  SelectLabel,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "../ui/select";
import {
  IconSchool,
  IconHeart,
  IconActivity,
  IconBriefcase,
} from "@tabler/icons-react";
import DueDateInput from "./TaskDueDateInput";

// Define categories with their labels and icons
export const categories = {
  Work: { label: "Work", icon: IconBriefcase },
  School: { label: "School", icon: IconSchool },
  Health: { label: "Health", icon: IconHeart },
  Family: { label: "Family", icon: IconFriends },
  Finance: { label: "Finance", icon: IconActivity },
  Leisure: { label: "Leisure", icon: IconBook },
  Personal: { label: "Personal", icon: IconPuzzle },
  Other: { label: "Other", icon: IconWorldQuestion },
};

const NewTask = () => {
  const { toast } = useToast();
  const { addTask } = useTaskStore();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    category: "",
  });

  const [error, setError] = useState(""); // Error state for validation

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateFormData = () => {
    if (!formData.title.trim()) {
      setError("Title is required");
      return false;
    }
    if (!formData.category.trim()) {
      setError("Category is required");
      return false;
    }
    setError(""); // Clear any previous error
    return true;
  };

  const handleDateChange = (date: string) => {
    setFormData({ ...formData, dueDate: date });
    console.log(date);
  };

  const handleSaveTask = () => {
    if (validateFormData()) {
      const newTask = {
        id: crypto.randomUUID(),
        title: formData.title,
        description: formData.description,
        completed: false,
        dueDate: formData.dueDate || "", // Set dueDate to an empty string if no date is selected
        createdAt: new Date().toISOString(),
        category: formData.category,
      };
      // Implement the logic to save the task with the formData
      addTask(newTask as any);

      const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
      tasks.push(newTask);
      localStorage.setItem("tasks", JSON.stringify(tasks));

      setOpen(!open);
      toast({
        title: "Task saved successfully",
        description: "Task has been saved successfully.",
        duration: 3000,
      });
      setFormData({
        title: "",
        description: "",
        dueDate: "", // Clear the dueDate as well
        category: "",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"default"} className="flex flex-row gap-2">
          <IconPlus className="h-5 w-5" />
          <span>Add Task</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add new task</DialogTitle>
          <DialogDescription>
            Fill the form below to create a new task. You can also add
            attachments.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              placeholder="Enter task title"
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              name="description"
              placeholder="Enter task description"
              value={formData.description}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dueDate" className="text-right">
              Due Date
            </Label>

            <DueDateInput
              value={formData.dueDate}
              onChange={handleDateChange}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>

            <Select
              value={formData.category}
              onValueChange={(e) => {
                setFormData({ ...formData, category: e });
              }}
            >
              <SelectTrigger className="min-w-[280px]">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Categories</SelectLabel>
                  {Object.entries(categories).map(([value, category]) => (
                    <SelectItem key={value} value={value}>
                      <div className="flex flex-row gap-2">
                        <category.icon className="h-5 w-5 dark:text-gray-300" />
                        <span className="text-sm">{category.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <p className="text-red-500">{error}</p>
        <DialogFooter>
          <Button type="submit" onClick={handleSaveTask}>
            Save Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewTask;

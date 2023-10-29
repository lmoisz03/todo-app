import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { useState } from "react";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { IconPencil } from "@tabler/icons-react";
import useTaskStore, { Task } from "@/store/taskStore";
import { useToast } from "../ui/use-toast";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import DueDateInput from "./TaskDueDateInput";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { categories } from "./NewTask";
import { Button } from "../ui/button";
import { DialogTitle } from "@radix-ui/react-dialog";

const EditTask = ({ task }: { task: Task }) => {
  const { toast } = useToast();
  const { editTask } = useTaskStore();
  const [open, setOpen] = useState(false);

  // Initialize the form data with the task's properties
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description,
    dueDate: task.dueDate || "", // Set dueDate to an empty string if it's null
    category: task.category,
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
  };

  const handleSaveTask = () => {
    if (validateFormData()) {
      // Create an updated task based on the form data
      const updatedTask: Task = {
        ...task,
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate || null, // Set dueDate to null if it's an empty string
        category: formData.category,
      };

      // Call the editTask function to update the task
      editTask(task.id, updatedTask);
      //   Find the task in localstorage and edit
      const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
      const index = tasks.findIndex((t: Task) => t.id === task.id);
      tasks[index] = updatedTask;
      localStorage.setItem("tasks", JSON.stringify(tasks));

      setFormData({
        title: "",
        description: "",
        dueDate: "", // Clear the dueDate as well
        category: "",
      });

      setOpen(!open);
      toast({
        title: "Task updated successfully",
        description: "Task has been updated successfully.",
        duration: 3000,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e: { preventDefault: () => any }) => e.preventDefault()}
        >
          <IconPencil className="dark:text-gray-300 mr-2 h-4 w-4" />
          <span className="dark:text-gray-300">Edit Task</span>
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Edit the task details and save the changes.
            <span className="text-red-500 flex font-bold py-2">
              Note: Due date cannot be updated.
            </span>
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
              disabled={true}
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

export default EditTask;

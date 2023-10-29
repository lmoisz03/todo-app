import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Metadata } from "next";
import Link from "next/link";
import TasksList from "@/components/partials/Tasks";
import { IconPlus } from "@tabler/icons-react";
import NewTask from "@/components/partials/NewTask";

export const metadata: Metadata = {
  title: "To-do app",
};

export default function Home() {
  return (
    <main className="flex mx-auto">
      <div className=" flex px-2 py-6 flex-col mx-auto justify-center items-center sm:max-w-[30rem] w-full">
        <div className="flex flex-row gap-2 items-center justify w-full justify-between">
          <h2 className="dark:text-gray-300">
            <span className="text-xl font-bold">To-do</span> List App.
          </h2>
          <NewTask />
        </div>
        <TasksList />
      </div>
    </main>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import DashboardHeader from "./dash-header";
import FileUpload from "./file-upload";

const assignments = [
  {
    id: 123,
    name: "Test Assignment",
    description: "Test Description",
    due_date: "2025-02-07",
    color: "#7986cb",
    start_time: "12:00:00", // 24 hour format
    end_time: "13:00:00", // 24 hour format
    reminder: 10,
  },
];

interface DashboardCompProps {
  user: User;
  signOut: () => void;
}

export default function DashboardComp({ user, signOut }: DashboardCompProps) {
  const router = useRouter();

  const handleClick = async () => {
    try {
      const response = await fetch("/add-to-calendar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ assignments: assignments }),
      });

      const contentType = response.headers.get("Content-Type");

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        console.log(data);
      } else {
        // Handling non-JSON redirect becuase of undefiend provider token
        router.push("/sign-in?reauth=true");
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <div>
      <DashboardHeader user={user} signOut={signOut} />
      <div className="mt-20 flex justify-center">
        <FileUpload />
      </div>
    </div>
  );
}
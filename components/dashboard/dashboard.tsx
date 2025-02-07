"use client";

import { PulsatingButton } from "../ui/pulsating-button";

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

export default function DashboardComp() {
  const handleClick = async () => {
    try {
      const response = await fetch("/add-to-calendar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ assignments: assignments }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      console.log(data);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
    <div>
      <PulsatingButton onClick={handleClick}>
        Test Calendar Endpoint
      </PulsatingButton>
    </div>
  );
}
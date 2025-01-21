"use client"; // Ensure that this file is treated as a client-side component

import { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function AdminPage() {
  const [selectedDates, setSelectedDates] = useState([]);

  const handleDayClick = (value, event) => {
    const dateString = value.toISOString().split("T")[0]; // Simplify the date string to YYYY-MM-DD
    setSelectedDates((prevDates) => {
      // Check if the date is already selected
      const exists = prevDates.find((date) => date === dateString);
      if (exists) {
        // Remove the date if it's already selected
        return prevDates.filter((date) => date !== dateString);
      } else {
        // Add the new date to the selection
        return [...prevDates, dateString];
      }
    });
  };

  const saveDates = async () => {
    try {
      console.log("Sending dates:", selectedDates);

      // Optional: Convert dates to a preferred format or ensure they are serializable
      const formattedDates = selectedDates.map((date) =>
        new Date(date).toISOString()
      );

      // Explicitly stringify if you need more control over serialization
      const dataToSend = JSON.stringify({
        dates: formattedDates,
      });

      const response = await axios.post("/api/saveDates", dataToSend, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Success:", response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to save dates:", error);
      alert("Failed to save dates");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div>
        <h1>Admin Page</h1>
        <Calendar
          onChange={handleDayClick}
          value={selectedDates.map((date) => new Date(date))}
          tileClassName={({ date, view }) => {
            // Highlight the selected dates
            if (
              selectedDates.find((d) => d === date.toISOString().split("T")[0])
            ) {
              return "highlight";
            }
          }}
        />
        <button
          onClick={saveDates}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save Dates
        </button>
      </div>
    </div>
  );
}

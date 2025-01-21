"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function ClientPage() {
  const [dates, setDates] = useState([]);
  const [completedDates, setCompletedDates] = useState(new Set());
  const [selectedDate, setSelectedDate] = useState();
  const [shiftedDates, setShiftedDates] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get("/api/getDates");
        const parsedDates = result.data.dates.map((date) => {
          return {
            date: new Date(date.date),
            completed: date.completed,
          };
        });
        setDates(parsedDates);
      } catch (error) {
        console.error("Failed to fetch dates:", error);
      }
    };
    fetchData();
  }, []);

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const shiftDates = (oldDate, gapThreshold = 1) => {
    const prevDate = oldDate.sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    let updatedDates = [];
    for (let i = 0; i < prevDate.length; i++) {
      let currentDate = new Date(prevDate[i].date);
      let previousDate = i > 0 ? new Date(prevDate[i - 1].date) : null;
      let needGap = false;
      if (previousDate) {
        let dayDifference = (currentDate - previousDate) / (1000 * 3600 * 24);
        needGap = dayDifference > gapThreshold;
      }
      updatedDates.push({
        ...prevDate[i],
        needGap: needGap,
      });
    }
    const newDates = updatedDates.sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    const firstIncompleteIndex = newDates.findIndex((d) => !d.completed);
    if (firstIncompleteIndex === -1) {
      return;
    }
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);
    newDates[firstIncompleteIndex].date = currentDate.toISOString();
    for (let i = firstIncompleteIndex + 1; i < newDates.length; i++) {
      let previousDate = new Date(newDates[i - 1].date);
      let nextDate = new Date(newDates[i].date);
      let daysToAdd = newDates[i].needGap ? 2 : 1;
      if (nextDate <= previousDate) {
        let updatedDate = new Date(previousDate);
        updatedDate.setDate(updatedDate.getDate() + daysToAdd);
        newDates[i].date = updatedDate.toISOString().split("T")[0];
      }
    }
    const saveDates = async () => {
      try {
        const formattedDates = newDates.map((newDate) => {
          return new Date(newDate.date).toISOString();
        });
        const dataToSend = JSON.stringify({
          dates: formattedDates,
        });
        const response = await axios.post("/api/saveDates", dataToSend, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        window.location.reload();
      } catch (error) {
        console.error("Failed to save dates:", error);
        alert("Failed to save dates");
      }
    };
    saveDates();
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const dateStr = formatDate(date);
    setCompletedDates((prev) => {
      const newCompleted = new Set(prev);
      if (newCompleted.has(dateStr)) {
        newCompleted.delete(dateStr);
      } else {
        newCompleted.add(dateStr);
      }
      return newCompleted;
    });
  };

  const handleComplete = async () => {
    const data = { date: selectedDate, completed: true };
    try {
      const response = await fetch("/api/markComplete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok) {
        window.location.reload();
      } else {
        console.error("Failed:", result.error || "Unknown Error");
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div>
        <h1>Client Page</h1>
        <Calendar
          onClickDay={handleDateClick}
          tileClassName={({ date, view }) => {
            const dateStr = formatDate(date);
            const event = dates.find((d) => formatDate(d.date) === dateStr);
            if (event) {
              return event.completed ? "completed" : "highlight";
            }
            return null;
          }}
        />
        <div
          onClick={handleComplete}
          className="bg-green-200 hover:bg-green-400 mt-10 text-center text-black py-4 px-10 rounded-sm m-auto cursor-pointer"
        >
          Mark as Complete
        </div>
        <div
          onClick={() => shiftDates(dates)}
          className="bg-blue-200 hover:bg-blue-400 mt-10 text-center text-black py-4 px-10 rounded-sm m-auto cursor-pointer"
        >
          Rearrange Dates
        </div>
      
      </div>
    </div>
  );
}

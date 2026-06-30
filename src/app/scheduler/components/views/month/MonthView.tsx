// src/app/scheduler/components/MonthView.tsx
"use client";

import { useScheduler } from "../../../provider";
import { Task } from "../../../types/task";
import { formatKey, getMonthMatrix } from "../../../utils/month";

function parseHour(timeStr: string): number {
  if (!timeStr) return 0;
  const [hour] = timeStr.split(":").map(Number);
  return isNaN(hour) ? 0 : Math.max(0, Math.min(23, hour));
}

function taskDateKey(date: string | Date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

interface MonthViewProps {
  date: Date;
  tasks: Task[];
}

export default function MonthView({ date, tasks }: MonthViewProps) {
  // FIXED: Destructured date and view setters from your scheduler hook context provider
  const { openDetails, changeDate, changeView } = useScheduler();
  const matrix = getMonthMatrix(date);

  // FIXED: Cell click action logic that switches the calendar state to Day View on the selected date
  const handleDayClick = (selectedDay: Date) => {
    if (changeDate) changeDate(selectedDay);
    if (changeView) changeView("day");
    // Note: If your context methods are named differently (e.g. setSelectedDate, setView),
    // update the helper names above to match your specific useScheduler provider API.
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-100 overflow-hidden select-none">
      
      {/* 1. Header Grid for Days of the Week */}
      <div className="grid grid-cols-7 border-b border-slate-200 bg-white shrink-0">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayName) => (
          <div key={dayName} className="text-center py-1.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <span className="sm:hidden">{dayName[0]}</span>
            <span className="hidden sm:inline">{dayName}</span>
          </div>
        ))}
      </div>

      {/* 2. Fixed-Height Grid Canvas */}
      <div className="grid grid-cols-7 flex-1 bg-slate-200 gap-[1px] h-full overflow-hidden">
        {matrix.flat().map((day) => {
          const key = formatKey(day);
          const dayTasks = tasks.filter((task) => taskDateKey(task.date) === key);
          const isCurrentMonth = day.getMonth() === date.getMonth();
          const hasTasks = dayTasks.length > 0;

          return (
            /* 
              FIXED: Turned the flat grid item block into an active, focusable button node.
              Clicking anywhere on this box changes your core application state to target this day.
            */
            <button 
              key={key}
              type="button"
              onClick={() => handleDayClick(day)}
              className={`flex flex-col text-left p-1 h-full min-h-0 overflow-hidden transition-all duration-200 relative group outline-hidden ${
                isCurrentMonth 
                  ? "bg-white text-slate-800 hover:bg-slate-50/80" 
                  : "bg-slate-50 text-slate-300 hover:bg-slate-100/50"
              }`}
            >
              {/* Day Number Header */}
              <div className="flex justify-between items-center w-full mb-1 shrink-0">
                <span className={`text-[10px] sm:text-xs font-bold transition-transform group-hover:scale-110 ${
                  isCurrentMonth ? "text-slate-700" : "text-slate-300"
                }`}>
                  {day.getDate()}
                </span>
                
                {hasTasks && (
                  <span className="text-[8px] font-black bg-slate-100 text-slate-500 px-1 rounded-full scale-90 sm:scale-100 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600">
                    {dayTasks.length}
                  </span>
                )}
              </div>

              {/* Minified Timeline Tracking Strip Inside Box Container */}
              <div className="flex-1 w-full relative min-h-0 rounded-xs bg-slate-50/50 group-hover:bg-slate-100/40 border border-slate-100/40 transition-colors overflow-hidden">
                {hasTasks && dayTasks.map((task) => {
                  const startHour = parseHour(task.startTime);
                  const endHour = parseHour(task.endTime);
                  const duration = Math.max(1, endHour - startHour);

                  const topPercent = (startHour / 24) * 100;
                  const heightPercent = (duration / 24) * 100;

                  return (
                    <div
                      key={task.id ?? task._id}
                      /* FIXED: Crucial event.stopPropagation() stops the main day click route from firing when picking one exact item bar */
                      onClick={(e) => {
                        e.stopPropagation();
                        openDetails(task);
                      }}
                      className="absolute left-0.5 right-0.5 rounded-2xs opacity-85 transition-all hover:scale-x-105 hover:opacity-100 border border-black/5 cursor-pointer z-10"
                      style={{
                        top: `${topPercent}%`,
                        height: `${heightPercent}%`,
                        backgroundColor: task.color || "#3b82f6",
                      }}
                      title={`${task.title} (${task.startTime} - ${task.endTime})`}
                    />
                  );
                })}
              </div>

            </button>
          );
        })}
      </div>
    </div>
  );
}

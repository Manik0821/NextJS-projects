// src/app/scheduler/components/Scheduler.tsx
"use client";

import { useMemo, useState } from "react";

import SchedulerHeader from "./SchedulerHeader";
import AddTaskDialog from "./AddTaskDialog";
import TaskDetailsDrawer from "./TaskDetailsDrawer";
import DayView from "./DayView";
import WeekView from "./WeekView";
import MonthView from "./MonthView";

import { SchedulerProvider } from "../provider";
import { useTasks } from "../hooks/useTasks";

import {
    getWeekStart,
    getWeekEnd,
} from "../utils/week";

import {
    getMonthStart,
    getMonthEnd,
} from "../utils/month";

import { formatDate } from "../utils/date";
import AISchedulerButton from "./AISchedulerButton";

export default function Scheduler() {
    const [selectedDate, setSelectedDate] =
        useState(new Date());

    const [view, setView] = useState<
        "day" | "week" | "month"
    >("day");

    const [isAddOpen, setIsAddOpen] =
        useState(false);

    const weekStart = useMemo(
        () => getWeekStart(selectedDate),
        [selectedDate]
    );

    const weekEnd = useMemo(
        () => getWeekEnd(selectedDate),
        [selectedDate]
    );

    const monthStart = useMemo(
        () => getMonthStart(selectedDate),
        [selectedDate]
    );

    const monthEnd = useMemo(
        () => getMonthEnd(selectedDate),
        [selectedDate]
    );

    const startDate =
        view === "month"
            ? formatDate(monthStart)
            : view === "week"
                ? formatDate(weekStart)
                : formatDate(selectedDate);

    const endDate =
        view === "month"
            ? formatDate(monthEnd)
            : view === "week"
                ? formatDate(weekEnd)
                : formatDate(selectedDate);

    const {
        tasks,
        loading,
        refreshTasks,
        createTask,
        updateTask,
        deleteTask,
    } = useTasks({
        startDate,
        endDate,
    });

    return (
        <SchedulerProvider
            tasks={tasks}
            loading={loading}
            refreshTasks={refreshTasks}
            createTask={createTask}
            updateTask={updateTask}
            deleteTask={deleteTask}
            changeDate={setSelectedDate}
            changeView={setView}
        >
            <div className="flex h-screen flex-col bg-gray-50">

                <SchedulerHeader
                    selectedDate={selectedDate}
                    view={view}
                    onViewChange={setView}
                    onPreviousDay={() =>
                        setSelectedDate((prev) => {
                            const next = new Date(prev);

                            if (view === "day") {
                                next.setDate(next.getDate() - 1);
                            }

                            if (view === "week") {
                                next.setDate(next.getDate() - 7);
                            }

                            if (view === "month") {
                                next.setMonth(next.getMonth() - 1);
                            }

                            return next;
                        })
                    }
                    onNextDay={() =>
                        setSelectedDate((prev) => {
                            const next = new Date(prev);

                            if (view === "day") {
                                next.setDate(next.getDate() + 1);
                            }

                            if (view === "week") {
                                next.setDate(next.getDate() + 7);
                            }

                            if (view === "month") {
                                next.setMonth(next.getMonth() + 1);
                            }

                            return next;
                        })
                    }
                    onToday={() => setSelectedDate(new Date())}
                    onAddTask={() => setIsAddOpen(true)}
                />

                <div className="flex-1 overflow-hidden">

                    {view === "day" && (
                        <DayView
                            date={selectedDate}
                            tasks={tasks}
                        />
                    )}

                    {view === "week" && (
                        <WeekView
                            date={selectedDate}
                            tasks={tasks}
                        />
                    )}

                    {view === "month" && (
                        <MonthView
                            date={selectedDate}
                            tasks={tasks}
                        />
                    )}

                </div>

                <AddTaskDialog
                    open={isAddOpen}
                    selectedDate={selectedDate}
                    onClose={() => setIsAddOpen(false)}
                    onCreateTask={async (task) => {
                        await createTask(task);
                        await refreshTasks();
                    }}
                />

                <TaskDetailsDrawer />
                <AISchedulerButton
                    selectedDate={selectedDate}
                    onDone={refreshTasks}
                />

            </div>
        </SchedulerProvider>
    );
}
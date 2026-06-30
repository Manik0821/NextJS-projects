"use client";

import { useEffect, useState } from "react";

import { useScheduler } from "../../provider";
import {
  RepeatFrequency,
  RepeatOptions,
  TaskPriority,
  TaskStatus,
} from "../../types/task";
import {
  buildTaskPayload,
  defaultRepeat,
  getDeleteTaskOptions,
  getTaskId,
  toggleRepeatEnabled,
  updateRepeatField,
} from "./taskDetailsDrawer.helpers";
import styles from "./taskDetailsDrawer.module.css";

export default function TaskDetailsDrawer() {
  const {
    selectedTask,
    isDetailsOpen,
    closeDetails,
    updateTask,
    deleteTask,
    refreshTasks,
  } = useScheduler();

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");
  const [startTime, setStartTime] =
    useState("");
  const [endTime, setEndTime] =
    useState("");
  const [priority, setPriority] =
    useState<TaskPriority>("medium");
  const [status, setStatus] =
    useState<TaskStatus>("pending");
  const [color, setColor] =
    useState("#3B82F6");
  const [repeat, setRepeat] =
    useState<RepeatOptions>(defaultRepeat);

  useEffect(() => {
    if (!selectedTask) return;

    setTitle(selectedTask.title);
    setDescription(selectedTask.description);
    setStartTime(selectedTask.startTime);
    setEndTime(selectedTask.endTime);
    setPriority(selectedTask.priority);
    setStatus(selectedTask.status);
    setColor(selectedTask.color);

    setRepeat(
      selectedTask.repeat ?? defaultRepeat
    );
  }, [selectedTask]);

  if (!isDetailsOpen || !selectedTask) {
    return null;
  }

  const taskId = getTaskId(selectedTask);

  async function saveTask() {
    if (!taskId) return;

    await updateTask(taskId, buildTaskPayload({
      title,
      description,
      startTime,
      endTime,
      priority,
      status,
      color,
      repeat,
    }));

    await refreshTasks();
    closeDetails();
  }

  async function markComplete() {
    if (!taskId) return;

    await updateTask(taskId, {
      status: "completed",
    });

    await refreshTasks();
    closeDetails();
  }

  async function removeTask() {
    if (!taskId) return;

    const deleteOptions = getDeleteTaskOptions(selectedTask, taskId);

    if (!deleteOptions) {
      return;
    }

    await deleteTask(deleteOptions.taskId, deleteOptions.options);

    await refreshTasks();
    closeDetails();
  }

  return (
    <div className={styles.drawerOverlay}>
      <div className={styles.drawerPanel}>
        <div className={styles.drawerHeader}>
          <h2 className={styles.drawerTitle}>Edit Task</h2>

          <button type="button" onClick={closeDetails} className={styles.drawerCloseButton}>
            ✕
          </button>
        </div>

        <div className={styles.drawerBody}>
          <div className={styles.drawerSection}>
            <label className={styles.drawerLabel}>Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.drawerInput}
            />
          </div>

          <div className={styles.drawerSection}>
            <label className={styles.drawerLabel}>Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.drawerTextarea}
            />
          </div>

          <div className={styles.drawerGridTwo}>
            <div className={styles.drawerSection}>
              <label className={styles.drawerLabel}>Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className={styles.drawerInput}
              />
            </div>

            <div className={styles.drawerSection}>
              <label className={styles.drawerLabel}>End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className={styles.drawerInput}
              />
            </div>
          </div>

          <div className={styles.drawerGridTwo}>
            <div className={styles.drawerSection}>
              <label className={styles.drawerLabel}>Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className={styles.drawerSelect}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className={styles.drawerSection}>
              <label className={styles.drawerLabel}>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className={styles.drawerSelect}
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className={styles.drawerSection}>
            <label className={styles.drawerLabel}>Color</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className={styles.drawerInput}
              style={{ height: "3rem", padding: "0.25rem" }}
            />
          </div>

          <div className={styles.drawerRepeatBox}>
            <div className={styles.drawerRepeatHeader}>
              <div>
                <div className={styles.drawerRepeatHeading}>Repeat Task</div>
                <div className={styles.drawerRepeatSubtext}>
                  Repeat this task daily, weekly, monthly, or yearly.
                </div>
              </div>

              <input
                type="checkbox"
                checked={repeat.enabled}
                onChange={(e) => setRepeat(toggleRepeatEnabled(repeat, e.target.checked))}
                className="h-4 w-4"
              />
            </div>

            {repeat.enabled && (
              <div className={styles.drawerRepeatFields}>
                <div className={styles.drawerSection}>
                  <label className={styles.drawerLabel}>Repeat Every</label>
                  <div className={styles.drawerRepeatInline}>
                    <input
                      type="number"
                      min={1}
                      value={repeat.interval}
                      onChange={(e) =>
                        setRepeat(updateRepeatField(repeat, "interval", Number(e.target.value) || 1))
                      }
                      className={styles.drawerRepeatInput}
                    />

                    <select
                      value={repeat.frequency}
                      onChange={(e) =>
                        setRepeat(updateRepeatField(repeat, "frequency", e.target.value as RepeatFrequency))
                      }
                      className={styles.drawerSelect}
                    >
                      <option value="daily">Day(s)</option>
                      <option value="weekly">Week(s)</option>
                      <option value="monthly">Month(s)</option>
                      <option value="yearly">Year(s)</option>
                    </select>
                  </div>
                </div>

                <div className={styles.drawerSection}>
                  <label className={styles.drawerLabel}>Repeat Until</label>
                  <input
                    type="date"
                    value={repeat.until}
                    onChange={(e) => setRepeat(updateRepeatField(repeat, "until", e.target.value))}
                    className={styles.drawerInput}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={styles.drawerActions}>
          <button type="button" onClick={removeTask} className={`${styles.drawerActionButton} ${styles.drawerActionButtonDelete}`}>
            Delete
          </button>
          <button type="button" onClick={markComplete} className={`${styles.drawerActionButton} ${styles.drawerActionButtonComplete}`}>
            Complete
          </button>
          <button type="button" onClick={saveTask} className={`${styles.drawerActionButton} ${styles.drawerActionButtonSave}`}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
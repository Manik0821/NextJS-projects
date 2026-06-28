"use client";

import styles from "./SchedulerHeader.module.css";

interface SchedulerHeaderProps {
  selectedDate: Date;
  view: "day" | "week" | "month";
  onViewChange: (view: "day" | "week" | "month") => void;
  onPreviousDay: () => void;
  onNextDay: () => void;
  onToday: () => void;
  onAddTask: () => void;
}

export default function SchedulerHeader({
  selectedDate,
  view,
  onViewChange,
  onPreviousDay,
  onNextDay,
  onToday,
  onAddTask,
}: SchedulerHeaderProps) {
  return (
    <header className={styles.headerWrapper}>
      <div className={styles.headerLayoutGrid}>
        
        {/* Element 1: Date Info (Top Left in Grid, First on Line) */}
        <div className={styles.boxDate}>
          <h2 className={styles.dateTitle}>
            {selectedDate.toLocaleDateString(undefined, {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </h2>
          <p className={styles.yearSubtitle}>{selectedDate.getFullYear()}</p>
        </div>

        {/* Element 4: Add Task Button (Top Right in Grid, Last on Line) */}
        <div className={styles.boxAddTask}>
          <button type="button" onClick={onAddTask} className={styles.btnAddTask}>
            + Add Task
          </button>
        </div>

        {/* Element 2: Arrow and Today Navigation (Bottom Left in Grid, Second on Line) */}
        <div className={styles.boxNavigation}>
          <button type="button" onClick={onPreviousDay} className={styles.btnArrow}>
            ←
          </button>
          <button type="button" onClick={onToday} className={styles.btnToday}>
            Today
          </button>
          <button type="button" onClick={onNextDay} className={styles.btnArrow}>
            →
          </button>
        </div>

        {/* Element 3: View Selector Toggle Track (Bottom Right in Grid, Third on Line) */}
        <div className={styles.boxViewSelector}>
          <div className={styles.toggleTrack}>
            {(["day", "week", "month"] as const).map((viewOption) => {
              const isActive = view === viewOption;
              return (
                <button
                  key={viewOption}
                  type="button"
                  onClick={() => onViewChange(viewOption)}
                  className={`${styles.btnToggle} ${isActive ? styles.active : ""}`}
                >
                  {viewOption}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </header>
  );
}

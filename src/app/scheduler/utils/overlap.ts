// import { Task, CalendarEvent } from "../types/task";

// function toMinutes(task: Task, type: "start" | "end") {
//   const value =
//     type === "start"
//       ? task.startMinutes
//       : task.endMinutes;

//   if (typeof value === "number" && !Number.isNaN(value)) {
//     return value;
//   }

//   const time =
//     type === "start"
//       ? task.startTime
//       : task.endTime;

//   const [h, m] = time.split(":").map(Number);

//   return h * 60 + m;
// }

// function overlaps(a: Task, b: Task) {
//   return (
//     toMinutes(a, "start") < toMinutes(b, "end") &&
//     toMinutes(a, "end") > toMinutes(b, "start")
//   );
// }

// export function buildCalendarEvents(
//   tasks: Task[]
// ): CalendarEvent[] {
//   const sorted = [...tasks].sort(
//     (a, b) =>
//       toMinutes(a, "start") -
//       toMinutes(b, "start")
//   );

//   const columns: Task[][] = [];
//   const events: CalendarEvent[] = [];

//   for (const task of sorted) {
//     let column = 0;

//     while (true) {
//       if (!columns[column]) {
//         columns[column] = [task];
//         break;
//       }

//       if (
//         !columns[column].some((t) =>
//           overlaps(t, task)
//         )
//       ) {
//         columns[column].push(task);
//         break;
//       }

//       column++;
//     }

//     const start = toMinutes(task, "start");
//     const end = toMinutes(task, "end");

//     events.push({
//       task,
//       top: start,
//       height: Math.max(end - start, 30),
//       column,
//       totalColumns: 1,
//       left: 0,
//       width: 100,
//       overlaps: [],
//     });
//   }

//   for (const event of events) {
//     const group = events.filter((e) =>
//       overlaps(event.task, e.task)
//     );

//     const totalColumns =
//       Math.max(
//         event.column,
//         ...group.map((g) => g.column)
//       ) + 1;

//     event.totalColumns = totalColumns;
//     event.width = 100 / totalColumns;
//     event.left =
//       event.column * event.width;

//     event.overlaps = group
//       .map((g) => g.task.id!)
//       .filter(
//         (id) => id !== event.task.id
//       );
//   }

//   return events;
// }
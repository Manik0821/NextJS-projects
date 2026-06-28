export function getWeekStart(date: Date): Date {
    const start = new Date(date);
  
    const day = start.getDay();
  
    start.setDate(start.getDate() - day);
    start.setHours(0, 0, 0, 0);
  
    return start;
  }
  
  export function getWeekEnd(date: Date): Date {
    const end = getWeekStart(date);
  
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);
  
    return end;
  }
  
  export function getWeekDates(date: Date): Date[] {
    const start = getWeekStart(date);
  
    const days: Date[] = [];
  
    for (let i = 0; i < 7; i++) {
      const current = new Date(start);
  
      current.setDate(start.getDate() + i);
  
      days.push(current);
    }
  
    return days;
  }
  
  export function formatDateKey(date: Date): string {
    const year = date.getFullYear();
  
    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");
  
    const day = String(
      date.getDate()
    ).padStart(2, "0");
  
    return `${year}-${month}-${day}`;
  }
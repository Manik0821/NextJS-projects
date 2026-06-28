export function getMonthMatrix(
    date: Date
  ): Date[][] {
    const year = date.getFullYear();
    const month = date.getMonth();
  
    const firstDay = new Date(
      year,
      month,
      1
    );
  
    const startOffset =
      firstDay.getDay();
  
    const daysInMonth = new Date(
      year,
      month + 1,
      0
    ).getDate();
  
    const matrix: Date[][] = [];
  
    let current = new Date(
      year,
      month,
      1 - startOffset
    );
  
    for (let week = 0; week < 6; week++) {
      const row: Date[] = [];
  
      for (let day = 0; day < 7; day++) {
        row.push(new Date(current));
  
        current.setDate(
          current.getDate() + 1
        );
      }
  
      matrix.push(row);
    }
  
    return matrix;
  }
  
  export function formatKey(
    date: Date
  ): string {
    const year = date.getFullYear();
  
    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");
  
    const day = String(
      date.getDate()
    ).padStart(2, "0");
  
    return `${year}-${month}-${day}`;
  }
  
  export function getMonthStart(
    date: Date
  ) {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      1,
      0,
      0,
      0,
      0
    );
  }
  
  export function getMonthEnd(
    date: Date
  ) {
    return new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );
  }
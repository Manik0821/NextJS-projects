export function getRelevanceScore(
    label: string,
    query: string
  ): number {
    const cleanLabel = label.toLowerCase().trim();
    const cleanQuery = query.toLowerCase().trim();
  
    if (!cleanQuery) return 0;
  
    if (cleanLabel === cleanQuery) return 4;
  
    if (cleanLabel.startsWith(cleanQuery))
      return 3;
  
    if (cleanLabel.includes(` ${cleanQuery}`))
      return 2;
  
    if (cleanLabel.includes(cleanQuery))
      return 1;
  
    return 0;
  }
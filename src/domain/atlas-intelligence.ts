type InsightInput = {
  title: string;
  dueDate?: string | null;
  priority?: "low" | "medium" | "high";
  context?: string;
};

export function rankOperationalItems(items: InsightInput[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return items
    .map((item) => {
      const due = item.dueDate ? new Date(`${item.dueDate}T00:00:00`) : null;
      const days = due ? Math.round((due.getTime() - today.getTime()) / 86400000) : 99;
      const priorityScore = item.priority === "high" ? 30 : item.priority === "medium" ? 16 : 6;
      const urgencyScore = days < 0 ? 24 : Math.max(0, 14 - days * 2);
      return { ...item, score: priorityScore + urgencyScore };
    })
    .sort((a, b) => b.score - a.score);
}


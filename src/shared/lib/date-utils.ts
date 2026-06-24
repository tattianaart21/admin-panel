export function getMaximumTimeOfDate(date: Date) {
  const current = new Date();
  const maxForDate = new Date(date.setHours(23, 59));

  if (current < maxForDate) {
    return current;
  }

  return maxForDate;
}

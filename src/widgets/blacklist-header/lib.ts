import dayjs from "dayjs";

export function getStartDate() {
  return dayjs(new Date())
    .subtract(1, "week")
    .set("hour", 0)
    .set("minute", 0)
    .set("second", 0)
    .toDate();
}

export function getEndDate() {
  return new Date(new Date().setHours(23, 59, 59, 99));
}

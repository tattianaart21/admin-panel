import dayjs from "dayjs";

type Datelike = string | Date | null;

export function formatDate(date?: Datelike, onlyDate?: boolean) {
  if (!date || date === "-") {
    return "-";
  }

  return dayjs(date)
    .locale("ru-RU")
    .format(`YYYY-MM-DD${onlyDate ? "" : " HH:mm:ss"}`);
}

export function getDuration(dateA?: Datelike, dateB?: Datelike) {
  if (!dateA && !dateB) {
    return 0;
  }

  return dateB ? dayjs(dateB).diff(dayjs(dateA)) : dayjs(dateA).diff();
}

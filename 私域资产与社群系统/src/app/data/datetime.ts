// 展示用时间戳工具（本地时区，默认 +08）。
//
// 禁止 `new Date().toISOString().slice(...)`：`toISOString()` 是 UTC，
// 本地 00:00–08:00 建的记录会被显示成前一天（日期）或早 8 小时（时刻）。
// 这些字段随后按串排序 / 展示，UTC 串会让日期与排序都错一天。
// 参见例行 QA 记录与账号中心的时间字段约定。

const pad = (n: number): string => String(n).padStart(2, "0");

/** 本地「YYYY-MM-DD HH:mm」——展示用时间戳。 */
export function localStampMinute(date: Date = new Date()): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** 本地「YYYY-MM-DD」——展示用日期。 */
export function localDate(date: Date = new Date()): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

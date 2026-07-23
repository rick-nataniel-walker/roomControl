export const formatDateTime = (date, withSeconds = true) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}${
    withSeconds ? seconds : ""
  }`;
};
export const javaDateTimeFormatter = (dateTime) => {
  if (typeof dateTime !== "string") {
    return { date: "", time: "" };
  }

  const match = dateTime.match(
    /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2})/
  );

  if (!match) {
    return { date: "", time: "" };
  }

  const [, year, month, day, hours, minutes, seconds] = match;

  return {
    date: `${day}-${month}-${year}`,
    time: `${hours}:${minutes}:${seconds}`,
  };
};

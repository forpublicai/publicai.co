export const formatDate = (date: string): string => {
  if (!date) return "";
  const parsed = new Date(date.includes("T") ? date : `${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) {
    return date;
  }
  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
};

export default formatDate;

export function formatTime(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();

  return `Joined ${day} ${month} ${year}`;
}

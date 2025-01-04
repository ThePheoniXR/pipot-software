export function timeAgo(date1: number, date2: number): string {
  const seconds = Math.floor((date2 - date1) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (seconds < 60) {
    return `${seconds} secs ago`;
  } else if (minutes < 60) {
    return `${minutes} mins ago`;
  } else if (hours < 24) {
    return `${hours} hrs ago`;
  } else if (days < 30) {
    return `${days}  ago`;
  } else if (months < 12) {
    return `${months} months ago`;
  } else {
    return `${years} years ago`;
  }
}

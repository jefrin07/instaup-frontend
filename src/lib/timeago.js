export default function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  const intervals = [
    { label: "yr", seconds: 31536000 },
    { label: "mo", seconds: 2592000 },
    { label: "d", seconds: 86400 },
    { label: "hr", seconds: 3600 },
    { label: "min", seconds: 60 },
  ];

  for (let i = 0; i < intervals.length; i++) {
    const interval = Math.floor(seconds / intervals[i].seconds);
    if (interval >= 1) return `${interval} ${intervals[i].label}${interval > 1 ? "s" : ""} ago`;
  }

  return `${seconds} sec${seconds !== 1 ? "s" : ""} ago`;
}

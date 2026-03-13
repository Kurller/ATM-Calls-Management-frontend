// src/components/SLAIndicator.jsx
export default function SLAIndicator({ openedAt, slaHours, status }) {
  if (!openedAt || !slaHours || status === "RESOLVED") {
    return <span className="text-green-600">✔</span>;
  }

  const opened = new Date(openedAt);
  const deadline = new Date(opened.getTime() + slaHours * 60 * 60 * 1000);
  const diff = deadline - new Date();

  if (diff <= 0) {
    return <span className="text-red-600">SLA Breached</span>;
  }

  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);

  return (
    <span className="text-orange-600">
      {hours}h {minutes}m
    </span>
  );
}
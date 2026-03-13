// src/components/StatusBadge.jsx
export default function StatusBadge({ status }) {
  const colors = {
    OPEN: "bg-blue-100 text-blue-700",
    IN_PROGRESS: "bg-yellow-100 text-yellow-700",
    RESOLVED: "bg-green-100 text-green-700",
    BREACHED: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-2 py-1 rounded text-xs font-medium ${
        colors[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}
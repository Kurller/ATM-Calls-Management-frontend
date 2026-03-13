const statuses = [
  { label: "Open", value: "OPEN" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Parts", value: "PENDING_PARTS" },
  { label: "Bank", value: "PENDING_BANK" },
  { label: "Closed", value: "CLOSED" },
];

export default function StatusTabs({ active, onChange }) {
  return (
    <div className="flex overflow-x-auto gap-2 p-2 bg-white shadow-sm">
      {statuses.map((s) => (
        <button
          key={s.value}
          onClick={() => onChange(s.value)}
          className={`px-4 py-2 rounded-full text-sm whitespace-nowrap
            ${
              active === s.value
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
export default function CallCard({ call }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-3">
      <div className="flex justify-between">
        <span className="text-xs text-gray-500">ATM ID</span>
        <span className="font-semibold">{call.atm_id}</span>
      </div>

      <div className="mt-2">
        <p className="text-sm font-medium">{call.issue_type}</p>
        <p className="text-xs text-gray-500">{call.location}</p>
      </div>

      <div className="flex justify-between items-center mt-3">
        <span className="text-xs px-2 py-1 bg-gray-100 rounded">
          {call.priority}
        </span>
        <span className="text-xs text-gray-600">
          {call.assigned_to_name || "Unassigned"}
        </span>
      </div>
    </div>
  );
}
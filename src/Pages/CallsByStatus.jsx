import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function CallsByStatus() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("open");
  const [tickets, setTickets] = useState([]);
  const [statusCounts, setStatusCounts] = useState({ open: 0, "in-progress": 0, assigned: 0 });

  const statusColors = {
    open: "bg-red-100 text-red-800",
    "in-progress": "bg-yellow-100 text-yellow-800",
    assigned: "bg-blue-100 text-blue-800",
  };

  // Fetch tickets for selected status
  const fetchTickets = async () => {
    try {
      const res = await api.get(`/atm_calls/tickets/status?status=${status}`);
      setTickets(res.data);
    } catch (err) {
      console.error("Error fetching tickets:", err);
    }
  };

  // Fetch counts for all statuses
  const fetchStatusCounts = async () => {
    try {
      const statuses = ["open", "in-progress", "assigned"];
      const counts = {};
      for (const s of statuses) {
        const res = await api.get(`/atm_calls/tickets/status?status=${s}`);
        counts[s] = res.data.length;
      }
      setStatusCounts(counts);
    } catch (err) {
      console.error("Error fetching status counts:", err);
    }
  };

  useEffect(() => {
    fetchTickets();
    fetchStatusCounts();
  }, [status]);

  // Logout handler
  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      {/* Sticky header with logout */}
      <div className="sticky top-0 bg-white z-10 p-2 flex justify-between items-center shadow-md mb-4">
        <h2 className="text-xl font-bold">Calls By Status</h2>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Logout
        </button>
      </div>

      {/* Status summary bar */}
      <div className="flex justify-around mb-4">
        {Object.keys(statusCounts).map((key) => (
          <div
            key={key}
            className={`px-3 py-1 rounded ${statusColors[key]} font-semibold text-sm`}
          >
            {key.replace("-", " ").toUpperCase()}: {statusCounts[key]}
          </div>
        ))}
      </div>

      {/* Status Filter */}
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full border rounded p-2 mb-4"
      >
        <option value="open">Open</option>
        <option value="in-progress">In Progress</option>
        <option value="assigned">Assigned</option>
      </select>

      {/* Ticket list */}
      {tickets.length === 0 ? (
        <p className="text-center text-gray-500">No tickets found</p>
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="border rounded-lg p-3 shadow-sm bg-white"
            >
              <p className="font-semibold">ATM: {ticket.atm_id}</p>
              <p className="text-sm text-gray-600">
                {ticket.bank_name} • {ticket.location}
              </p>
              <p className="text-sm">Issue: {ticket.issue_type}</p>
              <p className="text-sm">Priority: {ticket.priority}</p>

              <p
                className={`text-sm font-medium inline-block px-2 py-1 rounded ${statusColors[ticket.status]}`}
              >
                {ticket.status.replace("-", " ").toUpperCase()}
              </p>

              {ticket.assigned_to_name && (
                <p className="text-sm text-gray-500">
                  Assigned to: {ticket.assigned_to_name}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
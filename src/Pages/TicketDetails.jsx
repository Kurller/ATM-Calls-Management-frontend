import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function TicketDetails() {
  const { ticketId } = useParams();

  const [ticket, setTicket] = useState(null);
  const [history, setHistory] = useState([]);
  const [engineers, setEngineers] = useState([]);

  const [selectedEngineer, setSelectedEngineer] = useState("");
  const [status, setStatus] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchTicket = async () => {
    try {
      const res = await api.get(`/tickets/${ticketId}`);
      setTicket(res.data.ticket);
      setStatus(res.data.ticket.status);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch ticket");
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await api.get(`/tickets/${ticketId}/history`);
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchEngineers = async () => {
    try {
      const res = await api.get("/engineers");
      setEngineers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchTicket(), fetchHistory(), fetchEngineers()]);
      setLoading(false);
    };

    loadData();
  }, [ticketId]);

  const handleAssign = async () => {
    if (!selectedEngineer) return;

    try {
      const res = await api.patch(`/tickets/${ticketId}/assign`, {
        engineer_id: selectedEngineer,
      });

      setSuccess(res.data.message);
      setSelectedEngineer("");

      fetchTicket();
      fetchHistory();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to assign engineer");
    }
  };

  const handleStatusUpdate = async () => {
    try {
      const res = await api.patch(`/tickets/${ticketId}/status`, { status });

      setSuccess(res.data.message);

      fetchTicket();
      fetchHistory();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    }
  };

  if (loading) return <p className="p-6 text-center">Loading ticket...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!ticket) return <p className="p-6">Ticket not found</p>;

  return (
    <div className="p-4 max-w-3xl mx-auto">

      {/* HEADER */}
      <h1 className="text-xl font-bold mb-4">
        Ticket #{ticket.id}
      </h1>

      {/* TICKET INFO */}
      <div className="bg-white shadow rounded p-4 mb-4 space-y-2">

        <p><strong>ATM ID:</strong> {ticket.atm_id}</p>
        <p><strong>Bank:</strong> {ticket.bank_name}</p>
        <p><strong>Location:</strong> {ticket.location}</p>
        <p><strong>Issue Type:</strong> {ticket.issue_type}</p>

        <p>
          <strong>Priority:</strong>
          <span className={`ml-2 px-2 py-1 rounded text-white text-sm
            ${ticket.priority === "critical" && "bg-red-600"}
            ${ticket.priority === "high" && "bg-orange-500"}
            ${ticket.priority === "medium" && "bg-yellow-500"}
            ${ticket.priority === "low" && "bg-green-500"}
          `}>
            {ticket.priority}
          </span>
        </p>

        <p>
          <strong>Status:</strong>
          <span className="ml-2 px-2 py-1 rounded bg-gray-200 text-sm">
            {ticket.status}
          </span>
        </p>

        <p>
          <strong>Assigned Engineer:</strong>{" "}
          {ticket.assigned_to_name || "Not assigned"}
        </p>

      </div>

      {/* ASSIGN ENGINEER */}
      <div className="bg-white shadow rounded p-4 mb-4">

        <h2 className="font-semibold mb-2">Assign Engineer</h2>

        <div className="flex flex-col gap-2 sm:flex-row">

          <select
            value={selectedEngineer}
            onChange={(e) => setSelectedEngineer(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="">Select Engineer</option>

            {engineers.map((eng) => (
              <option key={eng.id} value={eng.id}>
                {eng.name} ({eng.email})
              </option>
            ))}

          </select>

          <button
            onClick={handleAssign}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Assign
          </button>

        </div>
      </div>

      {/* UPDATE STATUS */}
      <div className="bg-white shadow rounded p-4 mb-4">

        <h2 className="font-semibold mb-2">Update Status</h2>

        <div className="flex flex-col gap-2 sm:flex-row">

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          <button
            onClick={handleStatusUpdate}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Update
          </button>

        </div>
      </div>

      {/* HISTORY */}
      <div className="bg-white shadow rounded p-4">

        <h2 className="font-semibold mb-2">Assignment History</h2>

        {history.length === 0 ? (
          <p>No assignment history</p>
        ) : (
          <ul className="space-y-2">

            {history.map((h) => (
              <li
                key={h.id}
                className="border rounded p-2 text-sm"
              >
                Engineer ID: {h.engineer_id}

                <br />

                Assigned at:
                {" "}
                {new Date(h.assigned_at).toLocaleString()}
              </li>
            ))}

          </ul>
        )}

      </div>

      {/* ALERTS */}
      {success && (
        <p className="text-green-600 mt-3">{success}</p>
      )}

    </div>
  );
}
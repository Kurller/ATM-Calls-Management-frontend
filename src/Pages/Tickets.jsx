// src/Pages/Tickets.jsx
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [engineers, setEngineers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lookupId, setLookupId] = useState("");
  const [lookupTicket, setLookupTicket] = useState(null);
  const [search, setSearch] = useState("");

  // Fetch tickets
  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await api.get("/atm_calls/tickets");
      setTickets(res.data.tickets || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  };

  // Fetch engineers
  const fetchEngineers = async () => {
    try {
      const res = await api.get("/engineers");
      setEngineers(res.data.engineers || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTickets();
    fetchEngineers();
  }, []);

  // Lookup ticket by DB primary key
  const handleLookup = async () => {
    if (!lookupId) return;

    try {
      const numericId = Number(lookupId);
      if (isNaN(numericId)) throw new Error("Invalid ticket ID");

      const res = await api.get(`/atm_calls/tickets/${numericId}`);
      setLookupTicket(res.data.ticket);
    } catch (err) {
      console.error(err);
      alert("Ticket not found");
      setLookupTicket(null);
    }
  };

  // Delete ticket
  const handleDelete = async (id) => {
    if (!id) return alert("Invalid ticket ID");
    if (!window.confirm("Delete this ticket?")) return;

    try {
      const res = await api.delete(`/atm_calls/tickets/${id}`);
      alert(res.data.message || "Ticket deleted successfully");
      fetchTickets();
      setLookupTicket(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  // Update ticket
  const handleUpdate = async (id, updates) => {
    if (!id) return alert("Invalid ticket ID");

    // Filter only fields that can be updated
    const payload = {};
    ["atm_id", "bank_name", "location", "issue_type", "priority", "status"].forEach(
      (key) => {
        if (updates[key] !== undefined) payload[key] = updates[key];
      }
    );

    if (Object.keys(payload).length === 0) return alert("No fields to update");

    try {
      const res = await api.patch(`/atm_calls/tickets/${id}`, payload);
      fetchTickets();
      alert(res.data.message || "Ticket updated successfully");
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Update failed");
    }
  };

  // Assign engineer
  const handleAssign = async (ticketId, engineerId) => {
    if (!engineerId) return alert("Select engineer");

    try {
      const res = await api.patch(`/atm_calls/tickets/${ticketId}/assign`, {
        engineer_id: Number(engineerId),
      });
      fetchTickets();
      alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert("Assignment failed");
    }
  };

  // Auto assign
  const handleAutoAssign = async (ticketId) => {
    try {
      const res = await api.patch(`/atm_calls/tickets/${ticketId}/auto-assign`);
      alert(res.data.message);
      fetchTickets();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Auto assign failed");
    }
  };

  // Ticket stats
  const openCount = tickets.filter((t) => t.status === "open").length;
  const progressCount = tickets.filter((t) => t.status === "in-progress").length;
  const resolvedCount = tickets.filter((t) => t.status === "resolved").length;

  // Search filter
  const filteredTickets = tickets.filter((t) =>
    `${t.atm_id} ${t.bank_name} ${t.location}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">ATM Tickets</h2>

      {/* Ticket Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4 text-center">
        <div className="bg-red-100 p-2 rounded">
          <p>Open</p>
          <p className="font-bold">{openCount}</p>
        </div>
        <div className="bg-yellow-100 p-2 rounded">
          <p>In Progress</p>
          <p className="font-bold">{progressCount}</p>
        </div>
        <div className="bg-green-100 p-2 rounded">
          <p>Resolved</p>
          <p className="font-bold">{resolvedCount}</p>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search ATM / Bank / Location"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />

      {/* Lookup */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Ticket ID"
          value={lookupId}
          onChange={(e) => setLookupId(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <button onClick={handleLookup} className="bg-blue-600 text-white px-3 rounded">
          Lookup
        </button>
      </div>

      {/* Lookup Ticket */}
      {lookupTicket && (
        <TicketCard
          key={lookupTicket.id}
          ticket={lookupTicket}
          engineers={engineers}
          handleDelete={handleDelete}
          handleUpdate={handleUpdate}
          handleAssign={handleAssign}
          handleAutoAssign={handleAutoAssign}
        />
      )}

      {/* Ticket List */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : filteredTickets.length === 0 ? (
        <p>No tickets found</p>
      ) : (
        filteredTickets.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            engineers={engineers}
            handleDelete={handleDelete}
            handleUpdate={handleUpdate}
            handleAssign={handleAssign}
            handleAutoAssign={handleAutoAssign}
          />
        ))
      )}
    </div>
  );
}

// ----------------- TicketCard -----------------
function TicketCard({ ticket, engineers, handleDelete, handleUpdate, handleAssign, handleAutoAssign }) {
  const [formData, setFormData] = useState({
    atm_id: ticket.atm_id || "",
    bank_name: ticket.bank_name || "",
    location: ticket.location || "",
    issue_type: ticket.issue_type || "",
    priority: ticket.priority || "low",
    status: ticket.status || "open",
    engineer_id: ticket.engineer_id || "",
  });

  const priorityColor =
    ticket.priority === "critical"
      ? "bg-red-700"
      : ticket.priority === "high"
      ? "bg-red-500"
      : ticket.priority === "medium"
      ? "bg-yellow-500"
      : "bg-green-500";

  return (
    <div className="border p-3 rounded mb-3 bg-white shadow">
      <p><strong>ID:</strong> {ticket.id}</p>
      <p><strong>ATM:</strong> {ticket.atm_id}</p>
      <p><strong>Bank:</strong> {ticket.bank_name}</p>
      <p>
        <strong>Priority:</strong>{" "}
        <span className={`text-white px-2 py-1 rounded ${priorityColor}`}>{ticket.priority}</span>
      </p>
      <p><strong>Status:</strong> {ticket.status}</p>
      <p><strong>Engineer:</strong> {ticket.assigned_to_name || "Not assigned"}</p>

      <div className="grid gap-2 mt-2">
        <input
          value={formData.atm_id}
          onChange={(e) => setFormData({ ...formData, atm_id: e.target.value })}
          className="border p-1 rounded"
        />
        <input
          value={formData.bank_name}
          onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
          className="border p-1 rounded"
        />
        <input
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="border p-1 rounded"
        />
        <input
          value={formData.issue_type}
          onChange={(e) => setFormData({ ...formData, issue_type: e.target.value })}
          className="border p-1 rounded"
        />
        <select
          value={formData.priority}
          onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
          className="border p-1 rounded"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="border p-1 rounded"
        >
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>

        {/* Engineer Dropdown */}
        <select
          value={formData.engineer_id}
          onChange={(e) => setFormData({ ...formData, engineer_id: e.target.value })}
          className="border p-1 rounded"
        >
          <option value="">Assign Engineer</option>
          {engineers.length === 0 ? (
            <option disabled>Loading engineers...</option>
          ) : (
            engineers.map((eng) => (
              <option key={eng.id} value={eng.id}>
                {eng.name} ({eng.email})
              </option>
            ))
          )}
        </select>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-3 flex-wrap">
        <button
          onClick={() => handleUpdate(ticket.id, formData)}
          className="bg-green-600 text-white px-3 py-1 rounded"
        >
          Update
        </button>
        <button
          onClick={() => handleDelete(ticket.id)}
          className="bg-red-600 text-white px-3 py-1 rounded"
        >
          Delete
        </button>
        <button
          onClick={() => handleAssign(ticket.id, formData.engineer_id)}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Assign
        </button>
        <button
          onClick={() => handleAutoAssign(ticket.id)}
          className="bg-purple-600 text-white px-3 py-1 rounded"
        >
          Auto Assign
        </button>
      </div>
    </div>
  );
}
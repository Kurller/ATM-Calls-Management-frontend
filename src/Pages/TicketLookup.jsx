// src/Pages/TicketLookup.jsx
import { useState } from "react";
import api from "../api/axios";

export default function TicketLookup() {
  const [ticketId, setTicketId] = useState("");
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState("");

  const searchTicket = async () => {
    try {
      setError("");
      const res = await api.get(`/atm_calls/tickets/${ticketId}`);
      setTicket(res.data.ticket);
    } catch (err) {
      setError("Ticket not found");
      setTicket(null);
    }
  };

  return (
    <div className="border p-4 rounded-lg bg-gray-50">

      <h3 className="font-semibold mb-2">Search Ticket</h3>

      <div className="flex gap-2">
        <input
          type="number"
          placeholder="Enter Ticket ID"
          value={ticketId}
          onChange={(e) => setTicketId(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <button
          onClick={searchTicket}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {ticket && (
        <div className="mt-4 border rounded p-3 bg-white">
          <p><strong>ID:</strong> {ticket.id}</p>
          <p><strong>ATM ID:</strong> {ticket.atm_id}</p>
          <p><strong>Bank:</strong> {ticket.bank_name}</p>
          <p><strong>Priority:</strong> {ticket.priority}</p>
          <p><strong>Status:</strong> {ticket.status}</p>
        </div>
      )}
    </div>
  );
}
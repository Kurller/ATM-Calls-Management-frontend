// src/components/TicketStatusUpdate.jsx
import api from "../api/axios";

export default function TicketStatusUpdate({ ticketId }) {
  const updateStatus = async (status) => {
    await api.patch(`/atm_calls/${ticketId}/status`, { status });
    alert("Status updated");
  };

  return (
    <div className="flex gap-2">
      {["open", "in-progress", "resolved", "closed"].map((s) => (
        <button key={s} onClick={() => updateStatus(s)}>
          {s}
        </button>
      ))}
    </div>
  );
}
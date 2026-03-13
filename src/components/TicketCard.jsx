// src/components/TicketCard.jsx
import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import SLAIndicator from "./SLAIndicator";

export default function TicketCard({ ticket }) {
  return (
    <Link
      to={`/tickets/${ticket.id}`}
      className="block bg-white rounded-lg shadow-sm border p-4 space-y-2"
    >
      <div className="flex justify-between">
        <h3 className="font-semibold text-sm">
          ATM: {ticket.atm_id}
        </h3>
        <StatusBadge status={ticket.status} />
      </div>

      <p className="text-sm text-gray-600">
        {ticket.issue}
      </p>

      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>Assigned: {ticket.assigned_to_name || "Unassigned"}</span>
        <SLAIndicator
          openedAt={ticket.created_at}
          slaHours={ticket.sla_hours}
          status={ticket.status}
        />
      </div>
    </Link>
  );
}
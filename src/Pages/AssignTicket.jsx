import { useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function AssignTicket() {
  const { ticketId } = useParams();
  const [engineerId, setEngineerId] = useState("");

  const assign = async () => {
    await api.patch(`/tickets/${ticketId}/assign`, { engineer_id: engineerId });
    alert("Engineer assigned successfully");
  };

  return (
    <div className="p-4 flex gap-2 items-center">
      <input value={engineerId} onChange={e => setEngineerId(e.target.value)} placeholder="Engineer ID" className="border px-2 py-1 rounded"/>
      <button onClick={assign} className="bg-green-600 text-white px-3 py-1 rounded">Assign</button>
    </div>
  );
}
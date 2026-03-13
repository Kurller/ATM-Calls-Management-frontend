import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function TicketHistory() {
  const { ticketId } = useParams();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHistory = async () => {
    try {
      const res = await api.get(`/ticket-history/${ticketId}`);
      setHistory(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load ticket history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [ticketId]);

  if (loading) return <p className="p-4 text-center">Loading history...</p>;

  if (error)
    return <p className="p-4 text-center text-red-600">{error}</p>;

  return (
    <div className="p-4 max-w-md mx-auto">

      <h2 className="text-xl font-bold mb-4 text-center">
        Ticket #{ticketId} Assignment History
      </h2>

      {history.length === 0 ? (
        <p className="text-center text-gray-500">
          No assignment history found
        </p>
      ) : (
        <div className="space-y-3">

          {history.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg p-3 shadow-sm bg-white"
            >

              <p className="text-sm">
                <span className="font-semibold">Engineer ID:</span>{" "}
                {item.engineer_id}
              </p>

              <p className="text-sm">
                <span className="font-semibold">Assigned At:</span>{" "}
                {new Date(item.assigned_at).toLocaleString()}
              </p>

            </div>
          ))}

        </div>
      )}
    </div>
  );
}
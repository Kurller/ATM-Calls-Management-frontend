import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function EditTicket() {
  const { ticketId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    atm_id: "",
    bank_name: "",
    location: "",
    issue_type: "",
    priority: "",
    status: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch ticket
  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await api.get(`/tickets/${ticketId}`);
        const t = res.data.ticket;

        setForm({
          atm_id: t.atm_id || "",
          bank_name: t.bank_name || "",
          location: t.location || "",
          issue_type: t.issue_type || "",
          priority: t.priority || "",
          status: t.status || ""
        });

      } catch (err) {
        setError(err.response?.data?.message || "Failed to load ticket");
      }
    };

    fetchTicket();
  }, [ticketId]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await api.patch(`/tickets/${ticketId}`, form);

      setSuccess(res.data.message || "Ticket updated");

      setTimeout(() => {
        navigate(`/tickets/${ticketId}`);
      }, 1200);

    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }

    setLoading(false);
  };

  return (
    <div className="p-4 max-w-md mx-auto">

      <h1 className="text-xl font-bold mb-4">
        Edit Ticket #{ticketId}
      </h1>

      {error && (
        <p className="text-red-600 mb-2">{error}</p>
      )}

      {success && (
        <p className="text-green-600 mb-2">{success}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">

        <input
          name="atm_id"
          value={form.atm_id}
          onChange={handleChange}
          placeholder="ATM ID"
          className="w-full border p-2 rounded"
        />

        <input
          name="bank_name"
          value={form.bank_name}
          onChange={handleChange}
          placeholder="Bank Name"
          className="w-full border p-2 rounded"
        />

        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
          className="w-full border p-2 rounded"
        />

        <input
          name="issue_type"
          value={form.issue_type}
          onChange={handleChange}
          placeholder="Issue Type"
          className="w-full border p-2 rounded"
        />

        {/* Priority */}
        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>

        {/* Status */}
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Status</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          {loading ? "Updating..." : "Update Ticket"}
        </button>

      </form>

    </div>
  );
}
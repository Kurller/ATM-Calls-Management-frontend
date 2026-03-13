// src/Pages/CreateTicket.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function CreateTicket() {
  const navigate = useNavigate();
  const { user } = useAuth(); // check if user is logged in
  const [formData, setFormData] = useState({
    atm_id: "",
    bank_name: "",
    location: "",
    issue_type: "",
    priority: "Medium",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Update form inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit ticket
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.otpVerified) {
      setError("You must be logged in to create a ticket");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.post("/atm_calls/tickets", formData, {
        withCredentials: true, // 🔥 important for session cookies
      });

      alert(res.data.message);
      navigate("/tickets"); // redirect to tickets list
    } catch (err) {
      console.error("Error creating ticket:", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to create ticket");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create ATM Ticket</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="atm_id"
          placeholder="ATM ID"
          value={formData.atm_id}
          onChange={handleChange}
          required
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="bank_name"
          placeholder="Bank Name"
          value={formData.bank_name}
          onChange={handleChange}
          required
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="issue_type"
          placeholder="Issue Type"
          value={formData.issue_type}
          onChange={handleChange}
          required
          className="p-2 border rounded"
        />
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="p-2 border rounded"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Ticket"}
        </button>
      </form>
    </div>
  );
}
import { NavLink, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const linkStyle = ({ isActive }) =>
    `p-2 rounded ${isActive ? "bg-blue-200 font-bold" : "hover:bg-gray-200"}`;

  return (
    <aside className="w-64 bg-gray-100 p-4 flex flex-col justify-between h-screen">
      <nav className="flex flex-col gap-2">

        <NavLink to="/dashboard" className={linkStyle}>Dashboard</NavLink>
        <NavLink to="/tickets" className={linkStyle}>Tickets</NavLink>
        <NavLink to="/tickets/create" className={linkStyle}>Create Ticket</NavLink>
        <NavLink to="/ticket-lookup" className={linkStyle}>Ticket Lookup</NavLink>
        <NavLink to="/calls-by-status" className={linkStyle}>Call Status</NavLink>
        <NavLink to="/reports" className={linkStyle}>Reports</NavLink>
        <NavLink to="/settings" className={linkStyle}>Settings</NavLink>

      </nav>

      <button
        onClick={handleLogout}
        className="mt-6 bg-red-500 text-white p-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </aside>
  );
}
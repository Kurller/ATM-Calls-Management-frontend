// src/components/BottomNav.jsx
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function BottomNav() {
  const { user } = useContext(AuthContext);

  return (
    <nav className="bg-white border-t flex justify-around py-2">
      <NavLink to="/dashboard">🏠</NavLink>
      <NavLink to="/tickets">🎫</NavLink>

      {["admin", "supervisor"].includes(user.role) && (
        <NavLink to="/reports">📊</NavLink>
      )}

      <NavLink to="/settings">⚙️</NavLink>
    </nav>
  );
}
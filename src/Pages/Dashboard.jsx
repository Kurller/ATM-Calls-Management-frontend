import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Dashboard() {

  const [stats, setStats] = useState(null);

  useEffect(() => {

    const fetchStats = async () => {
      try {
        const res = await api.get("/api/dashboard");
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();

  }, []);

  if (!stats) return <p>Loading dashboard...</p>;

  return (
    <div>

      <h1 className="text-2xl font-bold mb-6">ATM Support Dashboard</h1>

      <div className="grid grid-cols-5 gap-4">

        <div className="bg-white p-4 shadow rounded">
          <h2>Total Calls</h2>
          <p className="text-2xl">{stats.total_calls}</p>
        </div>

        <div className="bg-yellow-100 p-4 shadow rounded">
          <h2>Open</h2>
          <p className="text-2xl">{stats.open_calls}</p>
        </div>

        <div className="bg-blue-100 p-4 shadow rounded">
          <h2>In Progress</h2>
          <p className="text-2xl">{stats.in_progress}</p>
        </div>

        <div className="bg-green-100 p-4 shadow rounded">
          <h2>Resolved</h2>
          <p className="text-2xl">{stats.resolved_calls}</p>
        </div>

        <div className="bg-red-100 p-4 shadow rounded">
          <h2>High Priority</h2>
          <p className="text-2xl">{stats.high_priority}</p>
        </div>

      </div>

    </div>
  );
}
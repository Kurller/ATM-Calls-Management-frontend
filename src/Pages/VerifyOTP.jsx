import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";

export default function VerifyOTP() {
  const navigate = useNavigate();
  const { state } = useLocation(); // email passed from login
  const email = state?.email;

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(
        "/api/auth/verify-otp",
        { email, otp },
        { withCredentials: true } // required for session
      );
      if (res.data.message === "OTP verified successfully") {
        navigate("/dashboard");
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Server error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-sm mx-auto">
      <h2>Enter OTP for {email}</h2>
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
        className="w-full border px-3 py-2 rounded mb-2"
      />
      {error && <p className="text-red-500">{error}</p>}
      <button className="w-full bg-blue-600 text-white py-2 rounded">
        Verify OTP
      </button>
    </form>
  );
}
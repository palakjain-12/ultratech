import { useState } from "react";
import api from "../lib/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/login", { email, password });
      login(data);
      navigate("/");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={onSubmit} className="bg-white shadow p-6 rounded w-96">
        <h1 className="text-xl font-semibold mb-4">Login</h1>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <label className="block text-sm mb-1">Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full border rounded px-3 py-2 mb-3" />
        <label className="block text-sm mb-1">Password</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="w-full border rounded px-3 py-2 mb-4" />
        <button className="w-full bg-gray-900 text-white py-2 rounded">Sign In</button>
        <div className="text-xs text-gray-500 mt-3">
          Use seeded accounts: supervisor@ultratech.com, technician@ultratech.com, store@ultratech.com (password: password123)
        </div>
      </form>
    </div>
  );
};

export default Login;


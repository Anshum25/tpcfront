import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Login() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const fixedEmail = "admin@example.com"; // Set this to your ADMIN_EMAIL
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fixedEmail, password }),
      });
      if (!res.ok) {
        setError("Incorrect email or password");
        return;
      }
      const data = await res.json();
      localStorage.setItem("tpc_token", data.token);
      navigate("/admin");
    } catch (err) {
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-xs flex flex-col gap-4">
        <h2 className="text-2xl font-bold mb-2 text-center">Admin Login</h2>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Enter admin password"
          className="border rounded px-3 py-2"
          autoFocus
          required
        />
        <Button type="submit" className="bg-primary text-white rounded px-4 py-2 font-semibold">Login</Button>
        {error && <div className="text-red-500 text-center">{error}</div>}
      </form>
    </div>
  );
}

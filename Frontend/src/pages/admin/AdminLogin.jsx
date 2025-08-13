import React, { useState } from "react";
import { axiosInstance } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axiosInstance.post("/auth/admin/login", form, { withCredentials: true });
      navigate("/admin");
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-6 w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-bold text-center">Admin Login</h2>
        <div>
          <Label>Email</Label>
          <Input type="email" value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})} required/>
        </div>
        <div>
          <Label>Password</Label>
          <Input type="password" value={form.password} onChange={(e)=>setForm({...form, password: e.target.value})} required/>
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <Button type="submit" disabled={loading} className="w-full">{loading? "Logging in..." : "Login as Admin"}</Button>
      </form>
    </div>
  );
}



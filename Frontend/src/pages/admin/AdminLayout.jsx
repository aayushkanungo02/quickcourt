import React from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { axiosInstance } from "@/lib/axios";

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/admin/logout", {}, { withCredentials: true });
      navigate("/login");
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <nav className="bg-gray-900 text-white px-6 py-4 shadow">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/admin" className="text-xl font-bold">Admin Panel</Link>
          <div className="flex items-center gap-4">
            <NavLink to="/admin" end className={({isActive}) => isActive ? "text-green-400" : "text-gray-200 hover:text-white"}>Dashboard</NavLink>
            <NavLink to="/admin/facilities" className={({isActive}) => isActive ? "text-green-400" : "text-gray-200 hover:text-white"}>Available Facilities</NavLink>
            <NavLink to="/admin/users" className={({isActive}) => isActive ? "text-green-400" : "text-gray-200 hover:text-white"}>User Management</NavLink>
            <button onClick={handleLogout} className="ml-4 px-3 py-1 rounded bg-red-600 hover:bg-red-500">Logout</button>
          </div>
        </div>
      </nav>
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}



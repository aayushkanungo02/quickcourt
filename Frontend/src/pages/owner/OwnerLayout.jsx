import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import useAuthUser from "../../hooks/useAuthuser";

export default function OwnerLayout() {
  const { authUser } = useAuthUser();

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-md sticky top-0 z-20">
        <div className="text-2xl font-bold text-green-600">QuickCourt</div>
        <div className="flex items-center gap-6">
          <NavLink
            to="/owner"
            end
            className={({ isActive }) =>
              `text-sm font-medium ${
                isActive ? "text-green-700" : "text-gray-700"
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/owner/facilities"
            className={({ isActive }) =>
              `text-sm font-medium ${
                isActive ? "text-green-700" : "text-gray-700"
              }`
            }
          >
            Facilities
          </NavLink>
          <NavLink
            to="/owner/manage-courts"
            className={({ isActive }) =>
              `text-sm font-medium ${
                isActive ? "text-green-700" : "text-gray-700"
              }`
            }
          >
            Manage Courts
          </NavLink>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full overflow-hidden border border-green-200 bg-green-50 grid place-items-center">
            {authUser?.avatar ? (
              <img
                src={authUser.avatar}
                alt={authUser.fullName || "Owner"}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-green-700 font-semibold">
                {(authUser?.fullName || "O").charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <span className="hidden sm:block text-green-800 font-medium">
            {authUser?.fullName || "Owner"}
          </span>
        </div>
      </nav>

      <main className="flex-1 p-4 sm:p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}

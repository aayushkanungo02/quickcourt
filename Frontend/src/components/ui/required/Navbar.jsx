import { Link } from "react-router-dom";
import { CalendarDays, LogOut } from "lucide-react";
import useAuthUser from "../../../hooks/useAuthuser.js";
import { axiosInstance } from "../../../lib/axios";
import { useNavigate } from "react-router-dom";

export function Navbar() {
  const { authUser, isLoading } = useAuthUser();
  const isAuthenticated = Boolean(authUser);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout", {}, { withCredentials: true });
      // Quick way to refresh UI/auth state
      window.location.reload();
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <nav className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-green-900 via-green-800 to-green-900 shadow-lg">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">🏸</span>
          </div>
          <div className="text-2xl font-bold text-green-300">QuickCourt</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-9 w-9 bg-green-600 rounded-full animate-pulse"></div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-green-900 via-green-800 to-green-900 shadow-lg">
      <Link to="/">
        <div className="flex items-center space-x-2">
          <div className="text-2xl font-bold text-green-300">QuickCourt</div>
        </div>
      </Link>

      <Link
        to="/edit-profile?tab=bookings"
        className="flex items-center gap-2 px-4 py-2 bg-green-700 text-green-100 rounded-md hover:bg-green-600 hover:text-white font-medium transition-colors"
      >
        <CalendarDays size={20} />
        Bookings
      </Link>

      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full overflow-hidden border border-green-300 bg-green-600 grid place-items-center cursor-pointer hover:bg-green-500 transition-colors">
                {authUser?.avatar ? (
                  <img
                    src={authUser.avatar}
                    alt={authUser.fullName || "User"}
                    className="h-full w-full object-cover"
                    onClick={() => navigate("/edit-profile")}
                  />
                ) : (
                  <span className="text-white font-semibold">
                    {(authUser?.fullName || "U").charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <span className="hidden sm:block text-green-100 font-medium">
                {authUser?.fullName || "User"}
              </span>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 rounded-md border border-green-300 text-green-100 hover:bg-green-700 hover:text-white transition-colors"
            >
              <LogOut size={18} />
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 font-medium transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-400 font-medium transition-colors"
            >
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}


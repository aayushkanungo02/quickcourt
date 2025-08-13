import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import OtpVerification from "./pages/auth/OtpVerification";
import UserHomePage from "./pages/user/userHomepage";
import MoreOptions from "./pages/user/moreOptions";
import VenueDetail from "./pages/user/VenueDetail";
import CourtBooking from "./pages/user/CourtBooking";
import Payment from "./pages/user/Payment";
import useAuthUser from "./hooks/useAuthuser";
import EditProfile from "./pages/user/EditProfile";
import OwnerLayout from "./pages/owner/OwnerLayout";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import Facilities from "./pages/owner/Facilities";
import ManageCourts from "./pages/owner/ManageCourts";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminFacilities from "./pages/admin/AdminFacilities";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminLogin from "./pages/admin/AdminLogin";
import { axiosInstance } from "./lib/axios";

// Protected Route Component
const ProtectedRoute = ({ children, isAuthenticated }) => {
  if (!isAuthenticated) {
    // Redirect to login with a message about why they were redirected
    return <Navigate to="/login?redirected=true" replace />;
  }
  return children;
};

const App = () => {
  const { isLoading, authUser } = useAuthUser();
  
  // Show loading spinner while checking authentication status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  const isAuthenticated = Boolean(authUser);

  // Admin auth checker
  const AdminRoute = ({ children }) => {
    const [allowed, setAllowed] = React.useState(null);
    React.useEffect(() => {
      let mounted = true;
      axiosInstance
        .get("/auth/admin/me", { withCredentials: true })
        .then(() => mounted && setAllowed(true))
        .catch(() => mounted && setAllowed(false));
      return () => {
        mounted = false;
      };
    }, []);
    if (allowed === null) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }
    if (!allowed) return <Navigate to="/admin/login" replace />;
    return children;
  };

  return (
    <Routes>
      {/* Public Routes - No authentication required */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/otp-verification" element={<OtpVerification />} />
      <Route path="/" element={<UserHomePage />} />
      <Route path="/more-options" element={<MoreOptions />} />
      <Route path="/venue/:id" element={<VenueDetail />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      
      {/* Protected Routes - Authentication required */}
      <Route 
        path="/venue/:id/book" 
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <CourtBooking />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/payment/:id" 
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Payment />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/edit-profile" 
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <EditProfile />
          </ProtectedRoute>
        } 
      />

      {/* Facility Owner area */}
      <Route 
        path="/owner" 
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <OwnerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<OwnerDashboard />} />
        <Route path="facilities" element={<Facilities />} />
        <Route path="manage-courts" element={<ManageCourts />} />
      </Route>

      {/* Admin area */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="facilities" element={<AdminFacilities />} />
        <Route path="users" element={<AdminUsers />} />
      </Route>
    </Routes>
  );
};

export default App;

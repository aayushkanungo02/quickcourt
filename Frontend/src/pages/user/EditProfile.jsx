import React, { useState, useEffect, useMemo } from "react";
import { Navbar } from "../../components/ui/required/Navbar";
import { axiosInstance } from "../../lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuthUser from "@/hooks/useAuthuser";

const CLOUDINARY_UPLOAD_PRESET = "odoohack";
const CLOUDINARY_CLOUD_NAME = "dyd71p9lj";

const EditProfile = () => {
  const [activeTab, setActiveTab] = useState("edit"); // edit | bookings
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatar: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [bookings, setBookings] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [streak, setStreak] = useState({ current: 0, longest: 0 });

  const { authUser } = useAuthUser();

  useEffect(() => {
    if (authUser) {
      setUser(authUser);
      setFormData({
        name: authUser.fullName,
        email: authUser.email,
        avatar: authUser.avatar || "",
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [authUser]);

  const fetchBookings = async () => {
    try {
      const res = await axiosInstance.get("/users/bookings");
      setBookings(res.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // compute streaks by consecutive calendar days with any booking
    if (!bookings || bookings.length === 0) {
      setStreak({ current: 0, longest: 0 });
      return;
    }
    const days = Array.from(
      new Set(
        bookings.map((b) => {
          // booking.date is YYYY-MM-DD per controller
          return b.date;
        })
      )
    )
      .map((d) => new Date(d + "T00:00:00"))
      .sort((a, b) => a - b);

    let current = 1;
    let longest = 1;
    for (let i = 1; i < days.length; i++) {
      const diff = (days[i] - days[i - 1]) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        current += 1;
        longest = Math.max(longest, current);
      } else if (diff > 1) {
        current = 1;
      }
    }

    // If last day is today, keep as is; else current resets to 0
    const today = new Date();
    const last = days[days.length - 1];
    const sameDay = last.toDateString() === new Date(today.toISOString().slice(0, 10)).toDateString();
    setStreak({ current: sameDay ? current : 0, longest });
  }, [bookings]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: form,
        }
      );

      const data = await res.json();
      if (data.secure_url) {
        setFormData((prev) => ({ ...prev, avatar: data.secure_url }));

        // Auto-save avatar immediately after upload with correct payload
        await axiosInstance.patch("/users/me", {
          fullName: formData.name,
          avatar: data.secure_url,
        });
      }
    } catch (err) {
      console.error("Image upload failed:", err);
    }
    setUploading(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.patch("/users/me", {
        fullName: formData.name,
        avatar: formData.avatar,
      });
      alert("Profile updated!");
    } catch (err) {
      console.error(err);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
      alert("Please fill all password fields.");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    try {
      await axiosInstance.patch("/users/me/password", {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });
      alert("Password updated!");
      setFormData((prev) => ({
        ...prev,
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to change password");
    }
  };

  useEffect(() => {
    if (activeTab === "bookings") fetchBookings();
  }, [activeTab]);

  useEffect(() => {
    // Open bookings tab if query param tab=bookings
    const params = new URLSearchParams(window.location.search);
    if (params.get("tab") === "bookings") {
      setActiveTab("bookings");
    }
  }, []);

  return (
    <div>
      <Navbar />
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-1/4 bg-gray-100 p-6 flex flex-col items-center border-r">
          {user && (
            <>
              <img
                src={formData.avatar || "https://via.placeholder.com/100"}
                alt="Profile"
                className="w-24 h-24 rounded-full mb-4 object-cover"
              />
              <h2 className="text-lg font-semibold">{authUser.fullName}</h2>
              <p className="text-sm text-gray-600">{authUser.email}</p>

              <Label className="mt-6 block">Change Profile Picture</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="mt-2"
              />
              {uploading && (
                <p className="text-xs text-gray-500 mt-1">Uploading...</p>
              )}

              {/* Streak widget */}
              <div className="mt-6 w-full bg-white rounded-xl border border-green-200 p-4">
                <div className="text-sm font-semibold text-green-900 flex items-center gap-2">
                  <span>🔥 Streaks</span>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-center">
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-green-700">{streak.current}</div>
                    <div className="text-xs text-green-800">Current</div>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-emerald-700">{streak.longest}</div>
                    <div className="text-xs text-emerald-800">Longest</div>
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-600">Book daily to grow your streak and earn badges.</div>
              </div>
            </>
          )}

          <div className="mt-6 space-y-3 w-full">
            <Button
              variant={activeTab === "edit" ? "default" : "outline"}
              className="w-full"
              onClick={() => setActiveTab("edit")}
            >
              Edit Profile
            </Button>
            <Button
              variant={activeTab === "bookings" ? "default" : "outline"}
              className="w-full"
              onClick={() => setActiveTab("bookings")}
            >
              All Bookings
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeTab === "edit" && (
            <div className="space-y-10 max-w-lg">
              <form className="space-y-4" onSubmit={handleUpdate}>
                <div>
                  <Label>Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <Button type="submit" disabled={uploading}>
                  {uploading ? "Uploading..." : "Update Profile"}
                </Button>
              </form>

              <form className="space-y-4" onSubmit={handleChangePassword}>
                <div>
                  <Label>Old Password</Label>
                  <Input
                    type="password"
                    value={formData.oldPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, oldPassword: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>New Password</Label>
                  <Input
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, newPassword: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Confirm New Password</Label>
                  <Input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                </div>
                <Button type="submit">Change Password</Button>
              </form>
            </div>
          )}

          {activeTab === "bookings" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">My Bookings</h2>
              {bookings.length > 0 ? (
                <ul className="space-y-3">
                  {bookings.map((booking) => (
                    <li
                      key={booking._id}
                      className="p-4 border rounded-md shadow-sm bg-white"
                    >
                      <p className="font-semibold">{booking.venueName}</p>
                      <p className="text-sm text-gray-600">{booking.date}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No bookings found.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProfile;

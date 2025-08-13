import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import useAuthUser from "../../hooks/useAuthuser";

// Helper function to format time
const formatTime = (time) => {
  if (!time) return "";
  return time;
};

// Helper function to format price
const formatPrice = (price) => {
  return `₹${Number(price).toLocaleString()}`;
};

function CourtCard({ court, onEditClick, onDeleteClick }) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-green-100 p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{court.name}</h3>
          <p className="text-sm text-gray-600">Sport: {court.sportType}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-green-600">{formatPrice(court.pricePerHour)}</p>
          <p className="text-xs text-gray-500">per hour</p>
        </div>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Operating Hours: {formatTime(court.operatingHours?.start)} - {formatTime(court.operatingHours?.end)}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onEditClick(court)}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium text-sm transition-colors"
        >
          Edit Court
        </button>
        <button
          onClick={() => onDeleteClick(court._id)}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium text-sm transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function AddCourtForm({ onClose, facilities }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    facilityId: "",
    name: "",
    sportType: "",
    pricePerHour: "",
    operatingHours: {
      start: "08:00",
      end: "22:00"
    }
  });
  const [saving, setSaving] = useState(false);

  const createMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        ...form,
        pricePerHour: Number(form.pricePerHour)
      };
      return axiosInstance.post("/users/owner/courts", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-courts"] });
      alert("Court added successfully!");
      onClose();
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || err?.message || "Failed to add court";
      alert(msg);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "start" || name === "end") {
      setForm(prev => ({
        ...prev,
        operatingHours: {
          ...prev.operatingHours,
          [name]: value
        }
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!form.facilityId || !form.name || !form.sportType || !form.pricePerHour) {
      alert("Please fill in all required fields");
      return;
    }
    
    setSaving(true);
    createMutation.mutate(undefined, { onSettled: () => setSaving(false) });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Add New Court</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Facility <span className="text-red-500">*</span>
              </label>
              <select
                name="facilityId"
                value={form.facilityId}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <option value="">Select a facility</option>
                {facilities.map(facility => (
                  <option key={facility._id} value={facility._id}>
                    {facility.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Court Name <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="e.g., Court 1, Badminton Court A"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Sport Type <span className="text-red-500">*</span>
              </label>
              <input
                name="sportType"
                value={form.sportType}
                onChange={handleChange}
                required
                placeholder="e.g., Badminton, Tennis, Football"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Price per Hour (₹) <span className="text-red-500">*</span>
              </label>
              <input
                name="pricePerHour"
                type="number"
                value={form.pricePerHour}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="e.g., 500"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Opening Time <span className="text-red-500">*</span>
                </label>
                <input
                  name="start"
                  type="time"
                  value={form.operatingHours.start}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Closing Time <span className="text-red-500">*</span>
                </label>
                <input
                  name="end"
                  type="time"
                  value={form.operatingHours.end}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium disabled:opacity-60"
              >
                {saving ? "Adding..." : "Add Court"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-lg font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function EditCourtForm({ court, onClose }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    name: court.name || "",
    sportType: court.sportType || "",
    pricePerHour: court.pricePerHour || "",
    operatingHours: {
      start: court.operatingHours?.start || "08:00",
      end: court.operatingHours?.end || "22:00"
    }
  });
  const [saving, setSaving] = useState(false);

  const updateMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        ...form,
        pricePerHour: Number(form.pricePerHour)
      };
      return axiosInstance.put(`/users/owner/courts/${court._id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-courts"] });
      alert("Court updated successfully!");
      onClose();
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || err?.message || "Failed to update court";
      alert(msg);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "start" || name === "end") {
      setForm(prev => ({
        ...prev,
        operatingHours: {
          ...prev.operatingHours,
          [name]: value
        }
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!form.name || !form.sportType || !form.pricePerHour) {
      alert("Please fill in all required fields");
      return;
    }
    
    setSaving(true);
    updateMutation.mutate(undefined, { onSettled: () => setSaving(false) });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Edit Court</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Court Name <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="e.g., Court 1, Badminton Court A"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Sport Type <span className="text-red-500">*</span>
              </label>
              <input
                name="sportType"
                value={form.sportType}
                onChange={handleChange}
                required
                placeholder="e.g., Badminton, Tennis, Football"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Price per Hour (₹) <span className="text-red-500">*</span>
              </label>
              <input
                name="pricePerHour"
                type="number"
                value={form.pricePerHour}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="e.g., 500"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Opening Time <span className="text-red-500">*</span>
                </label>
                <input
                  name="start"
                  type="time"
                  value={form.operatingHours.start}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Closing Time <span className="text-red-500">*</span>
                </label>
                <input
                  name="end"
                  type="time"
                  value={form.operatingHours.end}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-lg font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ManageCourts() {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCourt, setEditingCourt] = useState(null);
  const [selectedFacility, setSelectedFacility] = useState("all");

  // Fetch facilities owned by the user
  const { data: facilities, isLoading: facilitiesLoading } = useQuery({
    queryKey: ["owner-facilities"],
    queryFn: async () => {
      const res = await axiosInstance.get("/users/owner/facilities");
      return res.data?.data || [];
    },
  });

  // Fetch courts for the selected facility
  const { data: courts, isLoading: courtsLoading } = useQuery({
    queryKey: ["owner-courts", selectedFacility],
    queryFn: async () => {
      if (selectedFacility === "all") {
        // Get all courts for all facilities owned by the user
        const facilityIds = facilities?.map(f => f._id) || [];
        if (facilityIds.length === 0) return [];
        
        const res = await axiosInstance.get("/users/owner/courts", {
          params: { facilityIds: facilityIds.join(",") }
        });
        return res.data?.data || [];
      } else {
        // Get courts for specific facility
        const res = await axiosInstance.get(`/users/owner/courts?facilityId=${selectedFacility}`);
        return res.data?.data || [];
      }
    },
    enabled: !!facilities,
  });

  const deleteMutation = useMutation({
    mutationFn: async (courtId) => {
      return axiosInstance.delete(`/users/owner/courts/${courtId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-courts"] });
      alert("Court deleted successfully!");
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || err?.message || "Failed to delete court";
      alert(msg);
    },
  });

  const handleDeleteCourt = (courtId) => {
    if (window.confirm("Are you sure you want to delete this court?")) {
      deleteMutation.mutate(courtId);
    }
  };

  const filteredCourts = useMemo(() => {
    if (!courts) return [];
    return courts;
  }, [courts]);

  const totalCourts = filteredCourts.length;
  const totalRevenue = filteredCourts.reduce((sum, court) => sum + (court.pricePerHour || 0), 0);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Manage Courts</h1>
        <p className="text-gray-600">
          Create and manage courts for your facilities. Add pricing, operating hours, and sport types.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-md p-5 border border-green-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-100 text-green-700 grid place-items-center text-lg font-bold">
              🏟️
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Courts</div>
              <div className="text-2xl font-semibold text-gray-900">
                {courtsLoading ? "—" : totalCourts}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-5 border border-blue-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 text-blue-700 grid place-items-center text-lg font-bold">
              🏢
            </div>
            <div>
              <div className="text-sm text-gray-500">Facilities</div>
              <div className="text-2xl font-semibold text-gray-900">
                {facilitiesLoading ? "—" : (facilities?.length || 0)}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-5 border border-purple-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-purple-100 text-purple-700 grid place-items-center text-lg font-bold">
              💰
            </div>
            <div>
              <div className="text-sm text-gray-500">Expected Total Revenue</div>
              <div className="text-2xl font-semibold text-gray-900">
                {courtsLoading ? "—" : `₹${totalRevenue.toLocaleString()}`}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <select
            value={selectedFacility}
            onChange={(e) => setSelectedFacility(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="all">All Facilities</option>
            {facilities?.map(facility => (
              <option key={facility._id} value={facility._id}>
                {facility.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-5 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          + Add Court
        </button>
      </div>

      {/* Courts Grid */}
      {courtsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filteredCourts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courts found</h3>
          <p className="text-gray-500 mb-4">
            {selectedFacility === "all" 
              ? "You haven't added any courts yet. Get started by adding your first court!"
              : "No courts found for this facility. Add a court to get started!"
            }
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
          >
            Add Your First Court
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourts.map((court) => (
            <CourtCard
              key={court._id}
              court={court}
              onEditClick={(court) => setEditingCourt(court)}
              onDeleteClick={handleDeleteCourt}
            />
          ))}
        </div>
      )}

      {/* Add Court Form Modal */}
      {showAddForm && (
        <AddCourtForm
          onClose={() => setShowAddForm(false)}
          facilities={facilities || []}
        />
      )}

      {/* Edit Court Form Modal */}
      {editingCourt && (
        <EditCourtForm
          court={editingCourt}
          onClose={() => setEditingCourt(null)}
        />
      )}
    </div>
  );
}

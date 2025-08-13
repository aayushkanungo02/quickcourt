import React, { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";

const toArray = (val) =>
  (val || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

// Helper function to show preview of parsed values
const showPreview = (val) => {
  const parsed = toArray(val);
  if (parsed.length === 0) return "No values entered";
  return parsed.join(" • ");
};

function FacilityCard({ facility, onEditClick }) {
  const primaryPhoto = facility.photos?.[0] || "/hero1.jpg";
  const location = `${facility.location?.address || ""}${
    facility.location?.city ? ", " + facility.location.city : ""
  }`;

  return (
    <div className="bg-white/90 backdrop-blur-sm border border-green-100 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col">
      <div className="relative overflow-hidden rounded-xl mb-4">
        <img
          src={primaryPhoto}
          alt={facility.name}
          className="w-full h-48 object-cover"
        />
      </div>
      <h2 className="text-xl font-bold mb-2 text-green-900">{facility.name}</h2>
      <p className="text-gray-600 mb-2 flex items-center gap-2">
        <svg
          className="w-6 h-6 text-green-600 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <span className="text-gray-700 font-medium">{location}</span>
      </p>
      {/* Supported Sports */}
      <div className="mb-3">
        <p className="text-xs text-gray-500 mb-2 font-medium">SUPPORTED SPORTS</p>
        {(facility.supportedSports || []).length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {facility.supportedSports.map((sport, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full bg-green-100 border border-green-200 text-green-800 text-xs font-medium"
              >
                {sport.trim()}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-gray-400 text-sm italic">No sports configured</span>
        )}
      </div>

      {/* Amenities */}
      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-2 font-medium">AMENITIES</p>
        {(facility.amenities || []).length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {facility.amenities.map((amenity, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-800 text-xs font-medium"
              >
                {amenity.trim()}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-gray-400 text-sm italic">No amenities configured</span>
        )}
      </div>
      <button
        onClick={() => onEditClick(facility)}
        className="mt-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
      >
        Edit Facility
      </button>
    </div>
  );
}

function EditFacilityForm({ facility, onClose }) {
  const queryClient = useQueryClient();
  const [sports, setSports] = useState(
    (facility.supportedSports || []).join(", ")
  );
  const [amenities, setAmenities] = useState(
    (facility.amenities || []).join(", ")
  );
  const [photos, setPhotos] = useState([]); // new uploads, up to 3
  const [saving, setSaving] = useState(false);

  const updateMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("supportedSports", JSON.stringify(toArray(sports)));
      formData.append("amenities", JSON.stringify(toArray(amenities)));
      Array.from(photos)
        .slice(0, 3)
        .forEach((file) => formData.append("photos", file));
      return axiosInstance.put(
        `/users/owner/facilities/${facility._id || facility.id}`,
        formData
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owner-facilities"] });
      onClose();
    },
    onError: (err) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update facility";
      alert(msg);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    updateMutation.mutate(undefined, { onSettled: () => setSaving(false) });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-green-100 shadow-lg p-6 space-y-4"
    >
      <h3 className="text-lg font-semibold text-green-900">Edit Facility</h3>

      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Supported Sports
        </label>
        <input
          value={sports}
          onChange={(e) => setSports(e.target.value)}
          className="w-full border border-green-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent bg-green-50/50 text-green-900"
          placeholder="e.g., Badminton, Tennis, Football"
        />
        <p className="text-xs text-gray-500 mt-1">
          Enter sports separated by commas
        </p>
        {sports && (
          <div className="mt-2 p-2 bg-green-50 rounded-lg border border-green-200">
            <p className="text-xs text-green-700 font-medium mb-1">Preview:</p>
            <p className="text-sm text-green-800">{showPreview(sports)}</p>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Amenities
        </label>
        <input
          value={amenities}
          onChange={(e) => setAmenities(e.target.value)}
          className="w-full border border-green-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent bg-green-50/50 text-green-900"
          placeholder="e.g., Parking, Locker Room, WiFi"
        />
        <p className="text-xs text-gray-500 mt-1">
          Enter amenities separated by commas
        </p>
        {amenities && (
          <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-xs text-blue-700 font-medium mb-1">Preview:</div>
            <p className="text-sm text-blue-800">{showPreview(amenities)}</p>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Photos (max 3)
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setPhotos(e.target.files)}
        />
        <p className="text-xs text-gray-500 mt-1">
          Uploading new photos will replace the current ones.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-5 py-2 rounded-lg font-semibold"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function AddFacilityForm({ onClose }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    sports: "",
    amenities: "",
    photos: [],
  });
  const [saving, setSaving] = useState(false);

  const createMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("address", form.address);
      formData.append("city", form.city);
      formData.append("state", form.state);
      formData.append("zip", form.zip);
      formData.append("supportedSports", JSON.stringify(toArray(form.sports)));
      formData.append("amenities", JSON.stringify(toArray(form.amenities)));
      Array.from(form.photos)
        .slice(0, 3)
        .forEach((file) => formData.append("photos", file));
      return axiosInstance.post("/users/owner/facilities", formData);
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["owner-facilities"] });
      alert(res?.data?.message || "Facility added successfully");
      onClose();
    },
    onError: (err) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to add facility";
      alert(msg);
    },
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((p) => ({ ...p, [name]: files ? files : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!form.name.trim() || !form.description.trim() || !form.address.trim() || 
        !form.city.trim() || !form.state.trim() || !form.zip.trim()) {
      alert("Please fill in all required fields");
      return;
    }
    
    setSaving(true);
    createMutation.mutate(undefined, { onSettled: () => setSaving(false) });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-green-100 shadow-lg p-6 space-y-4"
    >
      <h3 className="text-lg font-semibold text-green-900">Add New Facility</h3>
      <p className="text-sm text-gray-600 mb-4">
        <span className="text-red-500">*</span> indicates required fields
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-green-200 rounded-xl px-4 py-3 bg-green-50/50 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            required
            className="w-full border border-green-200 rounded-xl px-4 py-3 bg-green-50/50 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Address <span className="text-red-500">*</span>
          </label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            required
            className="w-full border border-green-200 rounded-xl px-4 py-3 bg-green-50/50 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-1">
            State <span className="text-red-500">*</span>
          </label>
          <input
            name="state"
            value={form.state}
            onChange={handleChange}
            required
            className="w-full border border-green-200 rounded-xl px-4 py-3 bg-green-50/50 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            ZIP <span className="text-red-500">*</span>
          </label>
          <input
            name="zip"
            value={form.zip}
            onChange={handleChange}
            required
            className="w-full border border-green-200 rounded-xl px-4 py-3 bg-green-50/50 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-gray-600 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows={3}
            className="w-full border border-green-200 rounded-xl px-4 py-3 bg-green-50/50 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Supported Sports
          </label>
          <input
            name="sports"
            value={form.sports}
            onChange={handleChange}
            placeholder="e.g., Badminton, Tennis, Football"
            className="w-full border border-green-200 rounded-xl px-4 py-3 bg-green-50/50 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter sports separated by commas
          </p>
          {form.sports && (
            <div className="mt-2 p-2 bg-green-50 rounded-lg border border-green-200">
              <p className="text-xs text-green-700 font-medium mb-1">Preview:</p>
              <p className="text-sm text-green-800">{showPreview(form.sports)}</p>
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Amenities
          </label>
          <input
            name="amenities"
            value={form.amenities}
            onChange={handleChange}
            placeholder="e.g., Parking, Locker Room, WiFi"
            className="w-full border border-green-200 rounded-xl px-4 py-3 bg-green-50/50 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter amenities separated by commas
          </p>
          {form.amenities && (
            <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-700 font-medium mb-1">Preview:</p>
              <p className="text-sm text-blue-800">{showPreview(form.amenities)}</p>
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Photos (max 3)
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setForm((p) => ({ ...p, photos: e.target.files }))}
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold disabled:opacity-60"
        >
          {saving ? "Adding..." : "Add Facility"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-5 py-2 rounded-lg font-semibold"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function Facilities() {
  const [editing, setEditing] = useState(null); // facility being edited
  const [showCreate, setShowCreate] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["owner-facilities"],
    queryFn: async () => {
      const res = await axiosInstance.get("/users/owner/facilities");
      return res.data?.data || [];
    },
  });

  const facilities = useMemo(() => data || [], [data]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Your Facilities
          </h1>
          <p className="text-gray-600">
            View and manage your sports facilities.
          </p>
        </div>
        <button
          onClick={() => setShowCreate((s) => !s)}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-5 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl"
        >
          {showCreate ? "Close" : "+ Add Facility"}
        </button>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-72 bg-gray-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      )}

      {isError && (
        <div className="text-center text-red-600">
          Failed to load facilities.
        </div>
      )}

      {!isLoading && !isError && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((f) => (
            <div key={f._id || f.id} className="space-y-4">
              <FacilityCard
                facility={f}
                onEditClick={(fac) => setEditing(fac)}
              />
              {editing && editing._id === f._id && (
                <EditFacilityForm
                  facility={editing}
                  onClose={() => setEditing(null)}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {showCreate && (
        <div className="mt-8">
          <AddFacilityForm onClose={() => setShowCreate(false)} />
        </div>
      )}
    </div>
  );
}

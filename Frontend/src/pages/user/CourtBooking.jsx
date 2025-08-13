import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import { Button } from "../../components/ui/button";
import { Navbar } from "../../components/ui/required/Navbar";

export default function CourtBooking() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Form state
  const [selectedSport, setSelectedSport] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);

  // Fetch venue details
  const {
    data: venue,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["venue", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/users/venues/${id}`);
      return res.data?.data;
    },
    enabled: !!id,
  });

  // Set default sport when venue loads
  useEffect(() => {
    if (venue?.sportTypes?.length > 0) {
      setSelectedSport(venue.sportTypes[0]);
    }
  }, [venue]);

  // Calculate total amount when duration changes
  useEffect(() => {
    if (venue?.startingPrice && duration) {
      setTotalAmount(venue.startingPrice * duration);
    }
  }, [venue?.startingPrice, duration]);

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split("T")[0];

  // Generate time slots from 6 AM to 10 PM
  const timeSlots = [];
  for (let hour = 6; hour <= 22; hour++) {
    const time = `${hour.toString().padStart(2, "0")}:00`;
    timeSlots.push(time);
  }

  // Duration options
  const durationOptions = [1, 2, 3, 4, 5];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div className="animate-pulse">
            <div className="h-12 bg-gradient-to-r from-green-200 to-emerald-200 rounded-xl w-1/3 mb-8"></div>
            <div className="h-96 bg-gradient-to-r from-green-200 to-emerald-200 rounded-xl mb-8"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !venue) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-red-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Venue Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The venue you're looking for doesn't exist.
            </p>
            <Link
              to="/"
              className="text-green-600 hover:text-green-700 font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleContinueToPayment = () => {
    navigate(`/payment/${id}`, {
      state: {
        venue,
        bookingDetails: {
          selectedSport,
          selectedDate,
          startTime,
          duration,
          totalAmount,
          pricePerHour: venue?.startingPrice || 0,
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent mb-2">
            Court Booking
          </h1>
          <p className="text-green-600 font-medium">
            Book your preferred time slot
          </p>
        </div>

        {/* Venue Details Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-green-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex-shrink-0">
              <img
                src={venue.photos?.[0] || "/hero1.jpg"}
                alt={venue.name}
                className="w-20 h-20 rounded-xl object-cover shadow-lg"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-green-900 mb-2">
                {venue.name}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-green-700">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="font-medium">{venue.address}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500 text-lg">⭐</span>
                  <span className="font-semibold">{venue.rating || 0}</span>
                  <span className="text-green-600">
                    ({venue.reviews?.length || 0} reviews)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-green-100 p-8">
          <form className="space-y-6">
            {/* Sport Selection */}
            <div>
              <label className="block text-lg font-semibold text-green-800 mb-3">
                Select Sport
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {venue.sportTypes?.map((sport) => (
                  <button
                    key={sport}
                    type="button"
                    onClick={() => setSelectedSport(sport)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 font-medium ${
                      selectedSport === sport
                        ? "border-green-500 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 shadow-md"
                        : "border-green-200 bg-white hover:border-green-300 hover:bg-green-50 text-green-700"
                    }`}
                  >
                    {sport}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-lg font-semibold text-green-800 mb-3">
                Select Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  min={today}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full border-2 border-green-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500 bg-green-50/50 text-green-900 font-medium shadow-sm pr-12"
                  ref={(input) => (window._dateInput = input)}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500 focus:outline-none"
                  onClick={() => {
                    // Focus the input to open the native date picker
                    if (window._dateInput)
                      window._dateInput.showPicker?.() ||
                        window._dateInput.focus();
                  }}
                  aria-label="Open calendar"
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Start Time Selection */}
            <div>
              <label className="block text-lg font-semibold text-green-800 mb-3">
                Start Time
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setStartTime(time)}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 font-medium ${
                      startTime === time
                        ? "border-green-500 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 shadow-md"
                        : "border-green-200 bg-white hover:border-green-300 hover:bg-green-50 text-green-700"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration Selection */}
            <div>
              <label className="block text-lg font-semibold text-green-800 mb-3">
                Duration (Hours)
              </label>
              <div className="grid grid-cols-5 gap-3">
                {durationOptions.map((hours) => (
                  <button
                    key={hours}
                    type="button"
                    onClick={() => setDuration(hours)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 font-medium ${
                      duration === hours
                        ? "border-green-500 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 shadow-md"
                        : "border-green-200 bg-white hover:border-green-300 hover:bg-green-50 text-green-700"
                    }`}
                  >
                    {hours}h
                  </button>
                ))}
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-green-800">
                  Price Summary
                </h3>
                <div className="text-right">
                  <p className="text-sm text-green-600">Price per hour</p>
                  <p className="text-lg font-bold text-green-800">
                    ₹{venue.startingPrice || 0}
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-green-700">Duration</span>
                <span className="font-semibold text-green-800">
                  {duration} hour{duration !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="border-t border-green-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-green-800">
                    Total Amount
                  </span>
                  <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    ₹{totalAmount}
                  </span>
                </div>
              </div>
            </div>

            {/* Continue to Payment Button */}
            <div className="pt-4">
              <Button
                type="button"
                onClick={handleContinueToPayment}
                disabled={
                  !selectedSport || !selectedDate || !startTime || !duration
                }
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                Continue to Payment - ₹{totalAmount}
              </Button>
            </div>
          </form>
        </div>

        {/* Back Button */}
        <div className="text-center mt-8">
          <Link
            to={`/venue/${id}`}
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium hover:underline"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Venue Details
          </Link>
        </div>
      </div>
    </div>
  );
}

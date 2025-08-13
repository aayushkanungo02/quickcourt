import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import { Navbar } from "../../components/ui/required/Navbar";
import useAuthUser from "../../hooks/useAuthuser";

export default function VenueDetail() {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { authUser } = useAuthUser();

  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSport, setReviewSport] = useState("");

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

  const createReviewMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await axiosInstance.post(
        `/users/venues/${id}/reviews`,
        payload,
        { withCredentials: true }
      );
      return res.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["venue", id] });
      setIsReviewOpen(false);
      setReviewComment("");
      setReviewRating(5);
      setReviewSport("");
    },
  });

  const images = venue?.photos || [];
  const operatingHours = {
    monday: { open: "06:00", close: "22:00" },
    tuesday: { open: "06:00", close: "22:00" },
    wednesday: { open: "06:00", close: "22:00" },
    thursday: { open: "06:00", close: "22:00" },
    friday: { open: "06:00", close: "22:00" },
    saturday: { open: "06:00", close: "22:00" },
    sunday: { open: "06:00", close: "22:00" },
  };

  // Sport icons mapping
  const getSportIcon = (sport) => {
    const sportIcons = {
      Football: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10S2 17.514 2 12 6.486 2 12 2zm0 2c-4.411 0-8 3.589-8 8s3.589 8 8 8 8-3.589 8-8-3.589-8-8-8zm0 1c1.018 0 1.985.217 2.858.608l-1.986 3.441L12 8.5l-.872.549L9.142 5.608C10.015 4.217 10.982 4 12 4z" />
        </svg>
      ),
      Basketball: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10S2 17.514 2 12 6.486 2 12 2zm0 2c-4.411 0-8 3.589-8 8s3.589 8 8 8 8-3.589 8-8-3.589-8-8-8zm0 1c1.306 0 2.518.347 3.57.953L12 8.83 8.43 5.953C9.482 4.347 10.694 4 12 4z" />
        </svg>
      ),
      Cricket: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.04 3.87c-.1-.1-.26-.1-.36 0L12 6.55 9.32 3.87c-.1-.1-.26-.1-.36 0-.1.1-.1.26 0 .36L11.64 7l-2.68 2.77c-.1.1-.1.26 0 .36.1.1.26.1.36 0L12 7.45l2.68 2.68c.1.1.26.1.36 0 .1-.1.1-.26 0-.36L12.36 7l2.68-2.77c.1-.1.1-.26 0-.36z" />
        </svg>
      ),
      Tennis: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z" />
        </svg>
      ),
      Badminton: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6.8 2.1L5.4 3.5l3.6 3.6c-.4.7-.6 1.5-.6 2.4 0 2.8 2.2 5 5 5s5-2.2 5-5-2.2-5-5-5c-.9 0-1.7.2-2.4.6L6.8 2.1zm6.6 4.4c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3z" />
        </svg>
      ),
    };

    return (
      sportIcons[sport] || (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      )
    );
  };

  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="animate-pulse">
            {/* Header skeleton */}
            <div className="bg-white/80 backdrop-blur-sm shadow-lg border border-gray-100 rounded-xl p-4 mb-8">
              <div className="h-6 bg-gradient-to-r from-green-200 to-emerald-200 rounded-lg w-32"></div>
            </div>

            {/* Main content skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                  <div className="h-96 bg-gradient-to-r from-gray-200 to-green-100 rounded-t-2xl"></div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-100">
                  <div className="h-12 bg-gradient-to-r from-green-200 to-emerald-200 rounded-xl"></div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-100">
                  <div className="h-6 bg-gradient-to-r from-gray-200 to-green-100 rounded-lg mb-4 w-24"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-green-100 rounded w-full"></div>
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-green-100 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !venue) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center bg-white/90 backdrop-blur-sm p-10 rounded-2xl shadow-2xl border border-gray-100">
            <div className="w-20 h-20 bg-gradient-to-r from-red-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Venue Not Found
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              The venue you're looking for doesn't exist or may have been
              removed.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
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
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      <Navbar />

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold text-lg hover:bg-green-50 px-3 py-2 rounded-lg transition-all duration-200"
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
              Back to Venues
            </Link>

            {/* Venue title and rating */}
            <div className="text-right">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {venue.name}
              </h1>
              <div className="flex items-center justify-end gap-2">
                <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-lg border border-yellow-200">
                  <svg
                    className="w-4 h-4 text-yellow-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span className="text-yellow-700 font-semibold">
                    {venue.rating || "4.5"}
                  </span>
                </div>
                <span className="text-2xl font-bold text-green-700">
                  ₹{venue.startingPrice || 0}
                  <span className="text-sm font-normal text-gray-600">/hr</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Image Gallery (keeping as is) */}
          <div className="lg:col-span-2">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              {images.length > 0 ? (
                <div className="relative">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={images[currentImageIndex]}
                      alt={`${venue.name} - Image ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Image Navigation Dots */}
                  {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-3 h-3 rounded-full transition-all duration-200 ${
                            index === currentImageIndex
                              ? "bg-white shadow-lg scale-125"
                              : "bg-white/50 hover:bg-white/75"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-[4/3] bg-gradient-to-r from-gray-100 to-green-50 flex items-center justify-center">
                  <div className="text-center">
                    <svg
                      className="w-16 h-16 text-gray-400 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-gray-500 text-lg">No images available</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Booking & Info */}
          <div className="space-y-6">
            {/* Book This Venue Button */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-100">
              <Button
                onClick={() => navigate(`/venue/${id}/book`)}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Book This Venue
              </Button>
            </div>

            {/* Address */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-600"
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
                Address
              </h3>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-gray-700 font-medium leading-relaxed">
                  {venue.address}
                </p>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Operating Hours
              </h3>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-3">
                {Object.entries(operatingHours).map(([day, hours]) => (
                  <div
                    key={day}
                    className="flex justify-between items-center py-1"
                  >
                    <span className="text-gray-700 capitalize font-medium">
                      {day}
                    </span>
                    <span className="text-gray-900 font-semibold bg-white px-3 py-1 rounded-lg shadow-sm">
                      {formatTime(hours.open)} - {formatTime(hours.close)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>



        {/* Continuous Professional Sections without shadows */}
        <div className="mt-12 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-3xl overflow-hidden">
          {/* Sports Available Section */}
          <div className="p-10 border-b border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-10 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
              </div>
              Sports Available
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {venue.sportTypes?.map((sport, index) => (
                <div
                  key={index}
                  className="group relative bg-white border-2 border-gray-200 rounded-2xl p-6 text-center cursor-pointer transform transition-all duration-300 hover:scale-110 hover:border-green-400 hover:-translate-y-2 hover:shadow-2xl hover:shadow-green-200/50"
                >
                  <div className="relative z-10">
                    <div className="text-green-600 group-hover:text-green-700 transition-colors duration-300 mb-4 flex justify-center">
                      {getSportIcon(sport)}
                    </div>
                    <div className="text-gray-800 group-hover:text-gray-900 font-bold text-lg transition-colors duration-300">
                      {sport}
                    </div>
                  </div>

                  {/* Hover background effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Floating effect indicator */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl opacity-0 group-hover:opacity-20 blur-lg transition-all duration-300"></div>
                </div>
              )) || (
                <div className="col-span-full text-center py-16">
                  <svg
                    className="w-20 h-20 text-gray-300 mx-auto mb-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.674-2.64"
                    />
                  </svg>
                  <p className="text-gray-400 text-xl font-medium">
                    No sports information available
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Amenities Section - Different Style */}
          <div className="p-10 border-b border-gray-200 bg-gradient-to-r from-blue-25 to-indigo-25">
            <h2 className="text-3xl font-bold text-gray-900 mb-10 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              Premium Amenities
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {venue.amenities?.map((amenity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-xl p-4 hover:bg-white hover:border-blue-300 transition-all duration-200 hover:scale-105"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div className="text-gray-800 font-semibold text-base">
                    {amenity}
                  </div>
                </div>
              )) || (
                <div className="col-span-full text-center py-16">
                  <svg
                    className="w-20 h-20 text-gray-300 mx-auto mb-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.674-2.64"
                    />
                  </svg>
                  <p className="text-gray-400 text-xl font-medium">
                    No amenities information available
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* About Venue Section - Clean minimal style */}
          <div className="p-10 bg-gradient-to-r from-purple-25 to-pink-25">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              About This Venue
            </h2>

            <div className="max-w-4xl">
              <p className="text-gray-700 leading-relaxed text-lg font-medium bg-white/50 backdrop-blur-sm border border-purple-100 rounded-2xl p-8">
                {venue.description ||
                  "This venue offers premium facilities for sports and recreational activities. Our state-of-the-art equipment and professional-grade courts provide the perfect environment for both casual games and competitive training sessions. Whether you're looking to improve your skills or just have fun with friends, our venue delivers an exceptional experience with top-notch amenities and flexible booking options."}
              </p>
            </div>
          </div>

          {/* Reviews Section - Enhanced UI at the bottom */}
          <div className="p-10 bg-gradient-to-r from-yellow-25 to-orange-25 border-t border-gray-200">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.383 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.383-2.46a1 1 0 00-1.176 0l-3.383 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.383-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.966z"
                    />
                  </svg>
                </div>
                Customer Reviews
                {venue.rating && (
                  <span className="text-lg font-normal text-gray-600 ml-4">
                    ({venue.rating.toFixed(1)} ★ average)
                  </span>
                )}
              </h2>
              {authUser ? (
                <button
                  onClick={() => setIsReviewOpen(true)}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  aria-label="Add Review"
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Write a Review
                </button>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
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
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  Login to Review
                </Link>
              )}
            </div>

            {/* Reviews Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {venue.reviews?.length ? (
                venue.reviews.slice(0, 6).map((r, idx) => (
                  <div
                    key={idx}
                    className="bg-white/80 backdrop-blur-sm border border-yellow-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <img
                        src={r.avatar || "/default-avatar.png"}
                        alt={r.user}
                        className="w-12 h-12 rounded-full object-cover border-2 border-yellow-200"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-gray-900 text-lg">
                            {r.user}
                          </h4>
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-600 font-bold text-lg">
                              {r.rating.toFixed ? r.rating.toFixed(1) : r.rating}
                            </span>
                            <svg
                              className="w-5 h-5 text-yellow-500"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          </div>
                        </div>
                        {r.sportType && (
                          <div className="text-sm text-gray-600 bg-yellow-100 px-2 py-1 rounded-full inline-block mt-1">
                            {r.sportType}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-gray-700 leading-relaxed">
                      "{r.comment}"
                    </div>
                    <div className="text-xs text-gray-500 mt-3">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                  <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                      className="w-12 h-12 text-yellow-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.383 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.383-2.46a1 1 0 00-1.176 0l-3.383 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.383-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.966z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Be the First to Review!
                  </h3>
                  <p className="text-gray-600">
                    Share your experience and help others discover this amazing venue.
                  </p>
                </div>
              )}
            </div>

            {/* Show More Reviews Button */}
            {venue.reviews?.length > 6 && (
              <div className="text-center">
                <button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                  View All Reviews ({venue.reviews.length})
                </button>
              </div>
            )}
          </div>

          {/* Review Modal */}
          {isReviewOpen && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-gray-900">
                      Write Your Review
                    </h3>
                    <button
                      onClick={() => setIsReviewOpen(false)}
                      className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    createReviewMutation.mutate({
                      rating: Number(reviewRating),
                      comment: reviewComment,
                      sportType: reviewSport || undefined,
                    });
                  }}
                  className="p-6 space-y-6"
                >
                  <div>
                    <label className="block text-gray-700 font-semibold mb-3 text-lg">
                      Your Rating
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className={`text-3xl transition-colors ${
                            star <= reviewRating ? 'text-yellow-500' : 'text-gray-300'
                          } hover:text-yellow-400`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {reviewRating === 1 && "Poor"}
                      {reviewRating === 2 && "Fair"}
                      {reviewRating === 3 && "Good"}
                      {reviewRating === 4 && "Very Good"}
                      {reviewRating === 5 && "Excellent"}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Sport Type (Optional)
                    </label>
                    <input
                      value={reviewSport}
                      onChange={(e) => setReviewSport(e.target.value)}
                      placeholder="e.g., Football, Tennis, Badminton"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Your Experience
                    </label>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      rows={4}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                      placeholder="Share your experience with this venue..."
                      required
                    />
                  </div>
                  
                  <div className="flex items-center gap-4 pt-4">
                    <Button
                      type="submit"
                      disabled={createReviewMutation.isLoading}
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                      {createReviewMutation.isLoading ? (
                        <div className="flex items-center gap-2">
                          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </div>
                      ) : (
                        "Submit Review"
                      )}
                    </Button>
                    <button
                      type="button"
                      onClick={() => setIsReviewOpen(false)}
                      className="px-6 py-3 text-lg font-semibold rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                  </div>
                  
                  {createReviewMutation.isError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
                      Failed to submit review. Please try again.
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

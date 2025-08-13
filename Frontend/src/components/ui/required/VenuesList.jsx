import React from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../../lib/axios";
import VenueCard from "./venueCard";
import { Link } from "react-router-dom";

export function VenuesList({ searchCity, onClearSearch }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["venues", { page: 1, limit: 9 }],
    queryFn: async () => {
      const res = await axiosInstance.get("/users/venues", {
        params: { page: 1, limit: 9 },
      });
      return res.data?.data;
    },
  });

  const venues = data?.venues || [];

  // Filter venues by city if searchCity is provided
  const filteredVenues = searchCity 
    ? venues.filter(venue => {
        // Backend returns location as city string, not as an object
        const venueCity = venue.location || "";
        return venueCity.toLowerCase().includes(searchCity.toLowerCase());
      })
    : venues;

  return (
    <section className="px-4 sm:px-6 py-12 bg-white max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-green-800 rounded-xl py-4 bg-green-50">
          Available Venues
        </h2>
        {searchCity && (
          <div className="mt-4 flex items-center justify-center gap-3 animate-fade-in">
            <span className="text-gray-600">
              🔍 Showing venues in: <span className="font-semibold text-green-700">{searchCity}</span>
            </span>
            <span className="text-sm text-gray-500">
              ({filteredVenues.length} venue{filteredVenues.length !== 1 ? 's' : ''} found)
            </span>
            <button
              onClick={onClearSearch}
              className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md transition-colors hover:bg-gray-400"
            >
              ✕ Clear Search
            </button>
          </div>
        )}
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="h-72 bg-gray-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-center text-red-600">Failed to load venues.</p>
      )}

      {!isLoading && !isError && (
        <>
          {filteredVenues.length === 0 ? (
            <div className="text-center py-12">
              {searchCity ? (
                <div>
                  <p className="text-gray-600 text-lg mb-4">
                    No venues found in <span className="font-semibold">{searchCity}</span>
                  </p>
                  <p className="text-gray-500 mb-6">
                    Try searching for a different city or check back later
                  </p>
                  <button
                    onClick={onClearSearch}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-colors duration-300"
                  >
                    Clear Search
                  </button>
                </div>
              ) : (
                <p className="text-gray-600 text-lg">No venues available at the moment.</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredVenues.map((v, idx) => (
                <VenueCard
                  key={`${v.id}-${idx}`}
                  id={v.id}
                  name={v.name}
                  location={v.location}
                  sport={
                    (Array.isArray(v.sportTypes)
                      ? v.sportTypes[0]
                      : v.sportTypes) || ""
                  }
                  pricePerHour={v.startingPrice || 0}
                  rating={v.rating || 0}
                  img={Array.isArray(v.photos) ? v.photos.slice(0, 3) : v.photos}
                />
              ))}
            </div>
          )}
        </>
      )}
      
      {!isLoading && !isError && filteredVenues.length > 0 && (
        <div className="flex justify-center mt-10">
          <Link
            to="/more-options"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg shadow-md transition-colors duration-300"
          >
            Show More Options
          </Link>
        </div>
      )}
    </section>
  );
}

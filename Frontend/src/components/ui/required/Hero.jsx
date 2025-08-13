import React, { useState } from "react";

export function Hero({ onSearch }) {
  const [searchInput, setSearchInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setIsSearching(true);
      onSearch(searchInput.trim());
      setSearchInput(""); // Clear input after search
      // Reset searching state after a short delay
      setTimeout(() => setIsSearching(false), 1000);
    }
  };

  return (
    <section className="flex flex-col md:flex-row items-center px-10 py-20 bg-gradient-to-r from-green-50 to-white min-h-[350px] gap-16">
      {/* Left side: Text + search */}
      <div className="flex flex-col flex-1 max-w-xl space-y-8">
        <h1 className="text-5xl font-extrabold leading-tight text-gray-900 drop-shadow-md">
          Find Players and Venues Nearby
        </h1>
        <p className="text-gray-700 text-lg max-w-lg">
          Seamlessly explore sports venues and connect with players in your area.
        </p>

        {/* Location Input + Search Button */}
        <form onSubmit={handleSubmit} className="flex max-w-md rounded-lg shadow-md overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-green-500 transition">
          <div className="flex-grow relative">
            <input
              type="text"
              placeholder="Enter your city (e.g., Mumbai, Delhi, Bangalore)"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full px-6 py-3 text-base focus:outline-none pl-12"
              disabled={isSearching}
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              🏙️
            </div>
          </div>
          <button
            type="submit"
            disabled={isSearching || !searchInput.trim()}
            className={`px-6 py-3 font-semibold transition-colors duration-300 ${
              isSearching || !searchInput.trim()
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {isSearching ? "🔍" : "Search"}
          </button>
        </form>
        
        {isSearching && (
          <p className="text-sm text-green-600 font-medium">
            🔍 Searching for venues in your area...
          </p>
        )}
      </div>

      {/* Right side: Image */}
      <div className="hidden md:flex flex-1 rounded-xl overflow-hidden shadow-lg shadow-green-300/40 h-[350px]">
        <img
          src="/hero.jpg"
          alt="Sports Venue"
          className="w-full h-full object-cover"
        />
      </div>
    </section>
  );
}

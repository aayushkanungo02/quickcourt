import React, { useState } from "react";
import { Navbar } from "@/components/ui/required/Navbar";
import { Hero } from "@/components/ui/required/Hero";
import { VenuesList } from "@/components/ui/required/VenuesList";
import { PopularSports } from "@/components/ui/required/PopularSports";
import { Footer } from "@/components/ui/required/Footer";

export default function UserHomePage() {
  const [searchCity, setSearchCity] = useState("");

  const handleSearch = (city) => {
    setSearchCity(city);
  };

  const clearSearch = () => {
    setSearchCity("");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Hero onSearch={handleSearch} />
        <VenuesList searchCity={searchCity} onClearSearch={clearSearch} />
        <PopularSports />
      </main>
      <Footer />
    </div>
  );
}

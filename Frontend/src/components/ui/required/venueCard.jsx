import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

export default function VenueCard({
  id,
  name,
  location,
  sport,
  pricePerHour,
  rating,
  img,
}) {
  const images = useMemo(() => {
    if (Array.isArray(img) && img.length) return img;
    if (typeof img === "string" && img) return [img];
    return ["/hero1.jpg"]; // fallback
  }, [img]);

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % images.length);
    }, 2500);
    return () => clearInterval(id);
  }, [images]);

  return (
    <Link
      to={`/venue/${id}`}
      className="block border rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white flex flex-col group hover:-translate-y-2 transform"
    >
      <div className="h-48 w-full overflow-hidden rounded-t-xl relative">
        {images.map((src, idx) => (
          <img
            key={`${id}-${idx}`}
            src={src}
            alt={name}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              idx === current ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold mb-1 text-gray-900 group-hover:text-green-600 transition-colors">
          {name}
        </h3>
        <p className="text-gray-600 mb-1">{location}</p>
        <p className="text-green-700 font-semibold mb-3">{sport}</p>

        <div className="mt-auto">
          <p className="text-gray-900 font-semibold text-lg">
            ₹{pricePerHour} / hour
          </p>
          <p className="mt-1 text-yellow-500 font-semibold flex items-center">
            <span className="mr-1">⭐</span> {rating}
          </p>
        </div>
      </div>
    </Link>
  );
}
